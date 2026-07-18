import React, { useEffect, useRef } from 'react';

export const BinaryBackground = React.forwardRef<HTMLCanvasElement>(
  function BinaryBackground(_props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };
      resize();
      window.addEventListener('resize', resize);

      const chars = '01';
      const fontSize = 16;
      const columns = Math.floor(canvas.offsetWidth / fontSize);
      const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50);

      const draw = () => {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          const alpha = 0.3 + Math.random() * 0.4;
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
          ctx.fillText(text, x, y);

          if (drops[i] * fontSize > canvas.offsetHeight && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 0.5 + Math.random() * 0.5;
        }
      };

      const interval = setInterval(draw, 45);
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', resize);
      };
    }, []);

    return (
      <canvas
        ref={(node) => {
          (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />
    );
  }
);
