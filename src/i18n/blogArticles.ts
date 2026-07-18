import { Language } from './translations';

export interface BlogArticleContent {
  title: string;
  content: string;
  caption?: string;
  sourceUrl?: string;
  backToNews: string;
  notFound: string;
}

export const blogArticles: Record<Language, Record<string, BlogArticleContent>> = {
  es: {
    '1': {
      title: 'El 92% de las Aplicaciones Móviles Utilizan Métodos Criptográficos Inseguros',
      backToNews: 'Volver a noticias',
      notFound: 'Artículo no encontrado',
      content: `Un nuevo análisis de más de 17.000 aplicaciones móviles empresariales ha revelado fallas de seguridad críticas que podrían poner en riesgo a millones de usuarios y empresas.

Según un nuevo informe de Zimperium, titulado "Your Apps are Leaking: The Hidden Data Risks on your Phone" (Tus aplicaciones están filtrando: los riesgos ocultos de datos en tu teléfono), estas vulnerabilidades incluyen:

• Almacenamiento en la nube mal configurado
• Credenciales codificadas dentro de la app
• Prácticas criptográficas obsoletas

El informe muestra que las aplicaciones móviles utilizadas en entornos corporativos están filtrando información sensible a un ritmo alarmante.

Los investigadores analizaron 17.333 aplicaciones móviles de trabajo de tiendas oficiales (6.037 para Android y 11.626 para iOS), descubriendo graves problemas de seguridad tanto en el ecosistema Android como en el iOS.

🛠️ Hallazgos más preocupantes:

• 83 apps de Android utilizaban almacenamiento en la nube sin protección o mal configurado
• 10 apps de Android contenían credenciales expuestas de Amazon Web Services (AWS)
• El 92% de todas las apps analizadas utilizaban métodos criptográficos débiles o con fallas
• 5 de las 100 apps más populares tenían fallas criptográficas graves, como claves codificadas en el código o algoritmos obsoletos

Estas vulnerabilidades pueden exponer datos en tránsito o almacenados, dejando a las empresas vulnerables a:

• Accesos no autorizados
• Manipulación de datos
• Extorsión, incluso sin ataques tradicionales de ransomware

"Una mala configuración del almacenamiento en la nube y credenciales expuestas es como dejar la puerta principal abierta y decir que la casa está segura", afirmó Boris Cipot, ingeniero senior de seguridad en Black Duck.

"Es una invitación abierta para que los atacantes roben datos aprovechando configuraciones descuidadas."

El Costo de la Negligencia

La creciente dependencia de dispositivos móviles en entornos corporativos, especialmente bajo políticas BYOD (bring your own device, o "trae tu propio dispositivo"), ha aumentado significativamente la superficie de ataque para los cibercriminales.

Solo en 2024, las filtraciones de datos afectaron a más de 1.700 millones de personas, generando pérdidas financieras estimadas en 280.000 millones de dólares.

Aunque la integración con la nube es fundamental para la escalabilidad, introduce riesgos cuando las APIs y SDKs no se implementan de forma segura.

Algunas aplicaciones dentro del top 100 de Google Play Store tenían directorios de almacenamiento expuestos al público, haciéndolas vulnerables a escaneos constantes por parte de actores maliciosos.

Las debilidades criptográficas agravan aún más la amenaza. El uso de algoritmos desactualizados como MD2 y generadores de números aleatorios inseguros significa que incluso los datos cifrados pueden no estar protegidos.

"La criptografía es la base de la comunicación y el almacenamiento seguros", añadió Cipot.

"Si se utilizan algoritmos criptográficos defectuosos o no se aplica ninguna protección, estamos ante una situación altamente alarmante."

Recomendaciones para las Empresas

Para enfrentar estos riesgos, Zimperium recomienda que las organizaciones empresariales tomen las siguientes acciones:

• Identificar y corregir configuraciones mal hechas en la nube
• Detectar y rotar credenciales y claves API expuestas
• Validar los métodos criptográficos utilizados y evitar algoritmos obsoletos o inseguros
• Monitorear SDKs de terceros en busca de vulnerabilidades conocidas

"La adopción de la nube ha desbloqueado un enorme potencial para las organizaciones", dijo Rom Carmel, cofundador y CEO de Apono.

"Pero para mantenerse resilientes en el panorama dinámico de amenazas actual, los equipos de seguridad deben adoptar una estrategia de defensa en profundidad: eliminar accesos permanentes, aplicar el principio de menor privilegio y limitar lo que pueden hacer las identidades comprometidas."`
    },
    '2': {
      title: 'El Pentágono advirtió al personal que no usara Signal antes de la filtración de chats de la Casa Blanca',
      caption: 'Altos funcionarios de seguridad nacional agregaron inadvertidamente a un periodista a un chat grupal de Signal donde se discutían planes para ataques militares en Yemen. Fotografía: Thomas Trutschel/Photothek vía Getty Images',
      backToNews: 'Volver a noticias',
      notFound: 'Artículo no encontrado',
      content: `Un boletín enviado el 18 de marzo señalaba que hackers rusos podrían acceder a los mensajes, mientras las autoridades de Trump minimizan el error.

El Pentágono alertó recientemente a sus funcionarios para que no usaran Signal, la aplicación de mensajería cifrada, debido a una vulnerabilidad técnica, según reveló un reportaje de NPR.

Esta revelación se produjo un día después de que la revista The Atlantic publicara un artículo detallando cómo altos funcionarios de seguridad nacional —incluidos el vicepresidente de EE.UU. y el secretario de defensa— agregaron accidentalmente a un periodista a un grupo de Signal, revelando planes para ataques militares en Yemen.

Las revelaciones causaron indignación generalizada por la falla de seguridad y repercutieron en círculos diplomáticos de todo el mundo. Sin embargo, las autoridades del gobierno Trump intentaron minimizar la gravedad de la información expuesta al periodista.

Pero, según un "boletín especial de seguridad operacional (OPSEC)" del Pentágono, obtenido por NPR y enviado el 18 de marzo, grupos de hackers rusos podrían explotar la vulnerabilidad en Signal para espiar organizaciones cifradas, potencialmente apuntando a "personas de interés".

Signal utiliza cifrado de extremo a extremo para mensajes y llamadas. También es una aplicación de código abierto, lo que significa que su código puede ser auditado por expertos independientes en busca de fallas. Normalmente, se considera un método seguro de comunicación.

El memorando general del Pentágono afirmó que "aplicaciones de mensajería de terceros", como Signal, pueden usarse para compartir información no clasificada, pero no deben usarse para enviar información no pública, aunque no esté clasificada oficialmente.

En respuesta a NPR, un portavoz de Signal afirmó que no tienen conocimiento de ninguna vulnerabilidad, real o supuesta, que no haya sido abordada públicamente.

El reportaje de The Atlantic, escrito por el editor en jefe Jeffrey Goldberg, detalla los mensajes intercambiados por altos funcionarios del gobierno Trump y fue ampliamente ridiculizado en línea, destacando la falta de prudencia al discutir ataques militares y el error original de agregar a un periodista a la conversación sensible. El chat incluía figuras como el vicepresidente JD Vance, el secretario de defensa Pete Hegseth, el director de la CIA John Ratcliffe, entre otros.

Goldberg no publicó todos los mensajes. En un podcast liberal el martes, afirmó que se negó a divulgar la conversación completa, incluso después de que el gobierno Trump afirmara que no se había compartido información confidencial. Trump calificó la filtración como una "falla técnica".

Políticos demócratas criticaron duramente a los responsables de la seguridad. El martes, durante una audiencia en el Comité de Inteligencia del Senado, senadores demócratas presionaron a la directora de inteligencia nacional Tulsi Gabbard, al jefe de la CIA John Ratcliffe y al director del FBI, Kash Patel, sobre la filtración en Signal.

Goldberg habría recibido información sobre una serie de ataques aéreos inminentes en áreas controladas por los hutíes el 15 de marzo, pocas horas antes de que ocurrieran los ataques. Según los propios hutíes, apoyados por Irán, al menos 31 personas murieron como resultado de los bombardeos.

EE.UU. ha estado atacando posiciones hutíes desde noviembre de 2023, después de que los hutíes comenzaran a atacar embarcaciones comerciales y militares en el Mar Rojo, en respuesta a los ataques de Israel contra Gaza apoyados por EE.UU.`
    },
    '3': {
      title: 'Cómo la Aplicación Imitación de Signal, TeleMessage, Fue Hackeada en 20 Minutos',
      caption: 'https://www.wired.com/story/how-the-signal-knock-off-app-telemessage-got-hacked-in-20-minutes/?utm_source=chatgpt.com',
      backToNews: 'Volver a noticias',
      notFound: 'Artículo no encontrado',
      content: `La empresa detrás del clon de Signal, utilizado por al menos un miembro del gobierno Trump, fue hackeada a principios de este mes. El hacker afirma que logró acceder debido a una simple mala configuración.

Durante una reciente reunión ministerial, el entonces asesor de seguridad nacional del presidente Donald Trump, Mike Waltz, parecía estar aburrido. Aparentemente sin percibir al fotógrafo detrás de él, fue captado revisando clandestinamente sus mensajes de Signal debajo de la mesa.

Solo que no estaba usando la app oficial de Signal, ampliamente considerada el estándar de oro en aplicaciones de mensajería cifrada. En realidad, usaba un clon de Signal llamado TeleMessage Signal, o TM SGNL. Esta app, desarrollada por TeleMessage (recientemente adquirida por Smarsh), funciona casi de la misma forma que Signal, con la diferencia de que archiva copias de todos los mensajes que pasan por ella, destruyendo cualquier garantía de seguridad.

El exploit utilizado por el hacker fue increíblemente simple. En su momento, se decidió no divulgar los detalles porque sería muy fácil para otros replicar el ataque. Desde entonces, TeleMessage suspendió temporalmente todos los servicios, razón por la cual WIRED ahora puede compartir exactamente cómo ocurrió el hackeo, sin poner en riesgo datos privados de nadie.

"Primero, accedí al panel de administración en secure.telemessage.com y noté que estaban haciendo el hash de las contraseñas con MD5 del lado del cliente, algo que anula los beneficios de seguridad del hashing, ya que el hash se convierte efectivamente en la propia contraseña", dijo el hacker. (El hashing es una forma de ocultar criptográficamente una contraseña almacenada; y MD5 es un algoritmo considerado débil y obsoleto.) El sitio Drop Site News informó posteriormente que este panel de administración exponía direcciones de correo electrónico, contraseñas, nombres de usuario y números de teléfono al público.

El débil sistema de hash de contraseñas y el hecho de que el sitio de TeleMessage hubiera sido programado con JSP —una tecnología de la década de 2000 para crear apps web en Java— dieron al hacker "la impresión de que su seguridad debería ser débil". Con la esperanza de encontrar archivos JSP vulnerables, el hacker usó feroxbuster, una herramienta que localiza rápidamente recursos accesibles públicamente en un sitio, en el dominio secure.telemessage.com.

El hacker también usó feroxbuster en archive.telemessage.com, otro dominio de la empresa, donde encontró una URL vulnerable que terminaba en /heapdump.

Al acceder a esa URL, el servidor respondió con un heap dump de Java — un archivo de aproximadamente 150 MB que contenía una imagen de la memoria del servidor en el momento del acceso.

El hacker afirmó que "ya sabía por experiencia previa que los heap dumps de servidores web pueden contener los 'cuerpos' de las solicitudes HTTP" y que esto podría incluir credenciales de inicio de sesión de los usuarios. Y, en el caso de TM SGNL, así fue. Al descargar el heap dump y buscar "password", el hacker pudo visualizar nombres de usuario y contraseñas de usuarios aleatorios.`
    },
    '4': {
      title: 'El Pentágono advirtió al personal sobre el uso de Signal antes de la filtración de chats de la Casa Blanca',
      caption: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      sourceUrl: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      backToNews: 'Volver a noticias',
      notFound: 'Artículo no encontrado',
      content: `Ahora que todos usan las mismas tecnologías de comunicación, las vulnerabilidades de seguridad se amplifican.

El Consejero de Seguridad Nacional de EE.UU., Mike Waltz, quien inició el ahora infame grupo en Signal para coordinar un ataque contra los hutíes (grupo armado en Yemen) el 15 de marzo, parece estar sugiriendo que Signal —considerado uno de los apps más seguros del mundo— tiene fallas de seguridad.

"No vi a ese perdedor en el grupo", dijo Waltz a Fox News sobre Jeffrey Goldberg, editor en jefe de la revista The Atlantic, quien fue accidentalmente incluido en el grupo. "Si entró a propósito o si fue algún problema técnico, estamos tratando de averiguarlo."

Poco después de esa declaración, CBS News publicó que la NSA (Agencia de Seguridad Nacional) de EE.UU. había enviado un boletín interno alertando a sus funcionarios sobre una posible vulnerabilidad en Signal.


El verdadero problema

Si Signal realmente tiene fallas, China, Rusia y otros adversarios de EE.UU. ahora tienen más incentivos para encontrarlas. Al mismo tiempo, la NSA necesita actuar rápidamente para identificar y corregir vulnerabilidades — y garantizar que los smartphones comerciales no contengan backdoors, es decir, accesos secretos que permitan burlar la seguridad de los dispositivos.

Esto es esencial para cualquier persona que desee mantener sus comunicaciones privadas — e, idealmente, esto debería incluirnos a todos.


La doble misión de la NSA

Es de conocimiento público que la NSA tiene como misión espiar redes de comunicación extranjeras. (Durante el gobierno de George W. Bush, la agencia llegó a intervenir comunicaciones domésticas sin orden judicial — algo que tribunales federales declararon ilegal, hasta que decisiones posteriores en instancias superiores revirtieron el entendimiento.)

Al mismo tiempo, la NSA tiene otra responsabilidad: proteger las comunicaciones de EE.UU. contra el espionaje extranjero. En otras palabras, mientras una parte de la NSA escucha comunicaciones ajenas, otra trabaja para impedir que lo mismo se haga con los estadounidenses.

Durante la Guerra Fría, estas misiones no se contradecían — aliados y enemigos usaban sistemas distintos. Hoy, todos usan los mismos smartphones, las mismas apps y los mismos servidores.


¿Explotar o corregir fallas?

Cuando la NSA descubre una falla técnica en Signal (o compra una en el mercado negro de exploits), ¿debe usarla en secreto para espiar a enemigos, o divulgarla para que sea corregida?

Desde 2014, el gobierno de EE.UU. adopta un proceso llamado "Vulnerabilities Equities Process" para decidir si una falla será explotada o corregida — pero estas decisiones no siempre son simples.


Cuando Signal es usado por el propio gobierno

Ahora, con Mike Waltz, el vicepresidente J.D. Vance, el secretario de Defensa Pete Hegseth y otros altos funcionarios usando Signal para coordinar acciones militares, la situación se complica.

Signal es ampliamente utilizado por gobiernos menores, periodistas, activistas de derechos humanos, minorías perseguidas, ejecutivos de grandes empresas y criminales. Muchos de estos grupos están en el radar de la NSA.

Sin embargo, la misma app está siendo utilizada por autoridades militares de EE.UU. Entonces, ¿qué hace la NSA si encuentra una falla en Signal?

Antes, podría mantenerla en secreto para espiar a enemigos.
Ahora, si lo hace, corre el riesgo de que otro país encuentre la misma falla y la use contra EE.UU.
Si eso sucede y se revela que la NSA podría haber corregido el problema y no lo hizo, el daño institucional puede ser enorme.


El eslabón más débil: los smartphones

El mayor riesgo de interceptación en conversaciones de Signal está en los propios dispositivos móviles. No está claro si los oficiales de EE.UU. estaban usando celulares personales o aparatos proporcionados por el gobierno — pero todo indica que eran smartphones comunes, inadecuados para comunicaciones confidenciales.

Hoy existe un mercado de spywares altamente sofisticados, vendidos a gobiernos de todo el mundo. China ya habría intentado acceder a los celulares de Trump y Vance con estas herramientas.

Además, el FBI y otras agencias ya han presionado a Apple y Google para que inserten backdoors en los sistemas operativos — lo que abriría nuevas puertas para invasores.

Un ataque reciente proveniente de China habría explotado exactamente una de estas puertas ocultas en redes de telecomunicación en EE.UU.


Para proteger a EE.UU., la NSA necesita divulgar fallas, no esconderlas

Ante los eventos, el gobierno estadounidense tiene ahora un incentivo urgente para proteger estos dispositivos, lo que significa también que no debe seguir ocultando fallas de Signal.

Esto es una buena noticia para cualquier ciudadano estadounidense que desee mantener sus conversaciones privadas, sin interferencia del gobierno o de terceros.

Es difícil prever cómo la administración Trump está presionando a los servicios de inteligencia para actuar, pero existe un riesgo real de que la NSA vuelva a monitorear comunicaciones internas — como hizo en el pasado.

Debido a la filtración en Signal, es menos probable que esto se haga a través de brechas en la aplicación. Por otro lado, criminales, como cárteles de drogas, también pueden sentirse más seguros usando Signal.

¿El motivo? Comparten los mismos riesgos que el propio gobierno: nadie quiere que sus secretos sean expuestos.


La seguridad debe ser prioridad — sin brechas impuestas por el gobierno

Con smartphones en los bolsillos de ministros, policías, jueces, CEOs y operadores de centrales nucleares, y ahora siendo utilizados para conversaciones "sensibles" entre miembros del gabinete, necesitamos que estos dispositivos sean lo más seguros posible.

Y eso significa prohibir backdoors obligatorios por parte del gobierno.

Puede ser que aún descubramos cómo exactamente el vicepresidente y otros altos cargos pasaron a usar Signal en aparatos personales, violando posiblemente las leyes federales sobre comunicaciones oficiales.

Tal vez nunca pensaron en las consecuencias — pero ahora son reales.

Gobiernos aliados y rivales de EE.UU. tienen, a partir de ahora, más motivos que nunca para intentar quebrar la seguridad de Signal — y para hackear los celulares de autoridades estadounidenses.`
    }
  },
  en: {
    '1': {
      title: '92% of Mobile Applications Use Insecure Cryptographic Methods',
      backToNews: 'Back to news',
      notFound: 'Article not found',
      content: `A new analysis of more than 17,000 enterprise mobile applications has revealed critical security flaws that could put millions of users and businesses at risk.

According to a new report by Zimperium, titled "Your Apps are Leaking: The Hidden Data Risks on your Phone," these vulnerabilities include:

• Misconfigured cloud storage
• Hardcoded credentials within the app
• Outdated cryptographic practices

The report shows that mobile applications used in corporate environments are leaking sensitive information at an alarming rate.

Researchers analyzed 17,333 work mobile applications from official stores (6,037 for Android and 11,626 for iOS), discovering serious security issues in both the Android and iOS ecosystems.

🛠️ Most concerning findings:

• 83 Android apps used unprotected or misconfigured cloud storage
• 10 Android apps contained exposed Amazon Web Services (AWS) credentials
• 92% of all analyzed apps used weak or flawed cryptographic methods
• 5 of the top 100 most popular apps had serious cryptographic flaws, such as hardcoded keys or outdated algorithms

These vulnerabilities can expose data in transit or at rest, leaving companies vulnerable to:

• Unauthorized access
• Data manipulation
• Extortion, even without traditional ransomware attacks

"Misconfigured cloud storage and exposed credentials is like leaving the front door open and saying the house is secure," said Boris Cipot, senior security engineer at Black Duck.

"It's an open invitation for attackers to steal data by exploiting careless configurations."

The Cost of Negligence

The growing reliance on mobile devices in corporate environments, especially under BYOD (bring your own device) policies, has significantly increased the attack surface for cybercriminals.

In 2024 alone, data breaches affected more than 1.7 billion people, generating estimated financial losses of $280 billion.

Although cloud integration is fundamental for scalability, it introduces risks when APIs and SDKs are not implemented securely.

Some applications within the top 100 of the Google Play Store had publicly exposed storage directories, making them vulnerable to constant scanning by malicious actors.

Cryptographic weaknesses further compound the threat. The use of outdated algorithms like MD2 and insecure random number generators means that even encrypted data may not be protected.

"Cryptography is the foundation of secure communication and storage," added Cipot.

"If flawed cryptographic algorithms are used or no protection is applied, we are facing a highly alarming situation."

Recommendations for Businesses

To address these risks, Zimperium recommends that enterprise organizations take the following actions:

• Identify and correct misconfigured cloud settings
• Detect and rotate exposed credentials and API keys
• Validate cryptographic methods used and avoid outdated or insecure algorithms
• Monitor third-party SDKs for known vulnerabilities

"Cloud adoption has unlocked enormous potential for organizations," said Rom Carmel, co-founder and CEO of Apono.

"But to remain resilient in today's dynamic threat landscape, security teams must adopt a defense-in-depth strategy: eliminate permanent access, apply the principle of least privilege, and limit what compromised identities can do."`
    },
    '2': {
      title: 'The Pentagon Warned Staff Not to Use Signal Before White House Chat Leak',
      caption: 'Top national security officials inadvertently added a journalist to a Signal group chat discussing plans for military strikes in Yemen. Photograph: Thomas Trutschel/Photothek via Getty Images',
      backToNews: 'Back to news',
      notFound: 'Article not found',
      content: `A bulletin sent on March 18 said Russian hackers could access messages, while Trump officials downplay the mistake.

The Pentagon recently warned its staff not to use Signal, the encrypted messaging app, due to a technical vulnerability, according to a report by NPR.

This revelation came one day after The Atlantic magazine published a story detailing how top national security officials — including the U.S. Vice President and the Secretary of Defense — accidentally added a journalist to a Signal group, revealing plans for military strikes in Yemen.

The revelations caused widespread outrage over the security breach and reverberated through diplomatic circles around the world. However, Trump administration officials tried to downplay the severity of the information exposed to the journalist.

But according to a "special operational security (OPSEC) bulletin" from the Pentagon, obtained by NPR and sent on March 18, Russian hacker groups could exploit the vulnerability in Signal to spy on encrypted organizations, potentially targeting "persons of interest."

Signal uses end-to-end encryption for messages and calls. It is also an open-source application, meaning its code can be audited by independent experts for flaws. It is normally considered a secure communication method.

The Pentagon's general memo stated that "third-party messaging applications," such as Signal, can be used to share unclassified information, but should not be used to send non-public information, even if not officially classified.

In response to NPR, a Signal spokesperson stated that they are not aware of any vulnerability, real or alleged, that has not already been publicly addressed.

The Atlantic's report, written by editor-in-chief Jeffrey Goldberg, details messages exchanged by top Trump administration officials and was widely ridiculed online — highlighting the lack of prudence in discussing military strikes and the original mistake of adding a journalist to the sensitive conversation. The chat included figures such as Vice President JD Vance, Secretary of Defense Pete Hegseth, CIA Director John Ratcliffe, among others.

Goldberg did not publish all the messages. On a liberal podcast on Tuesday, he said he refused to release the full conversation, even after the Trump administration claimed no confidential information had been shared. Trump called the leak a "technical glitch."

Democratic politicians harshly criticized those responsible for security. On Tuesday, during a hearing before the Senate Intelligence Committee, Democratic senators pressed Director of National Intelligence Tulsi Gabbard, CIA Chief John Ratcliffe, and FBI Director Kash Patel about the Signal leak.

Goldberg reportedly received information about a series of imminent airstrikes in Houthi-controlled areas on March 15, just hours before the strikes occurred. According to the Iran-backed Houthis themselves, at least 31 people died as a result of the bombings.

The U.S. has been attacking Houthi positions since November 2023, after the Houthis began targeting commercial and military vessels in the Red Sea in response to U.S.-backed Israeli attacks on Gaza.`
    },
    '3': {
      title: 'How the Signal Knock-Off App TeleMessage Got Hacked in 20 Minutes',
      caption: 'https://www.wired.com/story/how-the-signal-knock-off-app-telemessage-got-hacked-in-20-minutes/?utm_source=chatgpt.com',
      backToNews: 'Back to news',
      notFound: 'Article not found',
      content: `The company behind the Signal clone, used by at least one member of the Trump administration, was breached earlier this month. The hacker claims they gained access due to a simple misconfiguration.

During a recent cabinet meeting, then-National Security Adviser to President Donald Trump, Mike Waltz, appeared to be bored. Seemingly unaware of the photographer behind him, he was caught surreptitiously checking his Signal messages under the table.

Except he wasn't using the official Signal app, widely considered the gold standard in encrypted messaging applications. In reality, he was using a Signal clone called TeleMessage Signal, or TM SGNL. This app, developed by TeleMessage (recently acquired by Smarsh), works almost the same way as Signal, with the difference that it archives copies of all messages that pass through it, destroying any security guarantee.

The exploit used by the hacker was incredibly simple. At the time, it was decided not to disclose the details because it would be too easy for others to replicate the attack. Since then, TeleMessage has temporarily suspended all services, which is why WIRED can now share exactly how the hack happened, without putting anyone's private data at risk.

"First, I accessed the admin panel at secure.telemessage.com and noticed they were hashing passwords with MD5 on the client side, which negates the security benefits of hashing since the hash effectively becomes the password itself," said the hacker. (Hashing is a way of cryptographically obscuring a stored password; and MD5 is an algorithm considered weak and outdated.) The Drop Site News site later reported that this admin panel exposed email addresses, passwords, usernames, and phone numbers to the public.

The weak password hashing system and the fact that the TeleMessage site had been built with JSP — a 2000s-era technology for building Java web apps — gave the hacker "the impression that their security should be weak." Hoping to find vulnerable JSP files, the hacker used feroxbuster, a tool that quickly locates publicly accessible resources on a site, on the secure.telemessage.com domain.

The hacker also used feroxbuster on archive.telemessage.com, another company domain, where they found a vulnerable URL ending in /heapdump.

When accessing that URL, the server responded with a Java heap dump — a file of approximately 150 MB containing a snapshot of the server's memory at the time of access.

The hacker stated that they "already knew from prior experience that heap dumps from web servers can contain the 'bodies' of HTTP requests" and that this could include user login credentials. And, in the case of TM SGNL, it did. By downloading the heap dump and searching for "password," the hacker was able to view usernames and passwords of random users.`
    },
    '4': {
      title: 'The Pentagon Warned Staff About Using Signal Before White House Chat Leak',
      caption: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      sourceUrl: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      backToNews: 'Back to news',
      notFound: 'Article not found',
      content: `Now that everyone uses the same communication technologies, security vulnerabilities are amplified.

The U.S. National Security Adviser, Mike Waltz, who started the now-infamous Signal group to coordinate an attack against the Houthis (an armed group in Yemen) on March 15, appears to be suggesting that Signal — considered one of the most secure apps in the world — has security flaws.

"I didn't see that loser in the group," Waltz told Fox News about Jeffrey Goldberg, editor-in-chief of The Atlantic magazine, who was accidentally added to the group. "Whether he got in on purpose or it was some technical glitch, we're trying to figure it out."

Shortly after that statement, CBS News published that the NSA (National Security Agency) had sent an internal bulletin warning its staff about a potential vulnerability in Signal.


The real problem

If Signal truly has flaws, China, Russia, and other U.S. adversaries now have more incentive to find them. At the same time, the NSA needs to act quickly to identify and fix vulnerabilities — and ensure that commercial smartphones don't contain backdoors, i.e., secret access points that allow bypassing device security.

This is essential for anyone who wants to keep their communications private — and, ideally, this should include all of us.


The NSA's dual mission

It is public knowledge that the NSA's mission includes spying on foreign communication networks. (During the George W. Bush administration, the agency even wiretapped domestic communications without a court order — something federal courts declared illegal, until later decisions in higher courts reversed the understanding.)

At the same time, the NSA has another responsibility: protecting U.S. communications against foreign espionage. In other words, while one part of the NSA listens to others' communications, another works to prevent the same from being done to Americans.

During the Cold War, these missions didn't contradict each other — allies and enemies used different systems. Today, everyone uses the same smartphones, the same apps, and the same servers.


Exploit or fix flaws?

When the NSA discovers a technical flaw in Signal (or buys one on the exploit black market), should it use it secretly to spy on enemies, or disclose it so it can be fixed?

Since 2014, the U.S. government has adopted a process called the "Vulnerabilities Equities Process" to decide whether a flaw will be exploited or fixed — but these decisions are not always straightforward.


When Signal is used by the government itself

Now, with Mike Waltz, Vice President J.D. Vance, Secretary of Defense Pete Hegseth, and other top officials using Signal to coordinate military actions, the situation becomes complicated.

Signal is widely used by smaller governments, journalists, human rights activists, persecuted minorities, corporate executives, and criminals. Many of these groups are on the NSA's radar.

However, the same app is being used by U.S. military authorities. So what does the NSA do if it finds a flaw in Signal?

Before, it could keep it secret to spy on enemies.
Now, if it does, it risks another country finding the same flaw and using it against the U.S.
If that happens and it's revealed that the NSA could have fixed the problem and didn't, the institutional damage could be enormous.


The weakest link: smartphones

The greatest risk of interception in Signal conversations lies in the mobile devices themselves. It's unclear whether U.S. officials were using personal phones or government-issued devices — but everything suggests they were regular smartphones, unsuitable for confidential communications.

Today there's a market for highly sophisticated spyware, sold to governments worldwide. China may have already attempted to access Trump's and Vance's phones with these tools.

Additionally, the FBI and other agencies have already pressured Apple and Google to insert backdoors into operating systems — which would open new doors for attackers.

A recent attack originating from China reportedly exploited exactly one of these hidden backdoors in U.S. telecommunications networks.


To protect the U.S., the NSA needs to disclose flaws, not hide them

Given these events, the U.S. government now has an urgent incentive to protect these devices, which also means it should no longer hide Signal flaws.

This is good news for any American citizen who wants to keep their conversations private, without interference from the government or third parties.

It's hard to predict how the Trump administration is pressuring intelligence services to act, but there's a real risk that the NSA may resume monitoring domestic communications — as it has done in the past.

Because of the Signal leak, it's less likely this will be done through vulnerabilities in the app. On the other hand, criminals, such as drug cartels, may also feel safer using Signal.

The reason? They share the same risks as the government itself: no one wants their secrets exposed.


Security must be a priority — without government-imposed backdoors

With smartphones in the pockets of ministers, police officers, judges, CEOs, and nuclear plant operators, and now being used for "sensitive" conversations among cabinet members, we need these devices to be as secure as possible.

And that means prohibiting government-mandated backdoors.

We may yet discover how exactly the Vice President and other top officials came to use Signal on personal devices, possibly violating federal laws on official communications.

Perhaps they never thought about the consequences — but now they are real.

Allied and rival governments of the U.S. have, from now on, more reason than ever to try to break Signal's security — and to hack the phones of American officials.`
    }
  },
  pt: {
    '1': {
      title: '92% dos Aplicativos Móveis Utilizam Métodos Criptográficos Inseguros',
      backToNews: 'Voltar às notícias',
      notFound: 'Artigo não encontrado',
      content: `Uma nova análise de mais de 17.000 aplicativos móveis empresariais revelou falhas de segurança críticas que poderiam colocar em risco milhões de usuários e empresas.

Segundo um novo relatório da Zimperium, intitulado "Your Apps are Leaking: The Hidden Data Risks on your Phone" (Seus aplicativos estão vazando: os riscos ocultos de dados no seu telefone), essas vulnerabilidades incluem:

• Armazenamento em nuvem mal configurado
• Credenciais codificadas dentro do app
• Práticas criptográficas obsoletas

O relatório mostra que os aplicativos móveis utilizados em ambientes corporativos estão vazando informações sensíveis a um ritmo alarmante.

Os pesquisadores analisaram 17.333 aplicativos móveis de trabalho de lojas oficiais (6.037 para Android e 11.626 para iOS), descobrindo graves problemas de segurança tanto no ecossistema Android quanto no iOS.

🛠️ Descobertas mais preocupantes:

• 83 apps de Android utilizavam armazenamento em nuvem sem proteção ou mal configurado
• 10 apps de Android continham credenciais expostas da Amazon Web Services (AWS)
• 92% de todos os apps analisados utilizavam métodos criptográficos fracos ou com falhas
• 5 dos 100 apps mais populares tinham falhas criptográficas graves, como chaves codificadas no código ou algoritmos obsoletos

Essas vulnerabilidades podem expor dados em trânsito ou armazenados, deixando as empresas vulneráveis a:

• Acessos não autorizados
• Manipulação de dados
• Extorsão, mesmo sem ataques tradicionais de ransomware

"Uma má configuração do armazenamento em nuvem e credenciais expostas é como deixar a porta principal aberta e dizer que a casa está segura", afirmou Boris Cipot, engenheiro sênior de segurança na Black Duck.

"É um convite aberto para que os atacantes roubem dados aproveitando configurações descuidadas."

O Custo da Negligência

A crescente dependência de dispositivos móveis em ambientes corporativos, especialmente sob políticas BYOD (bring your own device, ou "traga seu próprio dispositivo"), aumentou significativamente a superfície de ataque para os cibercriminosos.

Apenas em 2024, os vazamentos de dados afetaram mais de 1,7 bilhão de pessoas, gerando perdas financeiras estimadas em 280 bilhões de dólares.

Embora a integração com a nuvem seja fundamental para a escalabilidade, ela introduz riscos quando as APIs e SDKs não são implementadas de forma segura.

Alguns aplicativos dentro do top 100 da Google Play Store tinham diretórios de armazenamento expostos ao público, tornando-os vulneráveis a varreduras constantes por parte de atores maliciosos.

As fraquezas criptográficas agravam ainda mais a ameaça. O uso de algoritmos desatualizados como MD2 e geradores de números aleatórios inseguros significa que mesmo os dados criptografados podem não estar protegidos.

"A criptografia é a base da comunicação e do armazenamento seguros", acrescentou Cipot.

"Se algoritmos criptográficos defeituosos são utilizados ou nenhuma proteção é aplicada, estamos diante de uma situação altamente alarmante."

Recomendações para as Empresas

Para enfrentar esses riscos, a Zimperium recomenda que as organizações empresariais tomem as seguintes ações:

• Identificar e corrigir configurações mal feitas na nuvem
• Detectar e rotacionar credenciais e chaves API expostas
• Validar os métodos criptográficos utilizados e evitar algoritmos obsoletos ou inseguros
• Monitorar SDKs de terceiros em busca de vulnerabilidades conhecidas

"A adoção da nuvem desbloqueou um enorme potencial para as organizações", disse Rom Carmel, cofundador e CEO da Apono.

"Mas para se manterem resilientes no panorama dinâmico de ameaças atual, as equipes de segurança devem adotar uma estratégia de defesa em profundidade: eliminar acessos permanentes, aplicar o princípio de menor privilégio e limitar o que as identidades comprometidas podem fazer."`
    },
    '2': {
      title: 'Pentágono alertou funcionários para não usarem Signal antes do vazamento de chats da Casa Branca',
      caption: 'Altos funcionários de segurança nacional adicionaram inadvertidamente um jornalista a um chat de grupo no Signal onde se discutiam planos para ataques militares no Iêmen. Fotografia: Thomas Trutschel/Photothek via Getty Images',
      backToNews: 'Voltar às notícias',
      notFound: 'Artigo não encontrado',
      content: `Boletim enviado em 18 de março dizia que hackers russos poderiam acessar mensagens, enquanto autoridades de Trump minimizam o erro.

O Pentágono alertou recentemente seus funcionários para não usarem o Signal, o aplicativo de mensagens criptografadas, devido a uma vulnerabilidade técnica, segundo revelou uma reportagem da NPR.

Essa revelação veio um dia após a revista The Atlantic publicar uma matéria detalhando como altos funcionários de segurança nacional — incluindo o vice-presidente dos EUA e o secretário de defesa — acidentalmente adicionaram um jornalista a um grupo no Signal, revelando planos para ataques militares no Iêmen.

As revelações causaram indignação generalizada com a falha de segurança e repercutiram em círculos diplomáticos ao redor do mundo. No entanto, autoridades do governo Trump tentaram minimizar a gravidade das informações expostas ao jornalista.

Mas, segundo um "boletim especial de segurança operacional (OPSEC)" do Pentágono, obtido pela NPR e enviado em 18 de março, grupos de hackers russos poderiam explorar a vulnerabilidade no Signal para espionar organizações criptografadas, potencialmente mirando em "pessoas de interesse".

O Signal usa criptografia de ponta a ponta para mensagens e chamadas. Também é um aplicativo de código aberto, ou seja, seu código pode ser auditado por especialistas independentes em busca de falhas. Normalmente, é considerado um método seguro de comunicação.

O memorando geral do Pentágono afirmou que "aplicativos de mensagens de terceiros", como o Signal, podem ser usados para compartilhar informações não classificadas, mas não devem ser usados para enviar informações não públicas, mesmo que não sejam classificadas oficialmente.

Em resposta à NPR, um porta-voz do Signal afirmou que não estão cientes de nenhuma vulnerabilidade, real ou suposta, que ainda não tenha sido tratada publicamente.

A reportagem da The Atlantic, escrita pelo editor-chefe Jeffrey Goldberg, detalha as mensagens trocadas por altos funcionários do governo Trump e foi amplamente ridicularizada online — destacando a falta de prudência ao discutir ataques militares e o erro original de adicionar um jornalista à conversa sensível. O chat incluía figuras como o vice-presidente JD Vance, o secretário de defesa Pete Hegseth, o diretor da CIA John Ratcliffe, entre outros.

Goldberg não publicou todas as mensagens. Em um podcast liberal na terça-feira, afirmou que recusou-se a divulgar a conversa completa, mesmo após o governo Trump afirmar que nenhuma informação confidencial havia sido compartilhada. Trump classificou o vazamento como uma "falha técnica".

Políticos democratas criticaram duramente os responsáveis pela segurança. Na terça-feira, durante uma audiência no Comitê de Inteligência do Senado, senadores democratas pressionaram a diretora de inteligência nacional Tulsi Gabbard, o chefe da CIA John Ratcliffe e o diretor do FBI, Kash Patel, sobre o vazamento no Signal.

Goldberg teria recebido informações sobre uma série de ataques aéreos iminentes em áreas controladas pelos Houthis no dia 15 de março, poucas horas antes de os ataques ocorrerem. Segundo os próprios Houthis, apoiados pelo Irã, pelo menos 31 pessoas morreram como resultado dos bombardeios.

Os EUA vêm atacando posições Houthi desde novembro de 2023, após os Houthis começarem a alvejar embarcações comerciais e militares no Mar Vermelho, em resposta aos ataques de Israel contra Gaza apoiados pelos EUA.`
    },
    '3': {
      title: 'Como o Clone do Signal, TeleMessage, Foi Hackeado em 20 Minutos',
      caption: 'https://www.wired.com/story/how-the-signal-knock-off-app-telemessage-got-hacked-in-20-minutes/?utm_source=chatgpt.com',
      backToNews: 'Voltar às notícias',
      notFound: 'Artigo não encontrado',
      content: `A empresa por trás do clone do Signal, usado por pelo menos um membro do governo Trump, foi invadida no início deste mês. O hacker afirma que conseguiu acesso devido a uma simples má configuração.

Durante uma recente reunião ministerial, o então assessor de segurança nacional do presidente Donald Trump, Mike Waltz, pareceu estar entediado. Aparentemente sem perceber o fotógrafo atrás dele, foi flagrado verificando clandestinamente suas mensagens do Signal debaixo da mesa.

Só que ele não estava usando o app oficial do Signal, amplamente considerado o padrão ouro em aplicativos de mensagens criptografadas. Na verdade, ele usava um clone do Signal chamado TeleMessage Signal, ou TM SGNL. Esse app, desenvolvido pela TeleMessage (recentemente adquirida pela Smarsh), funciona quase da mesma forma que o Signal, com a diferença de que arquiva cópias de todas as mensagens que passam por ele, destruindo qualquer garantia de segurança.

A exploração usada pelo hacker foi incrivelmente simples. Na época, decidiu-se não divulgar os detalhes porque seria muito fácil para outros replicarem o ataque. Desde então, a TeleMessage suspendeu temporariamente todos os serviços, razão pela qual a WIRED agora pode compartilhar exatamente como o hack aconteceu, sem colocar dados privados de ninguém em risco.

"Primeiro, acessei o painel de administração em secure.telemessage.com e percebi que eles estavam fazendo o hash das senhas com MD5 no lado do cliente, algo que anula os benefícios de segurança do hashing, já que o hash se torna efetivamente a própria senha", disse o hacker. (Hashing é uma forma de obscurecer criptograficamente uma senha armazenada; e o MD5 é um algoritmo considerado fraco e ultrapassado.) O site Drop Site News posteriormente informou que esse painel de administração expôs endereços de e-mail, senhas, nomes de usuário e números de telefone ao público.

O fraco sistema de hash de senhas e o fato de o site da TeleMessage ter sido programado com JSP — uma tecnologia da década de 2000 para criação de apps web em Java — deram ao hacker "a impressão de que a segurança deles deveria ser fraca". Com esperança de encontrar arquivos JSP vulneráveis, o hacker usou o feroxbuster, uma ferramenta que localiza rapidamente recursos acessíveis publicamente em um site, no domínio secure.telemessage.com.

O hacker também usou o feroxbuster em archive.telemessage.com, outro domínio da empresa, onde encontrou uma URL vulnerável terminando em /heapdump.

Ao acessar essa URL, o servidor respondeu com um heap dump Java — um arquivo de aproximadamente 150 MB contendo uma imagem da memória do servidor no momento do acesso.

O hacker afirmou que "já sabia por experiência anterior que heap dumps de servidores web podem conter os 'corpos' das requisições HTTP" e que isso poderia incluir credenciais de login dos usuários. E, no caso do TM SGNL, incluía. Ao baixar o heap dump e buscar por "password", o hacker conseguiu visualizar nomes de usuário e senhas de usuários aleatórios.`
    },
    '4': {
      title: 'Pentágono alertou funcionários sobre o uso do Signal antes do vazamento de chats da Casa Branca',
      caption: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      sourceUrl: 'https://www.schneier.com/essays/archives/2025/03/how-the-signal-chat-leak-makes-the-nsas-job-harder.html',
      backToNews: 'Voltar às notícias',
      notFound: 'Artigo não encontrado',
      content: `Agora que todos usam as mesmas tecnologias de comunicação, as vulnerabilidades de segurança são amplificadas.

O Conselheiro de Segurança Nacional dos EUA, Mike Waltz, que iniciou o agora infame grupo no Signal para coordenar um ataque contra os houthis (grupo armado no Iêmen) no dia 15 de março, parece estar sugerindo que o Signal — considerado um dos apps mais seguros do mundo — tem falhas de segurança.

"Não vi esse perdedor no grupo", disse Waltz à Fox News sobre Jeffrey Goldberg, editor-chefe da revista The Atlantic, que foi acidentalmente incluído no grupo. "Se ele entrou de propósito ou se foi algum problema técnico, estamos tentando descobrir."

Logo depois dessa declaração, a CBS News publicou que a NSA (Agência de Segurança Nacional) dos EUA havia enviado um boletim interno alertando seus funcionários sobre uma possível vulnerabilidade no Signal.


O verdadeiro problema

Se o Signal realmente tem falhas, China, Rússia e outros adversários dos EUA agora têm mais incentivo para encontrá-las. Ao mesmo tempo, a NSA precisa agir rapidamente para identificar e corrigir vulnerabilidades — e garantir que smartphones comerciais não contenham backdoors, ou seja, acessos secretos que permitam burlar a segurança dos dispositivos.

Isso é essencial para qualquer pessoa que deseje manter suas comunicações privadas — e, idealmente, isso deveria incluir todos nós.


A missão dupla da NSA

É de conhecimento público que a NSA tem como missão espionar redes de comunicação estrangeiras. (Durante o governo George W. Bush, a agência chegou a grampear comunicações domésticas sem mandado judicial — algo que tribunais federais declararam ilegal, até que decisões posteriores em instâncias superiores reverteram o entendimento.)

Ao mesmo tempo, a NSA tem outra responsabilidade: proteger as comunicações dos EUA contra espionagem estrangeira. Em outras palavras, enquanto uma parte da NSA ouve comunicações alheias, outra trabalha para impedir que o mesmo seja feito com os americanos.

Durante a Guerra Fría, essas missões não se contradiziam — aliados e inimigos usavam sistemas distintos. Hoje, todos usam os mesmos smartphones, os mesmos apps e os mesmos servidores.


Explorar ou corrigir falhas?

Quando a NSA descobre uma falha técnica no Signal (ou compra uma no mercado negro de exploits), deve usá-la em segredo para espionar inimigos, ou divulgá-la para que seja corrigida?

Desde 2014, o governo dos EUA adota um processo chamado "Vulnerabilities Equities Process" para decidir se uma falha será explorada ou corrigida — mas essas decisões nem sempre são simples.


Quando o Signal é usado pelo próprio governo

Agora, com Mike Waltz, o vice-presidente J.D. Vance, o secretário de Defesa Pete Hegseth e outros altos funcionários usando o Signal para coordenar ações militares, a situação se complica.

O Signal é amplamente utilizado por governos menores, jornalistas, ativistas de direitos humanos, minorias perseguidas, executivos de grandes empresas e criminosos. Muitos desses grupos estão no radar da NSA.

Porém, o mesmo app está sendo usado por autoridades militares dos EUA. Então o que a NSA faz se encontrar uma falha no Signal?

Antes, ela poderia mantê-la em segredo para espionar inimigos.
Agora, se fizer isso, corre o risco de outro país encontrar a mesma falha e usá-la contra os EUA.
Se isso acontecer e for revelado que a NSA poderia ter corrigido o problema e não o fez, o dano institucional pode ser enorme.


O elo mais fraco: os smartphones

O maior risco de interceptação em conversas no Signal está nos próprios dispositivos móveis. Não está claro se os oficiais dos EUA estavam usando celulares pessoais ou aparelhos fornecidos pelo governo — mas tudo indica que eram smartphones comuns, inadequados para comunicações confidenciais.

Hoje existe um mercado de spywares altamente sofisticados, vendidos para governos do mundo todo. China já teria tentado acessar os celulares de Trump e Vance com essas ferramentas.

Além disso, o FBI e outras agências já pressionaram a Apple e o Google para que inserissem backdoors nos sistemas operacionais — o que abriria novas portas para invasores.

Um ataque recente vindo da China teria explorado exatamente uma dessas portas ocultas em redes de telecomunicação nos EUA.


Para proteger os EUA, a NSA precisa divulgar falhas, não escondê-las

Diante dos eventos, o governo americano tem agora um incentivo urgente para proteger esses dispositivos, o que significa também que não deve mais esconder falhas do Signal.

Isso é uma boa notícia para qualquer cidadão americano que deseje manter suas conversas privadas, sem interferência do governo ou de terceiros.

É difícil prever como a administração Trump está pressionando os serviços de inteligência a agirem, mas existe um risco real de a NSA voltar a monitorar comunicações internas — como fez no passado.

Por causa do vazamento no Signal, é menos provável que isso seja feito por meio de brechas no aplicativo. Por outro lado, criminosos, como cartéis de drogas, também podem se sentir mais seguros usando o Signal.

O motivo? Eles compartilham os mesmos riscos que o próprio governo: ninguém quer seus segredos expostos.


Segurança deve ser prioridade — sem brechas impostas pelo governo

Com smartphones nos bolsos de ministros, policiais, juízes, CEOs e operadores de usinas nucleares, e agora sendo usados para conversas "sensíveis" entre membros do gabinete, precisamos que esses dispositivos sejam o mais seguros possível.

E isso significa proibir backdoors obrigatórios por parte do governo.

Pode ser que ainda descubramos como exatamente o vice-presidente e outros altos cargos passaram a usar Signal em aparelhos pessoais, violando possivelmente as leis federais sobre comunicações oficiais.

Talvez eles nunca tenham pensado nas consequências — mas agora elas são reais.

Governos aliados e rivais dos EUA têm, a partir de agora, mais motivos do que nunca para tentar quebrar a segurança do Signal — e para hackear os celulares de autoridades norte-americanas.`
    }
  }
};
