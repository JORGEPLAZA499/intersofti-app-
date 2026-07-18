import { useEffect } from 'react';

import { useLanguage } from '@/i18n/LanguageContext';

const content = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: April 2026",
    sections: [
      {
        heading: "1. Identification",
        text: "These Terms of Service govern the use of the website and services provided by RPJ SOFTWARE INNOVATION LIMITADA, with registered office at 54 Parnell Square West, Dublin, Ireland | D01 H0X9. Email: info@rpjsoftware.com."
      },
      {
        heading: "2. Acceptance of Terms",
        text: "By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."
      },
      {
        heading: "3. Services Description",
        text: "RPJ SOFTWARE INNOVATION LIMITADA offers digital technology products and services, including but not limited to:\n• Ghostcode S10 encryption software.\n• GhostCode Messenger secure communications.\n• GhostCode Token digital security solutions.\n• eSIM connectivity services.\n• Digital platforms such as AgriCreditScore Global and VeHistory."
      },
      {
        heading: "4. User Accounts",
        text: "Some services may require the creation of a user account. You are responsible for:\n• Providing accurate and up-to-date information.\n• Maintaining the confidentiality of your credentials.\n• All activities carried out under your account.\nWe reserve the right to suspend or terminate accounts that violate these terms."
      },
      {
        heading: "5. Purchases and Payments",
        text: "All purchases made through our platform are subject to the following conditions:\n• Prices are displayed in the applicable currency and include taxes where indicated.\n• Payments are processed through secure third-party providers.\n• You will receive an electronic confirmation of your purchase.\n• Digital products are delivered immediately after payment confirmation."
      },
      {
        heading: "6. Right of Withdrawal",
        text: "In accordance with EU consumer protection regulations:\n• For physical products, you have 14 calendar days from the date of receipt to exercise your right of withdrawal.\n• For digital products and services, the right of withdrawal may be waived upon delivery if you expressly consent and acknowledge that you lose the right of withdrawal.\n• To exercise this right, contact us at info@rpjsoftware.com."
      },
      {
        heading: "7. Intellectual Property",
        text: "All content on this website, including but not limited to text, graphics, logos, software, and designs, is the property of RPJ SOFTWARE INNOVATION LIMITADA or its licensors and is protected by intellectual property laws. Reproduction, distribution, or modification without prior written consent is prohibited."
      },
      {
        heading: "8. Prohibited Use",
        text: "You agree not to:\n• Use our services for illegal or unauthorized purposes.\n• Attempt to gain unauthorized access to our systems.\n• Interfere with or disrupt the functionality of the website.\n• Reverse engineer, decompile, or disassemble our software products.\n• Resell or redistribute our products without authorization."
      },
      {
        heading: "9. Limitation of Liability",
        text: "To the maximum extent permitted by applicable law, RPJ SOFTWARE INNOVATION LIMITADA shall not be liable for:\n• Indirect, incidental, or consequential damages.\n• Loss of data or business interruption.\n• Issues arising from the use of third-party services.\nOur total liability shall not exceed the amount paid by you for the specific product or service."
      },
      {
        heading: "10. Warranties",
        text: "Our products and services are provided \"as is\" and \"as available.\" While we strive to ensure quality and reliability, we do not guarantee that:\n• Services will be uninterrupted or error-free.\n• All defects will be corrected.\n• The services will meet all your specific requirements."
      },
      {
        heading: "11. Modifications to Terms",
        text: "We reserve the right to modify these Terms of Service at any time. Changes will be effective upon publication on this page. Continued use of our services after modifications constitutes acceptance of the updated terms."
      },
      {
        heading: "12. Governing Law and Jurisdiction",
        text: "These Terms of Service are governed by and construed in accordance with the laws of Ireland. Any disputes shall be submitted to the exclusive jurisdiction of the courts of Dublin, Ireland."
      },
      {
        heading: "13. Contact",
        text: "For any questions regarding these Terms of Service, please contact us:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublin, Ireland | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  },
  es: {
    title: "Términos de Servicio",
    lastUpdated: "Última actualización: abril 2026",
    sections: [
      {
        heading: "1. Identificación",
        text: "Estos Términos de Servicio regulan el uso del sitio web y los servicios proporcionados por RPJ SOFTWARE INNOVATION LIMITADA, con domicilio social en 54 Parnell Square West, Dublín, Irlanda | D01 H0X9. Email: info@rpjsoftware.com."
      },
      {
        heading: "2. Aceptación de los Términos",
        text: "Al acceder o utilizar nuestro sitio web y servicios, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo, por favor no utilice nuestros servicios."
      },
      {
        heading: "3. Descripción de los Servicios",
        text: "RPJ SOFTWARE INNOVATION LIMITADA ofrece productos y servicios de tecnología digital, incluyendo pero no limitándose a:\n• Software de cifrado Ghostcode S10.\n• Comunicaciones seguras GhostCode Messenger.\n• Soluciones de seguridad digital GhostCode Token.\n• Servicios de conectividad eSIM.\n• Plataformas digitales como AgriCreditScore Global y VeHistory."
      },
      {
        heading: "4. Cuentas de Usuario",
        text: "Algunos servicios pueden requerir la creación de una cuenta de usuario. Usted es responsable de:\n• Proporcionar información precisa y actualizada.\n• Mantener la confidencialidad de sus credenciales.\n• Todas las actividades realizadas bajo su cuenta.\nNos reservamos el derecho de suspender o cancelar cuentas que violen estos términos."
      },
      {
        heading: "5. Compras y Pagos",
        text: "Todas las compras realizadas a través de nuestra plataforma están sujetas a las siguientes condiciones:\n• Los precios se muestran en la moneda aplicable e incluyen impuestos donde se indica.\n• Los pagos se procesan a través de proveedores seguros de terceros.\n• Recibirá una confirmación electrónica de su compra.\n• Los productos digitales se entregan inmediatamente después de la confirmación del pago."
      },
      {
        heading: "6. Derecho de Desistimiento",
        text: "De acuerdo con la normativa de protección al consumidor de la UE:\n• Para productos físicos, dispone de 14 días naturales desde la fecha de recepción para ejercer su derecho de desistimiento.\n• Para productos y servicios digitales, el derecho de desistimiento puede ser renunciado en el momento de la entrega si usted consiente expresamente.\n• Para ejercer este derecho, contacte con nosotros en info@rpjsoftware.com."
      },
      {
        heading: "7. Propiedad Intelectual",
        text: "Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, software y diseños, es propiedad de RPJ SOFTWARE INNOVATION LIMITADA o sus licenciantes y está protegido por las leyes de propiedad intelectual. La reproducción, distribución o modificación sin consentimiento previo por escrito está prohibida."
      },
      {
        heading: "8. Uso Prohibido",
        text: "Usted se compromete a no:\n• Utilizar nuestros servicios para fines ilegales o no autorizados.\n• Intentar obtener acceso no autorizado a nuestros sistemas.\n• Interferir con o interrumpir la funcionalidad del sitio web.\n• Realizar ingeniería inversa, descompilar o desensamblar nuestros productos de software.\n• Revender o redistribuir nuestros productos sin autorización."
      },
      {
        heading: "9. Limitación de Responsabilidad",
        text: "En la máxima medida permitida por la ley aplicable, RPJ SOFTWARE INNOVATION LIMITADA no será responsable de:\n• Daños indirectos, incidentales o consecuentes.\n• Pérdida de datos o interrupción del negocio.\n• Problemas derivados del uso de servicios de terceros.\nNuestra responsabilidad total no excederá el importe pagado por usted por el producto o servicio específico."
      },
      {
        heading: "10. Garantías",
        text: "Nuestros productos y servicios se proporcionan \"tal cual\" y \"según disponibilidad\". Aunque nos esforzamos por garantizar la calidad y fiabilidad, no garantizamos que:\n• Los servicios serán ininterrumpidos o libres de errores.\n• Todos los defectos serán corregidos.\n• Los servicios cumplirán con todos sus requisitos específicos."
      },
      {
        heading: "11. Modificaciones de los Términos",
        text: "Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios serán efectivos tras su publicación en esta página. El uso continuado de nuestros servicios después de las modificaciones constituye la aceptación de los términos actualizados."
      },
      {
        heading: "12. Ley Aplicable y Jurisdicción",
        text: "Estos Términos de Servicio se rigen e interpretan de acuerdo con las leyes de Irlanda. Cualquier disputa se someterá a la jurisdicción exclusiva de los tribunales de Dublín, Irlanda."
      },
      {
        heading: "13. Contacto",
        text: "Para cualquier pregunta sobre estos Términos de Servicio, contacte con nosotros:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublín, Irlanda | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  },
  pt: {
    title: "Termos de Serviço",
    lastUpdated: "Última atualização: abril de 2026",
    sections: [
      {
        heading: "1. Identificação",
        text: "Estes Termos de Serviço regulam a utilização do site e dos serviços prestados pela RPJ SOFTWARE INNOVATION LIMITADA, com sede em 54 Parnell Square West, Dublin, Irlanda | D01 H0X9. Email: info@rpjsoftware.com."
      },
      {
        heading: "2. Aceitação dos Termos",
        text: "Ao aceder ou utilizar o nosso site e serviços, concorda em ficar vinculado a estes Termos de Serviço. Se não concordar, por favor não utilize os nossos serviços."
      },
      {
        heading: "3. Descrição dos Serviços",
        text: "A RPJ SOFTWARE INNOVATION LIMITADA oferece produtos e serviços de tecnologia digital, incluindo mas não se limitando a:\n• Software de encriptação Ghostcode S10.\n• Comunicações seguras GhostCode Messenger.\n• Soluções de segurança digital GhostCode Token.\n• Serviços de conectividade eSIM.\n• Plataformas digitais como AgriCreditScore Global e VeHistory."
      },
      {
        heading: "4. Contas de Utilizador",
        text: "Alguns serviços podem exigir a criação de uma conta de utilizador. É responsável por:\n• Fornecer informações precisas e atualizadas.\n• Manter a confidencialidade das suas credenciais.\n• Todas as atividades realizadas na sua conta.\nReservamo-nos o direito de suspender ou cancelar contas que violem estes termos."
      },
      {
        heading: "5. Compras e Pagamentos",
        text: "Todas as compras realizadas através da nossa plataforma estão sujeitas às seguintes condições:\n• Os preços são apresentados na moeda aplicável e incluem impostos quando indicado.\n• Os pagamentos são processados através de fornecedores seguros de terceiros.\n• Receberá uma confirmação eletrónica da sua compra.\n• Os produtos digitais são entregues imediatamente após a confirmação do pagamento."
      },
      {
        heading: "6. Direito de Retratação",
        text: "De acordo com a regulamentação de proteção ao consumidor da UE:\n• Para produtos físicos, dispõe de 14 dias corridos a partir da data de receção para exercer o seu direito de retratação.\n• Para produtos e serviços digitais, o direito de retratação pode ser renunciado no momento da entrega se consentir expressamente.\n• Para exercer este direito, contacte-nos em info@rpjsoftware.com."
      },
      {
        heading: "7. Propriedade Intelectual",
        text: "Todo o conteúdo deste site, incluindo textos, gráficos, logótipos, software e designs, é propriedade da RPJ SOFTWARE INNOVATION LIMITADA ou dos seus licenciadores e está protegido pelas leis de propriedade intelectual. A reprodução, distribuição ou modificação sem consentimento prévio por escrito é proibida."
      },
      {
        heading: "8. Uso Proibido",
        text: "Compromete-se a não:\n• Utilizar os nossos serviços para fins ilegais ou não autorizados.\n• Tentar obter acesso não autorizado aos nossos sistemas.\n• Interferir ou interromper a funcionalidade do site.\n• Realizar engenharia reversa, descompilar ou desmontar os nossos produtos de software.\n• Revender ou redistribuir os nossos produtos sem autorização."
      },
      {
        heading: "9. Limitação de Responsabilidade",
        text: "Na máxima extensão permitida pela lei aplicável, a RPJ SOFTWARE INNOVATION LIMITADA não será responsável por:\n• Danos indiretos, incidentais ou consequentes.\n• Perda de dados ou interrupção de negócios.\n• Problemas decorrentes do uso de serviços de terceiros.\nA nossa responsabilidade total não excederá o montante pago por si pelo produto ou serviço específico."
      },
      {
        heading: "10. Garantias",
        text: "Os nossos produtos e serviços são fornecidos \"tal como estão\" e \"conforme disponíveis\". Embora nos esforcemos por garantir qualidade e fiabilidade, não garantimos que:\n• Os serviços serão ininterruptos ou livres de erros.\n• Todos os defeitos serão corrigidos.\n• Os serviços cumprirão todos os seus requisitos específicos."
      },
      {
        heading: "11. Alterações aos Termos",
        text: "Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações serão efetivas após a publicação nesta página. A utilização continuada dos nossos serviços após as modificações constitui aceitação dos termos atualizados."
      },
      {
        heading: "12. Lei Aplicável e Jurisdição",
        text: "Estes Termos de Serviço são regidos e interpretados de acordo com as leis da Irlanda. Qualquer litígio será submetido à jurisdição exclusiva dos tribunais de Dublin, Irlanda."
      },
      {
        heading: "13. Contacto",
        text: "Para qualquer questão sobre estes Termos de Serviço, contacte-nos:\n\nRPJ SOFTWARE INNOVATION LIMITADA\n54 Parnell Square West, Dublin, Irlanda | D01 H0X9\nEmail: info@rpjsoftware.com"
      }
    ]
  }
};

export default function TermsOfService() {
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
