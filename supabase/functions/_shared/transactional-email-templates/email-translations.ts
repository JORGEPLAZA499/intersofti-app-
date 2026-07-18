export type EmailLang = 'en' | 'pt' | 'es';

export interface EsimDeliveryStrings {
  preview: (packageName: string) => string;
  tagline: string;
  greeting: string;
  thankYou: string;
  scanQr: string;
  orderNumber: string;
  esimTransactionNo: string;
  dataplanName: string;
  activateBefore: string;
  activationCodeString: string;
  smdpAddress: string;
  activationCode: string;
  apn: string;
  quickInstall: string;
  iosLabel: string;
  androidLabel: string;
  shareLink: string;
  regards: string;
  systemNote: string;
  subject: (packageName: string) => string;
}

export interface ContactNotificationStrings {
  heading: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  noMessage: string;
  footer: string;
  subject: (firstName: string, lastName: string) => string;
}

export interface GhostcodeOrderStrings {
  preview: (orderNumber: string) => string;
  heading: string;
  orderNumberLabel: string;
  greeting: (name?: string) => string;
  productLabel: string;
  totalLabel: string;
  shippingAddress: string;
  trackOrder: string;
  notification: string;
  regards: string;
  systemNote: string;
  subject: (orderNumber: string) => string;
}

const esimDelivery: Record<EmailLang, EsimDeliveryStrings> = {
  en: {
    preview: (pkg) => `Your eSIM is ready — ${pkg}`,
    tagline: 'Connect to the world in seconds. No SIM, no limits.',
    greeting: 'Dear customer,',
    thankYou: 'Thank you for your order! Below you will find your eSIM information. You can scan the QR code to activate your plan on your device.',
    scanQr: 'Scan the QR code:',
    orderNumber: 'Order number (Batch ID):',
    esimTransactionNo: 'eSIM Transaction No:',
    dataplanName: 'Data plan name:',
    activateBefore: 'Activate before:',
    activationCodeString: 'Activation code string:',
    smdpAddress: 'SM-DP+ Address:',
    activationCode: 'Activation code:',
    apn: 'APN:',
    quickInstall: 'Quick install via mobile phone:',
    iosLabel: 'iOS (17.4+)',
    androidLabel: 'Android (10+)',
    shareLink: 'You can also share this link with friends or check usage:',
    regards: 'Best regards,',
    systemNote: '*** This is a system-generated message; Please do not reply to this address. ***',
    subject: (pkg) => `Your eSIM is ready — ${pkg}`,
  },
  pt: {
    preview: (pkg) => `Sua eSIM está pronta — ${pkg}`,
    tagline: 'Conecte-se ao mundo em segundos. Sem SIM, sem limites.',
    greeting: 'Prezado cliente,',
    thankYou: 'Obrigado pelo seu pedido! Abaixo você encontrará as informações da sua eSIM. Você pode escanear o código QR para ativar seu plano no dispositivo.',
    scanQr: 'Escaneie o código QR:',
    orderNumber: 'Número do pedido (ID do lote):',
    esimTransactionNo: 'eSIM Transação Nº:',
    dataplanName: 'Nome do plano de dados:',
    activateBefore: 'Ativar antes de:',
    activationCodeString: 'Cadeia de código de ativação:',
    smdpAddress: 'Endereço SM-DP+:',
    activationCode: 'Código de ativação:',
    apn: 'APN:',
    quickInstall: 'Instalação rápida pelo celular:',
    iosLabel: 'iOS (17.4+)',
    androidLabel: 'Android (10+)',
    shareLink: 'Você também pode compartilhar este link com amigos ou verificar o uso:',
    regards: 'Atenciosamente,',
    systemNote: '*** Esta é uma mensagem gerada pelo sistema; Por favor, não responda a este endereço. ***',
    subject: (pkg) => `Sua eSIM está pronta — ${pkg}`,
  },
  es: {
    preview: (pkg) => `Tu eSIM está lista — ${pkg}`,
    tagline: 'Conéctate al mundo en segundos. Sin SIM, sin límites.',
    greeting: 'Estimado cliente,',
    thankYou: '¡Gracias por tu pedido! A continuación encontrarás la información de tu eSIM. Puedes escanear el código QR para activar tu plan en tu dispositivo.',
    scanQr: 'Escanee el código QR:',
    orderNumber: 'Número de pedido (ID de lote):',
    esimTransactionNo: 'eSIM Transacción No:',
    dataplanName: 'Nombre del plan de datos:',
    activateBefore: 'Activar antes:',
    activationCodeString: 'Cadena de código de activación:',
    smdpAddress: 'Dirección SM-DP+:',
    activationCode: 'Código de activación:',
    apn: 'APN:',
    quickInstall: 'Instalación rápida a través del teléfono móvil:',
    iosLabel: 'iOS (17.4+)',
    androidLabel: 'Android (10+)',
    shareLink: 'También puedes compartir este enlace con tus amigos o consultar su uso:',
    regards: 'Atentamente,',
    systemNote: '*** Este es un mensaje generado por el sistema; Por favor, no responda a esta dirección. ***',
    subject: (pkg) => `Tu eSIM está lista — ${pkg}`,
  },
};

const contactNotification: Record<EmailLang, ContactNotificationStrings> = {
  en: {
    heading: 'New Contact Message',
    nameLabel: 'Name:',
    emailLabel: 'Email:',
    messageLabel: 'Message:',
    noMessage: 'No message provided',
    footer: 'This message was sent via the INTERSOFTI contact form.',
    subject: (first, last) => `New contact: ${first} ${last}`.trim(),
  },
  pt: {
    heading: 'Nova Mensagem de Contato',
    nameLabel: 'Nome:',
    emailLabel: 'Email:',
    messageLabel: 'Mensagem:',
    noMessage: 'Nenhuma mensagem fornecida',
    footer: 'Esta mensagem foi enviada pelo formulário de contato da INTERSOFTI.',
    subject: (first, last) => `Novo contato: ${first} ${last}`.trim(),
  },
  es: {
    heading: 'Nuevo Mensaje de Contacto',
    nameLabel: 'Nombre:',
    emailLabel: 'Email:',
    messageLabel: 'Mensaje:',
    noMessage: 'No se proporcionó mensaje',
    footer: 'Este mensaje fue enviado a través del formulario de contacto de INTERSOFTI.',
    subject: (first, last) => `Nuevo contacto: ${first} ${last}`.trim(),
  },
};

const ghostcodeOrder: Record<EmailLang, GhostcodeOrderStrings> = {
  en: {
    preview: (orderNum) => `Order confirmed — ${orderNum}`,
    heading: '✅ Order Confirmed',
    orderNumberLabel: 'Order No:',
    greeting: (name) => name ? `Hello ${name}, thank you for your purchase. Your order has been confirmed and we are preparing the shipment.` : 'Hello, thank you for your purchase. Your order has been confirmed and we are preparing the shipment.',
    productLabel: 'Product',
    totalLabel: 'Total',
    shippingAddress: '📦 Shipping address',
    trackOrder: 'Track order',
    notification: 'We will notify you when your order is shipped. If you have any questions, feel free to contact us.',
    regards: 'Best regards,',
    systemNote: '*** This is a system-generated message; Please do not reply to this address. ***',
    subject: (orderNum) => `Order confirmed — ${orderNum}`,
  },
  pt: {
    preview: (orderNum) => `Pedido confirmado — ${orderNum}`,
    heading: '✅ Pedido Confirmado',
    orderNumberLabel: 'Nº do Pedido:',
    greeting: (name) => name ? `Olá ${name}, obrigado pela sua compra. Seu pedido foi confirmado e estamos preparando o envio.` : 'Olá, obrigado pela sua compra. Seu pedido foi confirmado e estamos preparando o envio.',
    productLabel: 'Produto',
    totalLabel: 'Total',
    shippingAddress: '📦 Endereço de envio',
    trackOrder: 'Rastrear pedido',
    notification: 'Notificaremos quando seu pedido for enviado. Se tiver alguma dúvida, não hesite em nos contactar.',
    regards: 'Atenciosamente,',
    systemNote: '*** Esta é uma mensagem gerada pelo sistema; Por favor, não responda a este endereço. ***',
    subject: (orderNum) => `Pedido confirmado — ${orderNum}`,
  },
  es: {
    preview: (orderNum) => `Pedido confirmado — ${orderNum}`,
    heading: '✅ Pedido Confirmado',
    orderNumberLabel: 'Nº de Pedido:',
    greeting: (name) => name ? `Hola ${name}, gracias por tu compra. Tu pedido ha sido confirmado y estamos preparando el envío.` : 'Hola, gracias por tu compra. Tu pedido ha sido confirmado y estamos preparando el envío.',
    productLabel: 'Producto',
    totalLabel: 'Total',
    shippingAddress: '📦 Dirección de envío',
    trackOrder: 'Seguimiento de pedido',
    notification: 'Te notificaremos cuando tu pedido sea enviado. Si tienes alguna pregunta, no dudes en contactarnos.',
    regards: 'Atentamente,',
    systemNote: '*** Este es un mensaje generado por el sistema; Por favor, no responda a esta dirección. ***',
    subject: (orderNum) => `Pedido confirmado — ${orderNum}`,
  },
};

export const emailTranslations = {
  esimDelivery,
  contactNotification,
  ghostcodeOrder,
};

export function getEmailLang(lang?: string): EmailLang {
  if (lang === 'pt' || lang === 'es' || lang === 'en') return lang;
  return 'en';
}
