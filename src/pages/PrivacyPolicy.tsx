import { useEffect } from 'react';

import { useLanguage } from '@/i18n/LanguageContext';

const content = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: April 2026",
    sections: [
      {
        heading: "1. Data Controller",
        text: "The entity responsible for the processing of your personal data is RPJ SOFTWARE INNOVATION LIMITADA, with registered office at 54 Parnell Square West, Dublin, Ireland | D01 H0X9. You can contact us at info@rpjsoftware.com."
      },
      {
        heading: "2. Information We Collect",
        text: "We may collect the following categories of personal data:\n• Identification data: name, email address.\n• Transaction data: purchase history, payment details (processed through third-party payment providers).\n• Technical data: IP address, browser type, device information, cookies.\n• Usage data: pages visited, time spent on the site, interactions with our products."
      },
      {
        heading: "3. Purpose of Data Processing",
        text: "We process your personal data for the following purposes:\n• To provide and manage the services and products you request.\n• To process transactions and send related communications.\n• To improve and personalize your experience on our platform.\n• To comply with legal obligations.\n• To send commercial communications, only with your prior consent."
      },
      {
        heading: "4. Legal Basis for Processing",
        text: "The processing of your data is based on:\n• The execution of a contract when you purchase our products or services.\n• Your consent for marketing communications.\n• Our legitimate interest in improving our services.\n• Compliance with legal obligations."
      },
      {
        heading: "5. Data Sharing",
        text: "We do not sell your personal data. We may share your information with:\n• Payment service providers to process transactions.\n• Cloud hosting and technology providers.\n• Legal authorities when required by law.\nAll third-party providers are contractually bound to protect your data."
      },
      {
        heading: "6. International Data Transfers",
        text: "Your data may be transferred and processed in countries outside the European Economic Area (EEA). In such cases, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission."
      },
      {
        heading: "7. Data Retention",
        text: "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Transaction records are kept for the period required by tax and commercial legislation."
      },
      {
        heading: "8. Your Rights",
        text: "Under the General Data Protection Regulation (GDPR), you have the right to:\n• Access your personal data.\n• Rectify inaccurate data.\n• Request the erasure of your data.\n• Restrict or object to processing.\n• Data portability.\n• Withdraw consent at any time.\nTo exercise these rights, contact us at info@rpjsoftware.com."
      },
      {
        heading: "9. Cookies",
        text: "Our website uses cookies to enhance your browsing experience. You can manage your cookie preferences through your browser settings. For more details, see our cookie settings on the website."
      },
      {
        heading: "10. Security Measures",
        text: "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction."
      },
      {
        heading: "11. Changes to This Policy",
        text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date. We encourage you to review this page periodically."
      },
      {
        heading: "12. Contact",
        text: "If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublin, Ireland | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  },
  es: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: abril 2026",
    sections: [
      {
        heading: "1. Responsable del Tratamiento",
        text: "La entidad responsable del tratamiento de sus datos personales es RPJ SOFTWARE INNOVATION LIMITADA, con domicilio social en 54 Parnell Square West, Dublín, Irlanda | D01 H0X9. Puede contactarnos en info@rpjsoftware.com."
      },
      {
        heading: "2. Datos que Recopilamos",
        text: "Podemos recopilar las siguientes categorías de datos personales:\n• Datos de identificación: nombre, dirección de correo electrónico.\n• Datos de transacciones: historial de compras, detalles de pago (procesados a través de proveedores de pago externos).\n• Datos técnicos: dirección IP, tipo de navegador, información del dispositivo, cookies.\n• Datos de uso: páginas visitadas, tiempo en el sitio, interacciones con nuestros productos."
      },
      {
        heading: "3. Finalidad del Tratamiento",
        text: "Tratamos sus datos personales con las siguientes finalidades:\n• Proveer y gestionar los servicios y productos que solicite.\n• Procesar transacciones y enviar comunicaciones relacionadas.\n• Mejorar y personalizar su experiencia en nuestra plataforma.\n• Cumplir con obligaciones legales.\n• Enviar comunicaciones comerciales, solo con su consentimiento previo."
      },
      {
        heading: "4. Base Legal del Tratamiento",
        text: "El tratamiento de sus datos se basa en:\n• La ejecución de un contrato cuando adquiere nuestros productos o servicios.\n• Su consentimiento para comunicaciones de marketing.\n• Nuestro interés legítimo en mejorar nuestros servicios.\n• El cumplimiento de obligaciones legales."
      },
      {
        heading: "5. Compartición de Datos",
        text: "No vendemos sus datos personales. Podemos compartir su información con:\n• Proveedores de servicios de pago para procesar transacciones.\n• Proveedores de alojamiento en la nube y tecnología.\n• Autoridades legales cuando lo exija la ley.\nTodos los proveedores externos están contractualmente obligados a proteger sus datos."
      },
      {
        heading: "6. Transferencias Internacionales de Datos",
        text: "Sus datos pueden ser transferidos y procesados en países fuera del Espacio Económico Europeo (EEE). En tales casos, garantizamos que se implementen salvaguardas adecuadas, como las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea."
      },
      {
        heading: "7. Conservación de Datos",
        text: "Conservamos sus datos personales solo durante el tiempo necesario para cumplir con los fines para los que fueron recopilados, o según lo exija la legislación aplicable. Los registros de transacciones se conservan durante el período requerido por la legislación fiscal y comercial."
      },
      {
        heading: "8. Sus Derechos",
        text: "Conforme al Reglamento General de Protección de Datos (RGPD), usted tiene derecho a:\n• Acceder a sus datos personales.\n• Rectificar datos inexactos.\n• Solicitar la supresión de sus datos.\n• Limitar u oponerse al tratamiento.\n• Portabilidad de datos.\n• Retirar su consentimiento en cualquier momento.\nPara ejercer estos derechos, contacte con nosotros en info@rpjsoftware.com."
      },
      {
        heading: "9. Cookies",
        text: "Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador."
      },
      {
        heading: "10. Medidas de Seguridad",
        text: "Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, alteración, divulgación o destrucción."
      },
      {
        heading: "11. Cambios en Esta Política",
        text: "Podemos actualizar esta Política de Privacidad periódicamente. Cualquier cambio será publicado en esta página con la fecha actualizada. Le recomendamos revisar esta página periódicamente."
      },
      {
        heading: "12. Contacto",
        text: "Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contacte con nosotros:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublín, Irlanda | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  },
  pt: {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: abril de 2026",
    sections: [
      {
        heading: "1. Responsável pelo Tratamento",
        text: "A entidade responsável pelo tratamento dos seus dados pessoais é a RPJ SOFTWARE INNOVATION LIMITADA, com sede em 54 Parnell Square West, Dublin, Irlanda | D01 H0X9. Pode contactar-nos em info@rpjsoftware.com."
      },
      {
        heading: "2. Dados que Recolhemos",
        text: "Podemos recolher as seguintes categorias de dados pessoais:\n• Dados de identificação: nome, endereço de email.\n• Dados de transações: histórico de compras, detalhes de pagamento (processados através de fornecedores de pagamento externos).\n• Dados técnicos: endereço IP, tipo de navegador, informações do dispositivo, cookies.\n• Dados de utilização: páginas visitadas, tempo no site, interações com os nossos produtos."
      },
      {
        heading: "3. Finalidade do Tratamento",
        text: "Tratamos os seus dados pessoais para as seguintes finalidades:\n• Fornecer e gerir os serviços e produtos que solicita.\n• Processar transações e enviar comunicações relacionadas.\n• Melhorar e personalizar a sua experiência na nossa plataforma.\n• Cumprir obrigações legais.\n• Enviar comunicações comerciais, apenas com o seu consentimento prévio."
      },
      {
        heading: "4. Base Legal do Tratamento",
        text: "O tratamento dos seus dados baseia-se em:\n• A execução de um contrato quando adquire os nossos produtos ou serviços.\n• O seu consentimento para comunicações de marketing.\n• O nosso interesse legítimo em melhorar os nossos serviços.\n• O cumprimento de obrigações legais."
      },
      {
        heading: "5. Partilha de Dados",
        text: "Não vendemos os seus dados pessoais. Podemos partilhar as suas informações com:\n• Fornecedores de serviços de pagamento para processar transações.\n• Fornecedores de alojamento na nuvem e tecnologia.\n• Autoridades legais quando exigido por lei.\nTodos os fornecedores externos estão contratualmente obrigados a proteger os seus dados."
      },
      {
        heading: "6. Transferências Internacionais de Dados",
        text: "Os seus dados podem ser transferidos e processados em países fora do Espaço Económico Europeu (EEE). Nesses casos, garantimos que são implementadas salvaguardas adequadas, como as Cláusulas Contratuais Tipo aprovadas pela Comissão Europeia."
      },
      {
        heading: "7. Conservação de Dados",
        text: "Conservamos os seus dados pessoais apenas durante o tempo necessário para cumprir as finalidades para as quais foram recolhidos, ou conforme exigido pela legislação aplicável."
      },
      {
        heading: "8. Os Seus Direitos",
        text: "Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), tem direito a:\n• Aceder aos seus dados pessoais.\n• Retificar dados inexatos.\n• Solicitar a eliminação dos seus dados.\n• Limitar ou opor-se ao tratamento.\n• Portabilidade dos dados.\n• Retirar o seu consentimento a qualquer momento.\nPara exercer estes direitos, contacte-nos em info@rpjsoftware.com."
      },
      {
        heading: "9. Cookies",
        text: "O nosso site utiliza cookies para melhorar a sua experiência de navegação. Pode gerir as suas preferências de cookies através das definições do seu navegador."
      },
      {
        heading: "10. Medidas de Segurança",
        text: "Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição."
      },
      {
        heading: "11. Alterações a Esta Política",
        text: "Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer alterações serão publicadas nesta página com a data atualizada. Recomendamos que reveja esta página periodicamente."
      },
      {
        heading: "12. Contacto",
        text: "Se tiver questões sobre esta Política de Privacidade ou desejar exercer os seus direitos, contacte-nos:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublin, Irlanda | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  }
};

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const c = content[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-foreground mb-2">{c.title}</h1>
        <p className="text-sm text-muted-foreground mb-10">{c.lastUpdated}</p>
        <div className="space-y-8">
          {c.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-foreground mb-2">{section.heading}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
