import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
      <Clock className="w-4 h-4 text-primary shrink-0" />
      <div className="flex items-center gap-1 text-sm font-mono font-bold text-foreground">
        <Unit value={timeLeft.days} label="d" />
        <span className="text-muted-foreground">:</span>
        <Unit value={timeLeft.hours} label="h" />
        <span className="text-muted-foreground">:</span>
        <Unit value={timeLeft.minutes} label="m" />
        <span className="text-muted-foreground">:</span>
        <Unit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <span>
      {String(value).padStart(2, '0')}
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </span>
  );
}

function getTimeLeft(target: Date) {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
