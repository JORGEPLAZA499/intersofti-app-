import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Wifi,
  ShieldCheck,
  Usb,
  EthernetPort,
  HardDrive,
  FileText,
  Download,
  MemoryStick,
  Monitor,
  Volume2,
  Power,
  Thermometer,
  Ruler,
  Terminal,
  Award,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import boxImage from '@/assets/box-ai-ironwatch.png.asset.json';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';

type SpecRow = { label: string; value: string };
type SpecSection = { title: string; icon: keyof typeof sectionIcons; rows: SpecRow[] };

const sectionIcons = {
  system: Cpu,
  memory: MemoryStick,
  video: Monitor,
  audio: Volume2,
  network: Wifi,
  io: Usb,
  power: Power,
  physical: Ruler,
  software: Terminal,
  environment: Thermometer,
  compliance: Award,
} as const;

const copy = {
  en: {
    title: 'IronWatch AI Box',
    intro:
      'Fanless ARM industrial computer powered by the Rockchip RK3588 with a 6 TOPS NPU. Built for edge AI inference, machine vision, industrial automation and secure on-premise deployments.',
    metaTitle: 'IronWatch AI | INTERSOFTI',
    metaDesc:
      'IronWatch AI Box — Rockchip RK3588 industrial edge computer with 6 TOPS NPU, dual GbE, 6 serial ports, HDMI in/out, 5G/Wi-Fi and Android/Linux support.',
    features: [
      { title: 'Rockchip RK3588 · 6 TOPS NPU', description: '4× Cortex-A76 + 4× Cortex-A55 with a dedicated NPU supporting INT4/INT8/INT16/FP16 for on-device inference.' },
      { title: '8K Video I/O', description: 'HDMI 2.1 4K60 out and HDMI 2.0 4K30 in, hardware decoding up to 8K60 (H.265/AV1).' },
      { title: 'Industrial connectivity', description: '2× GbE with 4kV surge protection, 2× CAN, 4× USB 3.0 and up to 6 RS-232/485 serial ports.' },
      { title: 'Wireless expansion', description: 'Onboard Wi-Fi 5 + BT 5.2, M.2 Key B slot for 4G/5G module and Micro SIM.' },
      { title: 'Fanless & rugged', description: 'Passive cooling, metal chassis, 12V DC-IN (optional 9~36V), IEC 61000-4 EMC protection.' },
      { title: 'Multi-OS ready', description: 'Debian 11, Ubuntu 20.04/22.04, Android 12 and OpenHarmony 5.0 with Preempt-RT and Docker.' },
    ],
    techSheetButton: 'Technical sheet',
    solutionsButton: 'Smart Solutions',
    techSheetTitle: 'Technical Datasheet',
    techSheetSubtitle: 'IronWatch AI Box · Rockchip RK3588 Industrial Edge Computer',
    downloadPdf: 'Download PDF',
    close: 'Close',
    highlights: [
      { label: 'Processor', value: 'RK3588 Octa-core' },
      { label: 'AI Performance', value: '6 TOPS NPU' },
      { label: 'Memory', value: 'up to 16 GB LPDDR4X' },
      { label: 'Storage', value: 'eMMC + NVMe M.2' },
    ],
    sections: [
      { title: 'System', icon: 'system', rows: [
        { label: 'SoC', value: 'Rockchip RK3588J / RK3588 · octa-core 64-bit' },
        { label: 'CPU', value: '4× Cortex-A76 up to 2.4 GHz + 4× Cortex-A55 up to 1.8 GHz' },
        { label: 'NPU', value: '6 TOPS RKNN · INT4/INT8/INT16/FP16 · TensorFlow, PyTorch, Caffe, ONNX, MXNet' },
      ]},
      { title: 'Memory & Storage', icon: 'memory', rows: [
        { label: 'RAM', value: 'Onboard 4 / 8 / 16 GB dual-channel LPDDR4X' },
        { label: 'eMMC', value: '32 / 64 / 128 GB eMMC 5.1' },
        { label: 'Expansion', value: '1× M.2 2280 PCIe x4 (NVMe SSD or AI accelerator) · 1× TF card slot' },
      ]},
      { title: 'Video', icon: 'video', rows: [
        { label: 'GPU', value: 'Arm Mali-G610 MP4 · OpenGL ES 3.2, OpenCL 2.2, Vulkan 1.2' },
        { label: 'Decode', value: 'H.265 / H.264 / VP9 / AV1 / AVS2 up to 8K@60' },
        { label: 'Encode', value: 'H.265 / H.264 up to 8K@30' },
        { label: 'Video I/O', value: '1× HDMI 2.1 Tx (4K60 out) · 1× HDMI 2.0 Rx (4K30 in)' },
      ]},
      { title: 'Audio', icon: 'audio', rows: [
        { label: 'Codec', value: 'ES8336' },
        { label: 'Interface', value: '1× 3.5 mm Line Out' },
      ]},
      { title: 'Network', icon: 'network', rows: [
        { label: 'Ethernet', value: '2× RJ45 10/100/1000 Mbps · 4 kV surge protection' },
        { label: 'Wi-Fi / BT', value: 'AW-CM358 · Wi-Fi 5 (802.11ac) + Bluetooth 5.2' },
        { label: '5G / 4G', value: '1× M.2 Key B (USB 3.0) + 1× Micro SIM slot' },
        { label: 'Optional', value: 'LoRa / Zigbee expansion module' },
      ]},
      { title: 'I/O', icon: 'io', rows: [
        { label: 'Front', value: '4× USB 3.0 Type-A (1× OTG) · 2× DB9 RS-232/485 · 2× DB9 RS-232/TTL' },
        { label: 'Side', value: '2× DB9 RS-232/485/CAN · 1× DB9 GPIO (7-bit GPIO + 1-bit ADC) · 1× DB9 Debug' },
        { label: 'System', value: 'Independent watchdog · CR2032 RTC with scheduled on/off' },
      ]},
      { title: 'Power', icon: 'power', rows: [
        { label: 'Input', value: '12 V DC-IN (optional wide-voltage 9~36 V DC-IN)' },
        { label: 'Connector', value: '5.5 × 2.5 mm DC Jack · 2P-3.81 mm Phoenix · reverse-polarity protection' },
        { label: 'Controls', value: 'Power button · Recovery button · dual-color LED (customizable)' },
      ]},
      { title: 'Physical', icon: 'physical', rows: [
        { label: 'Dimensions', value: '187 × 135 × 54 mm' },
        { label: 'Mounting', value: 'Desktop · book-style wall mount · DIN-rail · VESA' },
      ]},
      { title: 'Software', icon: 'software', rows: [
        { label: 'OS', value: 'Debian 11 · Ubuntu 20.04/22.04 · Android 12 · OpenHarmony 5.0' },
        { label: 'Framework', value: 'Preempt-RT real-time kernel · Qt · Docker' },
      ]},
      { title: 'Environment', icon: 'environment', rows: [
        { label: 'Operating', value: '0 ~ 50 °C' },
        { label: 'Storage', value: '-40 ~ 85 °C' },
        { label: 'Humidity', value: '10 % ~ 90 % RH, non-condensing' },
      ]},
      { title: 'Compliance', icon: 'compliance', rows: [
        { label: 'EMC', value: 'IEC 61000-4-2 ESD L3 (contact ±6 kV, air ±8 kV) · IEC 61000-4-4 EFT L4 (power ±4 kV, Ethernet ±2 kV)' },
        { label: 'Certification', value: 'CCC · CE Class A' },
      ]},
    ] satisfies SpecSection[],
  },
  pt: {
    title: 'IronWatch AI Box',
    intro:
      'Computador industrial ARM fanless com Rockchip RK3588 e NPU de 6 TOPS. Concebido para inferência de IA na borda, visão por computador, automação industrial e implementações seguras on-premise.',
    metaTitle: 'IronWatch AI | INTERSOFTI',
    metaDesc:
      'IronWatch AI Box — computador industrial Rockchip RK3588 com NPU 6 TOPS, GbE duplo, 6 portas série, HDMI in/out, 5G/Wi-Fi e suporte Android/Linux.',
    features: [
      { title: 'Rockchip RK3588 · NPU 6 TOPS', description: '4× Cortex-A76 + 4× Cortex-A55 com NPU dedicada (INT4/INT8/INT16/FP16) para inferência no dispositivo.' },
      { title: 'Vídeo 8K I/O', description: 'HDMI 2.1 saída 4K60 e HDMI 2.0 entrada 4K30, descodificação por hardware até 8K60 (H.265/AV1).' },
      { title: 'Conectividade industrial', description: '2× GbE com proteção 4 kV, 2× CAN, 4× USB 3.0 e até 6 portas série RS-232/485.' },
      { title: 'Expansão sem fios', description: 'Wi-Fi 5 + BT 5.2 integrados, slot M.2 Key B para módulo 4G/5G e Micro SIM.' },
      { title: 'Fanless e robusto', description: 'Arrefecimento passivo, chassis metálico, 12 V DC-IN (opcional 9~36 V), proteção EMC IEC 61000-4.' },
      { title: 'Multi-SO', description: 'Debian 11, Ubuntu 20.04/22.04, Android 12 e OpenHarmony 5.0 com Preempt-RT e Docker.' },
    ],
    techSheetButton: 'Ficha técnica',
    solutionsButton: 'Soluções Inteligentes',
    techSheetTitle: 'Ficha Técnica',
    techSheetSubtitle: 'IronWatch AI Box · Computador Industrial Edge Rockchip RK3588',
    downloadPdf: 'Descarregar PDF',
    close: 'Fechar',
    highlights: [
      { label: 'Processador', value: 'RK3588 Octa-core' },
      { label: 'Desempenho IA', value: 'NPU 6 TOPS' },
      { label: 'Memória', value: 'até 16 GB LPDDR4X' },
      { label: 'Armazenamento', value: 'eMMC + NVMe M.2' },
    ],
    sections: [
      { title: 'Sistema', icon: 'system', rows: [
        { label: 'SoC', value: 'Rockchip RK3588J / RK3588 · octa-core 64-bit' },
        { label: 'CPU', value: '4× Cortex-A76 até 2,4 GHz + 4× Cortex-A55 até 1,8 GHz' },
        { label: 'NPU', value: '6 TOPS RKNN · INT4/INT8/INT16/FP16 · TensorFlow, PyTorch, Caffe, ONNX, MXNet' },
      ]},
      { title: 'Memória e Armazenamento', icon: 'memory', rows: [
        { label: 'RAM', value: 'Onboard 4 / 8 / 16 GB LPDDR4X dual-channel' },
        { label: 'eMMC', value: '32 / 64 / 128 GB eMMC 5.1' },
        { label: 'Expansão', value: '1× M.2 2280 PCIe x4 (NVMe SSD ou acelerador IA) · 1× slot TF' },
      ]},
      { title: 'Vídeo', icon: 'video', rows: [
        { label: 'GPU', value: 'Arm Mali-G610 MP4 · OpenGL ES 3.2, OpenCL 2.2, Vulkan 1.2' },
        { label: 'Descodificação', value: 'H.265 / H.264 / VP9 / AV1 / AVS2 até 8K@60' },
        { label: 'Codificação', value: 'H.265 / H.264 até 8K@30' },
        { label: 'Vídeo I/O', value: '1× HDMI 2.1 Tx (saída 4K60) · 1× HDMI 2.0 Rx (entrada 4K30)' },
      ]},
      { title: 'Áudio', icon: 'audio', rows: [
        { label: 'Codec', value: 'ES8336' },
        { label: 'Interface', value: '1× Line Out 3,5 mm' },
      ]},
      { title: 'Rede', icon: 'network', rows: [
        { label: 'Ethernet', value: '2× RJ45 10/100/1000 Mbps · proteção surge 4 kV' },
        { label: 'Wi-Fi / BT', value: 'AW-CM358 · Wi-Fi 5 (802.11ac) + Bluetooth 5.2' },
        { label: '5G / 4G', value: '1× M.2 Key B (USB 3.0) + 1× slot Micro SIM' },
        { label: 'Opcional', value: 'Módulo de expansão LoRa / Zigbee' },
      ]},
      { title: 'I/O', icon: 'io', rows: [
        { label: 'Frontal', value: '4× USB 3.0 Type-A (1× OTG) · 2× DB9 RS-232/485 · 2× DB9 RS-232/TTL' },
        { label: 'Lateral', value: '2× DB9 RS-232/485/CAN · 1× DB9 GPIO (7-bit GPIO + 1-bit ADC) · 1× DB9 Debug' },
        { label: 'Sistema', value: 'Watchdog independente · RTC CR2032 com ligar/desligar programado' },
      ]},
      { title: 'Alimentação', icon: 'power', rows: [
        { label: 'Entrada', value: '12 V DC-IN (opcional wide-voltage 9~36 V DC-IN)' },
        { label: 'Conector', value: 'DC Jack 5,5 × 2,5 mm · Phoenix 2P-3,81 mm · proteção de polaridade inversa' },
        { label: 'Controlo', value: 'Botão Power · botão Recovery · LED bicolor (personalizável)' },
      ]},
      { title: 'Físico', icon: 'physical', rows: [
        { label: 'Dimensões', value: '187 × 135 × 54 mm' },
        { label: 'Montagem', value: 'Desktop · parede book-style · calha DIN · VESA' },
      ]},
      { title: 'Software', icon: 'software', rows: [
        { label: 'SO', value: 'Debian 11 · Ubuntu 20.04/22.04 · Android 12 · OpenHarmony 5.0' },
        { label: 'Frameworks', value: 'Kernel Preempt-RT · Qt · Docker' },
      ]},
      { title: 'Ambiente', icon: 'environment', rows: [
        { label: 'Operação', value: '0 ~ 50 °C' },
        { label: 'Armazenamento', value: '-40 ~ 85 °C' },
        { label: 'Humidade', value: '10 % ~ 90 % RH, sem condensação' },
      ]},
      { title: 'Conformidade', icon: 'compliance', rows: [
        { label: 'EMC', value: 'IEC 61000-4-2 ESD L3 (contacto ±6 kV, ar ±8 kV) · IEC 61000-4-4 EFT L4 (energia ±4 kV, Ethernet ±2 kV)' },
        { label: 'Certificação', value: 'CCC · CE Classe A' },
      ]},
    ] satisfies SpecSection[],
  },
  es: {
    title: 'IronWatch AI Box',
    intro:
      'Ordenador industrial ARM fanless con Rockchip RK3588 y NPU de 6 TOPS. Diseñado para inferencia de IA en el borde, visión artificial, automatización industrial y despliegues seguros on-premise.',
    metaTitle: 'IronWatch AI | INTERSOFTI',
    metaDesc:
      'IronWatch AI Box — ordenador industrial Rockchip RK3588 con NPU 6 TOPS, GbE dual, 6 puertos serie, HDMI in/out, 5G/Wi-Fi y soporte Android/Linux.',
    features: [
      { title: 'Rockchip RK3588 · NPU 6 TOPS', description: '4× Cortex-A76 + 4× Cortex-A55 con NPU dedicada (INT4/INT8/INT16/FP16) para inferencia en el dispositivo.' },
      { title: 'Vídeo 8K I/O', description: 'HDMI 2.1 salida 4K60 y HDMI 2.0 entrada 4K30, decodificación por hardware hasta 8K60 (H.265/AV1).' },
      { title: 'Conectividad industrial', description: '2× GbE con protección 4 kV, 2× CAN, 4× USB 3.0 y hasta 6 puertos serie RS-232/485.' },
      { title: 'Expansión inalámbrica', description: 'Wi-Fi 5 + BT 5.2 integrados, ranura M.2 Key B para módulo 4G/5G y Micro SIM.' },
      { title: 'Fanless y robusto', description: 'Refrigeración pasiva, chasis metálico, 12 V DC-IN (opcional 9~36 V), protección EMC IEC 61000-4.' },
      { title: 'Multi-SO', description: 'Debian 11, Ubuntu 20.04/22.04, Android 12 y OpenHarmony 5.0 con Preempt-RT y Docker.' },
    ],
    techSheetButton: 'Ficha técnica',
    solutionsButton: 'Soluciones Inteligentes',
    techSheetTitle: 'Ficha Técnica',
    techSheetSubtitle: 'IronWatch AI Box · Ordenador Industrial Edge Rockchip RK3588',
    downloadPdf: 'Descargar PDF',
    close: 'Cerrar',
    highlights: [
      { label: 'Procesador', value: 'RK3588 Octa-core' },
      { label: 'Rendimiento IA', value: 'NPU 6 TOPS' },
      { label: 'Memoria', value: 'hasta 16 GB LPDDR4X' },
      { label: 'Almacenamiento', value: 'eMMC + NVMe M.2' },
    ],
    sections: [
      { title: 'Sistema', icon: 'system', rows: [
        { label: 'SoC', value: 'Rockchip RK3588J / RK3588 · octa-core 64-bit' },
        { label: 'CPU', value: '4× Cortex-A76 hasta 2,4 GHz + 4× Cortex-A55 hasta 1,8 GHz' },
        { label: 'NPU', value: '6 TOPS RKNN · INT4/INT8/INT16/FP16 · TensorFlow, PyTorch, Caffe, ONNX, MXNet' },
      ]},
      { title: 'Memoria y Almacenamiento', icon: 'memory', rows: [
        { label: 'RAM', value: 'Onboard 4 / 8 / 16 GB LPDDR4X dual-channel' },
        { label: 'eMMC', value: '32 / 64 / 128 GB eMMC 5.1' },
        { label: 'Expansión', value: '1× M.2 2280 PCIe x4 (NVMe SSD o acelerador IA) · 1× ranura TF' },
      ]},
      { title: 'Vídeo', icon: 'video', rows: [
        { label: 'GPU', value: 'Arm Mali-G610 MP4 · OpenGL ES 3.2, OpenCL 2.2, Vulkan 1.2' },
        { label: 'Decodificación', value: 'H.265 / H.264 / VP9 / AV1 / AVS2 hasta 8K@60' },
        { label: 'Codificación', value: 'H.265 / H.264 hasta 8K@30' },
        { label: 'Vídeo I/O', value: '1× HDMI 2.1 Tx (salida 4K60) · 1× HDMI 2.0 Rx (entrada 4K30)' },
      ]},
      { title: 'Audio', icon: 'audio', rows: [
        { label: 'Codec', value: 'ES8336' },
        { label: 'Interfaz', value: '1× Line Out 3,5 mm' },
      ]},
      { title: 'Red', icon: 'network', rows: [
        { label: 'Ethernet', value: '2× RJ45 10/100/1000 Mbps · protección surge 4 kV' },
        { label: 'Wi-Fi / BT', value: 'AW-CM358 · Wi-Fi 5 (802.11ac) + Bluetooth 5.2' },
        { label: '5G / 4G', value: '1× M.2 Key B (USB 3.0) + 1× ranura Micro SIM' },
        { label: 'Opcional', value: 'Módulo de expansión LoRa / Zigbee' },
      ]},
      { title: 'E/S', icon: 'io', rows: [
        { label: 'Frontal', value: '4× USB 3.0 Type-A (1× OTG) · 2× DB9 RS-232/485 · 2× DB9 RS-232/TTL' },
        { label: 'Lateral', value: '2× DB9 RS-232/485/CAN · 1× DB9 GPIO (7-bit GPIO + 1-bit ADC) · 1× DB9 Debug' },
        { label: 'Sistema', value: 'Watchdog independiente · RTC CR2032 con encendido/apagado programado' },
      ]},
      { title: 'Alimentación', icon: 'power', rows: [
        { label: 'Entrada', value: '12 V DC-IN (opcional wide-voltage 9~36 V DC-IN)' },
        { label: 'Conector', value: 'DC Jack 5,5 × 2,5 mm · Phoenix 2P-3,81 mm · protección polaridad inversa' },
        { label: 'Control', value: 'Botón Power · botón Recovery · LED bicolor (personalizable)' },
      ]},
      { title: 'Físico', icon: 'physical', rows: [
        { label: 'Dimensiones', value: '187 × 135 × 54 mm' },
        { label: 'Montaje', value: 'Escritorio · pared book-style · carril DIN · VESA' },
      ]},
      { title: 'Software', icon: 'software', rows: [
        { label: 'SO', value: 'Debian 11 · Ubuntu 20.04/22.04 · Android 12 · OpenHarmony 5.0' },
        { label: 'Frameworks', value: 'Kernel Preempt-RT · Qt · Docker' },
      ]},
      { title: 'Entorno', icon: 'environment', rows: [
        { label: 'Operación', value: '0 ~ 50 °C' },
        { label: 'Almacenamiento', value: '-40 ~ 85 °C' },
        { label: 'Humedad', value: '10 % ~ 90 % HR, sin condensación' },
      ]},
      { title: 'Conformidad', icon: 'compliance', rows: [
        { label: 'EMC', value: 'IEC 61000-4-2 ESD L3 (contacto ±6 kV, aire ±8 kV) · IEC 61000-4-4 EFT L4 (energía ±4 kV, Ethernet ±2 kV)' },
        { label: 'Certificación', value: 'CCC · CE Clase A' },
      ]},
    ] satisfies SpecSection[],
  },
} as const;

export default function BoxAI() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.en;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = t.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    if (meta) meta.setAttribute('content', t.metaDesc);
    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, [t.metaTitle, t.metaDesc]);

  const featureIcons = [Cpu, Monitor, EthernetPort, Wifi, ShieldCheck, Terminal];

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, {
      scale: 1.5,
      backgroundColor: '#ffffff',
      useCORS: false,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('IronWatch_AI_RK3588_Datasheet.pdf');
  };

  return (
    <section style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-center w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl md:-ml-12 lg:-ml-20">
            <img
              src={boxImage.url}
              alt="IronWatch AI Box powered by Rockchip RK3588"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-auto block transition-opacity duration-200 -translate-y-8 md:-translate-y-16 lg:-translate-y-24 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, black 15%, transparent 88%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, black 15%, transparent 88%)',
              }}
            />

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => setOpen(true)}
                className="group relative overflow-hidden rounded-full bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_36px_-6px_hsl(var(--primary)/0.75)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  {t.techSheetButton}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Button>

              <Button
                asChild
                className="group relative overflow-hidden rounded-full border border-primary/40 bg-transparent px-8 py-6 text-base font-semibold text-white shadow-[0_0_24px_-6px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-primary/10 hover:shadow-[0_0_36px_-6px_hsl(var(--primary)/0.75)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link to="/box_ai/solutions">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    {t.solutionsButton}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">{t.intro}</p>

            <ul className="space-y-4 pt-2">
              {t.features.map((feature, i) => {
                const Icon = featureIcons[i % featureIcons.length];
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= Datasheet Dialog ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden p-0 gap-0 bg-white text-slate-900 border-0 shadow-2xl">
          <div className="max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-8 text-white">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    INTERSOFTI · Industrial Edge
                  </div>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight">{t.techSheetTitle}</h2>
                  <p className="mt-1 text-sm text-white/70">{t.techSheetSubtitle}</p>
                </div>
                <Button
                  onClick={handleDownloadPdf}
                  className="shrink-0 rounded-full bg-primary px-5 py-5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  {t.downloadPdf}
                </Button>
              </div>

              {/* Highlights */}
              <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {t.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-3"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                      {h.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">{h.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="px-6 sm:px-8 py-8 grid gap-4 md:grid-cols-2">
              {t.sections.map((section, si) => {
                const Icon = sectionIcons[section.icon];
                return (
                  <div
                    key={si}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                        {section.title}
                      </h3>
                    </div>
                    <dl className="divide-y divide-slate-100">
                      {section.rows.map((row, ri) => (
                        <div
                          key={ri}
                          className="grid grid-cols-[110px_1fr] gap-3 px-5 py-2.5 text-xs"
                        >
                          <dt className="font-semibold text-slate-500">{row.label}</dt>
                          <dd className="text-slate-800 leading-relaxed">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-slate-500">
                © INTERSOFTI · Rockchip RK3588 Industrial Edge Computer
              </p>
              <div className="flex gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-full">
                    {t.close}
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleDownloadPdf}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  {t.downloadPdf}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= Hidden PDF template ================= */}
      <div
        ref={pdfRef}
        className="fixed left-[-9999px] top-0 w-[210mm] bg-white p-10 text-[11px] text-slate-900"
      >
        <div className="border-b-4 border-primary pb-4 mb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            INTERSOFTI · Industrial Edge
          </div>
          <h2 className="text-2xl font-bold mt-1">{t.techSheetTitle}</h2>
          <p className="text-slate-600 mt-1">{t.techSheetSubtitle}</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {t.highlights.map((h, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <div className="text-[8px] uppercase tracking-widest text-slate-500 font-semibold">
                {h.label}
              </div>
              <div className="text-[11px] font-bold text-slate-900 mt-1">{h.value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {t.sections.map((section, si) => (
            <div key={si} className="border border-slate-200 rounded-lg overflow-hidden break-inside-avoid">
              <div className="bg-slate-900 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider">
                {section.title}
              </div>
              <table className="w-full">
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 px-4 font-semibold text-slate-600 w-1/4 align-top">
                        {row.label}
                      </td>
                      <td className="py-2 px-4 text-slate-900 align-top">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-[9px] text-slate-500 text-center">
          © INTERSOFTI · IronWatch AI Box · Rockchip RK3588 Industrial Edge Computer
        </div>
      </div>
    </section>
  );
}
