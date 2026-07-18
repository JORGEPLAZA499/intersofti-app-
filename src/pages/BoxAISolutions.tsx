import { useEffect, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Factory,
  ShieldCheck,
  Truck,
  HardHat,
  Radio,
  Sprout,
  Store,
  Construction,
  Cpu,
  ScanFace,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

type IconKey =
  | 'factory'
  | 'quality'
  | 'logistics'
  | 'access'
  | 'ppe'
  | 'telecom'
  | 'agri'
  | 'retail'
  | 'construction'
  | 'custom';

const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  factory: Factory,
  quality: ScanFace,
  logistics: Truck,
  access: ShieldCheck,
  ppe: HardHat,
  telecom: Radio,
  agri: Sprout,
  retail: Store,
  construction: Construction,
  custom: Cpu,
};

type Utility = {
  icon: IconKey;
  title: string;
  short: string;
  full: string[];
};

type Copy = {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  learnMore: string;
  back: string;
  close: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  utilities: Utility[];
};

const copy: Record<'en' | 'pt' | 'es', Copy> = {
  es: {
    metaTitle: 'Soluciones Inteligentes IRON WATCH AI | INTERSOFTI',
    metaDesc:
      'Transformamos cámaras, sensores y equipos existentes en sistemas inteligentes: control, detección, calidad, seguridad y automatización con IRON WATCH AI Box.',
    eyebrow: 'IRON WATCH AI Box',
    title: 'Posibilidades ilimitadas',
    subtitle:
      'Una plataforma tecnológica para desarrollar soluciones inteligentes adaptadas a cada empresa.',
    intro:
      'Transformamos cámaras, sensores y equipos existentes en sistemas inteligentes capaces de analizar, detectar, controlar y automatizar procesos en tiempo real. Usted aporta el conocimiento de su sector y nosotros desarrollamos el software, la integración y la tecnología mediante IRON WATCH AI Box.',
    learnMore: 'Ver detalles',
    back: 'Volver',
    close: 'Cerrar',
    ctaTitle: 'No ofrecemos solamente un equipo.',
    ctaBody:
      'Ofrecemos una plataforma tecnológica para desarrollar soluciones inteligentes adaptadas a las necesidades específicas de cada empresa.',
    ctaButton: 'Hablar con un experto',
    utilities: [
      {
        icon: 'factory',
        title: 'Industria y fábricas',
        short: 'Control de líneas de producción, conteo de productos y sensores conectados.',
        full: [
          'Supervisión en tiempo real de líneas de producción con cámaras y sensores existentes.',
          'Conteo automático de productos, piezas o unidades por turno, hora o lote.',
          'Detección de paradas, cuellos de botella y micro-paros para optimizar el OEE.',
          'Integración con PLCs, SCADA y ERPs mediante RS-232/485, CAN, Ethernet o MQTT.',
          'Activación automática de alertas y automatismos ante anomalías detectadas.',
        ],
      },
      {
        icon: 'quality',
        title: 'Control de calidad visual',
        short: 'Inspección con IA, detección de defectos y trazabilidad automatizada.',
        full: [
          'Inspección visual automática mediante modelos de IA entrenados a medida.',
          'Detección de defectos, deformaciones, faltas de componentes o etiquetas incorrectas.',
          'Lectura de códigos, matrículas, seriales y OCR industrial en tiempo real.',
          'Trazabilidad completa: cada pieza queda registrada con imagen y resultado.',
          'Rechazo automático mediante señal a actuadores o robots de la línea.',
        ],
      },
      {
        icon: 'logistics',
        title: 'Logística y almacenes',
        short: 'Conteo, seguimiento de mercancías y control de flujos operativos.',
        full: [
          'Conteo automático de bultos, palets y cajas en muelles y cintas transportadoras.',
          'Seguimiento de mercancías por zonas del almacén mediante visión artificial.',
          'Control de aforo y ocupación de muelles de carga y descarga.',
          'Detección de vehículos, carretillas y personal en zonas restringidas.',
          'Integración con WMS y ERP para actualización en tiempo real del inventario.',
        ],
      },
      {
        icon: 'access',
        title: 'Seguridad y control de accesos',
        short: 'Identificación de personas y vehículos, autorizaciones y alertas.',
        full: [
          'Reconocimiento facial y de matrículas (LPR) con procesamiento local, sin depender de la nube.',
          'Autorización de accesos según listas blancas, horarios y niveles de permiso.',
          'Detección de intrusiones, merodeo y comportamientos anómalos.',
          'Envío de alertas instantáneas a personal de seguridad, apps o sistemas de central.',
          'Integración con tornos, barreras, cerraduras electrónicas y CCTV existente.',
        ],
      },
      {
        icon: 'ppe',
        title: 'Seguridad laboral (EPI)',
        short: 'Detección de cascos, chalecos, guantes y alertas ante riesgos.',
        full: [
          'Verificación automática de uso de casco, chaleco reflectante, guantes y calzado.',
          'Detección de trabajadores en zonas peligrosas o restringidas.',
          'Reconocimiento de caídas, posturas de riesgo y proximidad a maquinaria en movimiento.',
          'Registro de eventos con imagen para auditoría y cumplimiento normativo.',
          'Activación automática de alarmas visuales, sonoras o parada de equipos.',
        ],
      },
      {
        icon: 'telecom',
        title: 'Telecomunicaciones',
        short: 'Monitorización de infraestructura e integración de equipos existentes.',
        full: [
          'Supervisión remota de casetas, antenas y salas técnicas mediante cámaras y sensores.',
          'Detección de intrusión, apertura de puertas, humo, temperatura y humedad.',
          'Análisis de estado visual de racks, cables y equipos críticos.',
          'Conectividad 4G/5G integrada para despliegues sin infraestructura fija.',
          'Envío de eventos hacia NOC, sistemas de tickets o dashboards operativos.',
        ],
      },
      {
        icon: 'agri',
        title: 'Agricultura inteligente',
        short: 'Control de cultivos, ganado, riego y equipos con IA en el borde.',
        full: [
          'Monitorización visual de cultivos: crecimiento, plagas, enfermedades y estrés hídrico.',
          'Conteo y seguimiento de ganado, detección de comportamientos anómalos.',
          'Control automatizado de riego y fertilización según sensores y análisis por IA.',
          'Supervisión de invernaderos, silos y equipos de campo con conectividad LoRa/4G.',
          'Alertas tempranas al agricultor mediante app, SMS o integraciones IoT.',
        ],
      },
      {
        icon: 'retail',
        title: 'Comercios (retail)',
        short: 'Conteo de personas, mapas de calor y prevención de pérdidas.',
        full: [
          'Conteo preciso de visitantes, análisis de aforo y horas pico.',
          'Mapas de calor y recorridos para optimizar la disposición de productos.',
          'Detección de colas, tiempos de espera y aviso al personal.',
          'Prevención de pérdidas mediante análisis de comportamiento sospechoso.',
          'Analítica demográfica anonimizada para marketing y decisiones comerciales.',
        ],
      },
      {
        icon: 'construction',
        title: 'Construcción',
        short: 'Supervisión de obra, control de acceso, seguridad y avance del proyecto.',
        full: [
          'Time-lapse inteligente y seguimiento visual del avance de la obra.',
          'Control de acceso de personal y subcontratas con identificación facial o matrícula.',
          'Detección automática de EPI, zonas de riesgo y maniobras peligrosas.',
          'Vigilancia perimetral 24/7 con alertas de intrusión fuera de horario.',
          'Reportes automáticos para dirección de obra y compliance de seguridad.',
        ],
      },
      {
        icon: 'custom',
        title: 'Automatización a medida',
        short: 'Su sector, nuestra tecnología: soluciones inteligentes personalizadas.',
        full: [
          'Desarrollamos software e integraciones específicas sobre IRON WATCH AI Box.',
          'Entrenamiento de modelos de IA con los datos y casos de uso de su empresa.',
          'Integración con equipos, sensores y sistemas ya existentes en su instalación.',
          'Despliegue on-premise, sin dependencia de la nube y con máxima privacidad de datos.',
          'Soporte, evolución y mantenimiento continuo de la solución implantada.',
        ],
      },
    ],
  },
  en: {
    metaTitle: 'IRON WATCH AI Smart Solutions | INTERSOFTI',
    metaDesc:
      'We turn existing cameras, sensors and equipment into intelligent systems: control, detection, quality, safety and automation with IRON WATCH AI Box.',
    eyebrow: 'IRON WATCH AI Box',
    title: 'Unlimited possibilities',
    subtitle:
      'A technology platform to build smart solutions tailored to each company.',
    intro:
      'We transform existing cameras, sensors and equipment into intelligent systems able to analyze, detect, control and automate processes in real time. You bring the domain expertise; we build the software, integration and technology on top of IRON WATCH AI Box.',
    learnMore: 'View details',
    back: 'Back',
    close: 'Close',
    ctaTitle: 'We do not just offer a device.',
    ctaBody:
      'We deliver a technology platform to build smart solutions tailored to the specific needs of each company.',
    ctaButton: 'Talk to an expert',
    utilities: [
      {
        icon: 'factory',
        title: 'Industry & factories',
        short: 'Production line monitoring, product counting and connected sensors.',
        full: [
          'Real-time monitoring of production lines using existing cameras and sensors.',
          'Automatic counting of products, parts or units per shift, hour or batch.',
          'Detection of downtimes, bottlenecks and micro-stops to optimize OEE.',
          'Integration with PLCs, SCADA and ERPs via RS-232/485, CAN, Ethernet or MQTT.',
          'Automatic triggering of alerts and automations when anomalies are detected.',
        ],
      },
      {
        icon: 'quality',
        title: 'Visual quality control',
        short: 'AI-powered inspection, defect detection and automated traceability.',
        full: [
          'Automatic visual inspection with custom-trained AI models.',
          'Defect, deformation, missing part or wrong-label detection.',
          'Real-time code, license plate, serial number and industrial OCR reading.',
          'Full traceability: every unit logged with image and result.',
          'Automatic rejection via signals to actuators or robots on the line.',
        ],
      },
      {
        icon: 'logistics',
        title: 'Logistics & warehousing',
        short: 'Counting, goods tracking and operational flow control.',
        full: [
          'Automatic counting of parcels, pallets and boxes on docks and conveyors.',
          'Tracking of goods across warehouse zones through computer vision.',
          'Capacity and occupancy monitoring of loading and unloading docks.',
          'Detection of vehicles, forklifts and personnel in restricted zones.',
          'Integration with WMS and ERP for real-time inventory updates.',
        ],
      },
      {
        icon: 'access',
        title: 'Security & access control',
        short: 'People and vehicle identification, authorizations and alerts.',
        full: [
          'Face and license plate recognition (LPR) processed locally, no cloud dependency.',
          'Access authorization based on whitelists, schedules and permission levels.',
          'Intrusion, loitering and anomalous behavior detection.',
          'Instant alerts to security personnel, apps or central monitoring systems.',
          'Integration with turnstiles, barriers, electronic locks and existing CCTV.',
        ],
      },
      {
        icon: 'ppe',
        title: 'Workplace safety (PPE)',
        short: 'Helmet, vest and glove detection with real-time risk alerts.',
        full: [
          'Automatic verification of helmet, high-visibility vest, gloves and footwear.',
          'Detection of workers in dangerous or restricted zones.',
          'Fall detection, risky postures and proximity to moving machinery.',
          'Event logging with imagery for audit and regulatory compliance.',
          'Automatic activation of visual, audible alarms or equipment shutdown.',
        ],
      },
      {
        icon: 'telecom',
        title: 'Telecommunications',
        short: 'Infrastructure monitoring and integration of existing equipment.',
        full: [
          'Remote supervision of cabinets, antennas and technical rooms with cameras and sensors.',
          'Intrusion, door-open, smoke, temperature and humidity detection.',
          'Visual health analysis of racks, cabling and critical equipment.',
          'Built-in 4G/5G connectivity for deployments without fixed infrastructure.',
          'Event forwarding to NOC, ticketing systems or operational dashboards.',
        ],
      },
      {
        icon: 'agri',
        title: 'Smart agriculture',
        short: 'Crop, livestock, irrigation and equipment control with edge AI.',
        full: [
          'Visual monitoring of crops: growth, pests, disease and water stress.',
          'Livestock counting and tracking, anomalous behavior detection.',
          'Automated irrigation and fertilization control driven by sensors and AI.',
          'Supervision of greenhouses, silos and field equipment with LoRa/4G.',
          'Early alerts to the farmer via app, SMS or IoT integrations.',
        ],
      },
      {
        icon: 'retail',
        title: 'Retail',
        short: 'People counting, heatmaps and loss prevention.',
        full: [
          'Accurate visitor counting, occupancy and peak-hour analysis.',
          'Heatmaps and customer journeys to optimize product placement.',
          'Queue detection, waiting time analysis and staff notifications.',
          'Loss prevention through suspicious-behavior analytics.',
          'Anonymized demographic analytics for marketing and business decisions.',
        ],
      },
      {
        icon: 'construction',
        title: 'Construction',
        short: 'Site supervision, access control, safety and project progress.',
        full: [
          'Smart time-lapse and visual tracking of construction progress.',
          'Access control for staff and subcontractors via face or license plate.',
          'Automatic PPE, risk zone and dangerous maneuver detection.',
          '24/7 perimeter surveillance with off-hours intrusion alerts.',
          'Automated reports for site management and safety compliance.',
        ],
      },
      {
        icon: 'custom',
        title: 'Custom automation',
        short: 'Your sector, our technology: tailor-made smart solutions.',
        full: [
          'We build custom software and integrations on top of IRON WATCH AI Box.',
          'AI model training with your company data and use cases.',
          'Integration with equipment, sensors and systems already in your facility.',
          'On-premise deployment, no cloud dependency and maximum data privacy.',
          'Ongoing support, evolution and maintenance of the deployed solution.',
        ],
      },
    ],
  },
  pt: {
    metaTitle: 'Soluções Inteligentes IRON WATCH AI | INTERSOFTI',
    metaDesc:
      'Transformamos câmaras, sensores e equipamentos existentes em sistemas inteligentes: controlo, deteção, qualidade, segurança e automação com IRON WATCH AI Box.',
    eyebrow: 'IRON WATCH AI Box',
    title: 'Possibilidades ilimitadas',
    subtitle:
      'Uma plataforma tecnológica para desenvolver soluções inteligentes adaptadas a cada empresa.',
    intro:
      'Transformamos câmaras, sensores e equipamentos existentes em sistemas inteligentes capazes de analisar, detetar, controlar e automatizar processos em tempo real. Você traz o conhecimento do seu setor e nós desenvolvemos o software, a integração e a tecnologia através da IRON WATCH AI Box.',
    learnMore: 'Ver detalhes',
    back: 'Voltar',
    close: 'Fechar',
    ctaTitle: 'Não oferecemos apenas um equipamento.',
    ctaBody:
      'Oferecemos uma plataforma tecnológica para desenvolver soluções inteligentes adaptadas às necessidades específicas de cada empresa.',
    ctaButton: 'Falar com um especialista',
    utilities: [
      {
        icon: 'factory',
        title: 'Indústria e fábricas',
        short: 'Controlo de linhas de produção, contagem de produtos e sensores conectados.',
        full: [
          'Supervisão em tempo real de linhas de produção com câmaras e sensores existentes.',
          'Contagem automática de produtos, peças ou unidades por turno, hora ou lote.',
          'Deteção de paragens, estrangulamentos e micro-paragens para otimizar o OEE.',
          'Integração com PLCs, SCADA e ERPs via RS-232/485, CAN, Ethernet ou MQTT.',
          'Ativação automática de alertas e automatismos face a anomalias detetadas.',
        ],
      },
      {
        icon: 'quality',
        title: 'Controlo de qualidade visual',
        short: 'Inspeção com IA, deteção de defeitos e rastreabilidade automatizada.',
        full: [
          'Inspeção visual automática através de modelos de IA treinados à medida.',
          'Deteção de defeitos, deformações, componentes em falta ou rótulos incorretos.',
          'Leitura de códigos, matrículas, seriais e OCR industrial em tempo real.',
          'Rastreabilidade completa: cada peça fica registada com imagem e resultado.',
          'Rejeição automática via sinal para atuadores ou robôs da linha.',
        ],
      },
      {
        icon: 'logistics',
        title: 'Logística e armazéns',
        short: 'Contagem, seguimento de mercadorias e controlo de fluxos operacionais.',
        full: [
          'Contagem automática de volumes, paletes e caixas em cais e transportadores.',
          'Seguimento de mercadorias por zonas do armazém através de visão computacional.',
          'Controlo de ocupação de cais de carga e descarga.',
          'Deteção de veículos, empilhadores e pessoal em zonas restritas.',
          'Integração com WMS e ERP para atualização em tempo real do inventário.',
        ],
      },
      {
        icon: 'access',
        title: 'Segurança e controlo de acessos',
        short: 'Identificação de pessoas e veículos, autorizações e alertas.',
        full: [
          'Reconhecimento facial e de matrículas (LPR) processado localmente, sem depender da cloud.',
          'Autorização de acessos por listas brancas, horários e níveis de permissão.',
          'Deteção de intrusões, permanência suspeita e comportamentos anómalos.',
          'Envio de alertas instantâneos para pessoal de segurança, apps ou centrais.',
          'Integração com torniquetes, barreiras, fechaduras eletrónicas e CCTV existente.',
        ],
      },
      {
        icon: 'ppe',
        title: 'Segurança laboral (EPI)',
        short: 'Deteção de capacetes, coletes, luvas e alertas de risco.',
        full: [
          'Verificação automática do uso de capacete, colete refletor, luvas e calçado.',
          'Deteção de trabalhadores em zonas perigosas ou restritas.',
          'Reconhecimento de quedas, posturas de risco e proximidade a maquinaria em movimento.',
          'Registo de eventos com imagem para auditoria e conformidade regulamentar.',
          'Ativação automática de alarmes visuais, sonoros ou paragem de equipamentos.',
        ],
      },
      {
        icon: 'telecom',
        title: 'Telecomunicações',
        short: 'Monitorização de infraestrutura e integração de equipamentos existentes.',
        full: [
          'Supervisão remota de shelters, antenas e salas técnicas com câmaras e sensores.',
          'Deteção de intrusão, abertura de portas, fumo, temperatura e humidade.',
          'Análise visual do estado de racks, cabos e equipamentos críticos.',
          'Conectividade 4G/5G integrada para instalações sem infraestrutura fixa.',
          'Envio de eventos para NOC, sistemas de tickets ou dashboards operacionais.',
        ],
      },
      {
        icon: 'agri',
        title: 'Agricultura inteligente',
        short: 'Controlo de culturas, gado, rega e equipamentos com IA na borda.',
        full: [
          'Monitorização visual de culturas: crescimento, pragas, doenças e stress hídrico.',
          'Contagem e seguimento de gado, deteção de comportamentos anómalos.',
          'Controlo automatizado de rega e fertilização por sensores e análise de IA.',
          'Supervisão de estufas, silos e equipamentos com conectividade LoRa/4G.',
          'Alertas precoces ao agricultor via app, SMS ou integrações IoT.',
        ],
      },
      {
        icon: 'retail',
        title: 'Comércio (retail)',
        short: 'Contagem de pessoas, mapas de calor e prevenção de perdas.',
        full: [
          'Contagem precisa de visitantes, análise de ocupação e horas de pico.',
          'Mapas de calor e percursos para otimizar a disposição de produtos.',
          'Deteção de filas, tempos de espera e aviso ao pessoal.',
          'Prevenção de perdas através de análise de comportamentos suspeitos.',
          'Analítica demográfica anonimizada para marketing e decisões comerciais.',
        ],
      },
      {
        icon: 'construction',
        title: 'Construção',
        short: 'Supervisão de obra, controlo de acesso, segurança e progresso do projeto.',
        full: [
          'Time-lapse inteligente e seguimento visual do avanço da obra.',
          'Controlo de acesso de pessoal e subcontratados por reconhecimento facial ou matrícula.',
          'Deteção automática de EPI, zonas de risco e manobras perigosas.',
          'Vigilância perimetral 24/7 com alertas de intrusão fora de horas.',
          'Relatórios automáticos para direção de obra e conformidade de segurança.',
        ],
      },
      {
        icon: 'custom',
        title: 'Automação à medida',
        short: 'O seu setor, a nossa tecnologia: soluções inteligentes personalizadas.',
        full: [
          'Desenvolvemos software e integrações específicas sobre a IRON WATCH AI Box.',
          'Treino de modelos de IA com os dados e casos de uso da sua empresa.',
          'Integração com equipamentos, sensores e sistemas já existentes.',
          'Instalação on-premise, sem dependência da cloud e com máxima privacidade dos dados.',
          'Suporte, evolução e manutenção contínua da solução implementada.',
        ],
      },
    ],
  },
};

export default function BoxAISolutions() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.en;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const activeUtility = openIndex !== null ? t.utilities[openIndex] : null;
  const ActiveIcon = activeUtility ? iconMap[activeUtility.icon] : null;

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Tech grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at top, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 40%, transparent 80%)',
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, hsl(var(--primary) / 0.25), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Back link */}
        <Link
          to="/box_ai"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        {/* Header */}
        <div className="max-w-4xl animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {t.eyebrow}
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {t.title}
          </h1>
          <p className="mt-4 text-lg text-primary/90 font-medium">{t.subtitle}</p>
          <p className="mt-6 text-base text-gray-300 leading-relaxed">{t.intro}</p>
        </div>

        {/* Grid of utility cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.utilities.map((u, i) => {
            const Icon = iconMap[u.icon];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative text-left rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Corner gradient */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle at top right, hsl(var(--primary) / 0.18), transparent 60%)',
                  }}
                />
                {/* Scanline shimmer */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                />

                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{u.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{u.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary/90 group-hover:text-primary transition-colors">
                    {t.learnMore}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-white/[0.02] to-transparent p-8 sm:p-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {t.ctaTitle}
              </h2>
              <p className="mt-3 text-gray-300 leading-relaxed">{t.ctaBody}</p>
            </div>
            <Button
              asChild
              className="group shrink-0 rounded-full bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-[0_0_28px_-6px_hsl(var(--primary)/0.7)] hover:bg-primary/90 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
            >
              <Link to="/contact">
                {t.ctaButton}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-2xl border-primary/30 bg-[#0a0a0a] text-white p-0 overflow-hidden">
          {activeUtility && ActiveIcon && (
            <div>
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/25 via-primary/5 to-transparent px-8 py-7 border-b border-primary/20">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/40 shadow-[0_0_30px_-6px_hsl(var(--primary)/0.8)]">
                    <ActiveIcon className="h-7 w-7" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/90">
                      IRON WATCH AI
                    </div>
                    <h3 className="mt-1 text-2xl font-bold text-white leading-tight">
                      {activeUtility.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                      {activeUtility.short}
                    </p>
                  </div>
                  <DialogClose className="text-gray-400 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
              </div>

              <div className="px-8 py-7">
                <ul className="space-y-3">
                  {activeUtility.full.map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                      <span className="text-sm text-gray-200 leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/5"
                    >
                      {t.close}
                    </Button>
                  </DialogClose>
                  <Button
                    asChild
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link to="/contact">
                      {t.ctaButton}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
