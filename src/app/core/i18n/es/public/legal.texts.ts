export type LegalInline =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'strong'; readonly text: string }
  | { readonly kind: 'mail'; readonly text: string; readonly href: string }
  | { readonly kind: 'route'; readonly text: string; readonly route: string };

export type LegalBlock =
  | { readonly kind: 'h2'; readonly text: string }
  | { readonly kind: 'p'; readonly content: readonly LegalInline[] }
  | { readonly kind: 'ul'; readonly items: readonly (readonly LegalInline[])[] };

export interface LegalDocument {
  readonly title: string;
  readonly lastUpdated: string;
  readonly blocks: readonly LegalBlock[];
}

const CONTACT_EMAIL = '[correo-contacto]';

export const PUBLIC_LEGAL_TEXTS = {
  page: {
    lastUpdated: (date: string) => `Última actualización: ${date}`,
  },
  privacy: {
    title: 'Política de Privacidad',
    lastUpdated: '25 de septiembre de 2026',
    blocks: [
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'En ' },
          { kind: 'strong', text: 'Sanatte' },
          {
            kind: 'text',
            text: ' ([RAZÓN SOCIAL], NIT [NIT]) valoramos tu privacidad. Esta política explica qué datos personales recopilamos, con qué finalidad, con quién los compartimos y cómo puedes ejercer tus derechos, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.',
          },
        ],
      },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Aplica a nuestro sitio web, la aplicación móvil Sanatte (iOS y Android) y los servicios asociados (en conjunto, la "Plataforma").',
          },
        ],
      },
      { kind: 'h2', text: '1. Responsable del tratamiento' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: '[RAZÓN SOCIAL], con domicilio en [DIRECCIÓN], es responsable del tratamiento de tus datos personales. Para cualquier solicitud puedes escribirnos a ',
          },
          { kind: 'mail', text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { kind: 'text', text: '.' },
        ],
      },
      { kind: 'h2', text: '2. Datos que recopilamos' },
      {
        kind: 'ul',
        items: [
          [
            { kind: 'strong', text: 'Datos de cuenta:' },
            {
              kind: 'text',
              text: ' nombre, correo electrónico y, si registras con Google o Apple, el identificador de esos proveedores.',
            },
          ],
          [
            { kind: 'strong', text: 'Foto de perfil:' },
            { kind: 'text', text: ' si decides subir un avatar.' },
          ],
          [
            { kind: 'strong', text: 'Datos de uso y actividad:' },
            {
              kind: 'text',
              text: ' productos activados, recursos consultados, fechas de activación y dispositivo (web, iOS, Android).',
            },
          ],
          [
            { kind: 'strong', text: 'Datos de compra:' },
            {
              kind: 'text',
              text: ' pedidos y estado de pago (el procesamiento de pagos lo realiza Mercado Pago; no almacenamos los datos completos de tu tarjeta).',
            },
          ],
          [
            { kind: 'strong', text: 'Datos técnicos:' },
            { kind: 'text', text: ' dirección IP, tipo de dispositivo e identificadores para seguridad y funcionamiento.' },
          ],
        ],
      },
      { kind: 'h2', text: '3. Finalidades del tratamiento' },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Crear y gestionar tu cuenta y autenticación.' }],
          [{ kind: 'text', text: 'Activar productos mediante código QR y darte acceso a tu biblioteca digital.' }],
          [{ kind: 'text', text: 'Procesar compras y suscripciones.' }],
          [{ kind: 'text', text: 'Enviar notificaciones relacionadas con el servicio.' }],
          [{ kind: 'text', text: 'Mejorar la Plataforma y garantizar su seguridad.' }],
        ],
      },
      { kind: 'h2', text: '4. Terceros y encargados' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Compartimos datos, solo lo necesario, con proveedores que nos prestan servicios:' }],
      },
      {
        kind: 'ul',
        items: [
          [
            { kind: 'strong', text: 'Google Firebase' },
            { kind: 'text', text: ' — autenticación y almacenamiento (Google LLC).' },
          ],
          [
            { kind: 'strong', text: 'Mercado Pago' },
            { kind: 'text', text: ' — procesamiento de pagos.' },
          ],
          [
            { kind: 'strong', text: 'Cloudflare R2' },
            { kind: 'text', text: ' — almacenamiento y entrega de contenido multimedia.' },
          ],
        ],
      },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Estos proveedores pueden tratar datos fuera de Colombia bajo sus propias políticas y garantías de seguridad.',
          },
        ],
      },
      { kind: 'h2', text: '5. Conservación de los datos' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Conservamos tus datos mientras mantengas una cuenta activa y durante el tiempo necesario para cumplir obligaciones legales, contables o de seguridad. Cuando eliminas tu cuenta, borramos o anonimizamos tus datos personales salvo aquellos que debamos retener por ley.',
          },
        ],
      },
      { kind: 'h2', text: '6. Tus derechos' },
      { kind: 'p', content: [{ kind: 'text', text: 'Como titular puedes, en cualquier momento:' }] },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Conocer, actualizar y rectificar tus datos.' }],
          [{ kind: 'text', text: 'Solicitar prueba de la autorización otorgada.' }],
          [{ kind: 'text', text: 'Revocar la autorización y/o solicitar la supresión de tus datos.' }],
          [{ kind: 'text', text: 'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).' }],
        ],
      },
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'Para eliminar tu cuenta y tus datos, consulta nuestra ' },
          { kind: 'route', text: 'página de eliminación de cuenta', route: '/legal/eliminar-cuenta' },
          { kind: 'text', text: '.' },
        ],
      },
      { kind: 'h2', text: '7. Seguridad' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Aplicamos medidas técnicas y administrativas razonables para proteger tus datos contra acceso no autorizado, pérdida o alteración. La comunicación con nuestros servidores se realiza cifrada mediante HTTPS.',
          },
        ],
      },
      { kind: 'h2', text: '8. Menores de edad' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'La Plataforma no está dirigida a menores de edad sin autorización de sus padres o tutores. Si detectamos datos de un menor sin dicha autorización, procederemos a eliminarlos.',
          },
        ],
      },
      { kind: 'h2', text: '9. Cambios a esta política' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Podemos actualizar esta política. Publicaremos la versión vigente en esta página con su fecha de "última actualización".',
          },
        ],
      },
      { kind: 'h2', text: '10. Contacto' },
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos a ' },
          { kind: 'mail', text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { kind: 'text', text: '.' },
        ],
      },
    ],
  } satisfies LegalDocument,
  terms: {
    title: 'Términos de Servicio',
    lastUpdated: '22 de octubre de 2026',
    blocks: [
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Estos Términos de Servicio regulan el acceso y uso de ' }, { kind: 'strong', text: 'Sanatte' }, { kind: 'text', text: ' ([RAZÓN SOCIAL], NIT [NIT]), incluyendo el sitio web, la aplicación móvil (iOS y Android) y los servicios asociados (en conjunto, la "Plataforma"). Al crear una cuenta o usar la Plataforma aceptas estos términos. Si no estás de acuerdo, no utilices la Plataforma.' }],
      },
      { kind: 'h2', text: '1. Qué ofrece Sanatte' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Sanatte es un ecosistema de bienestar que combina productos físicos con código QR, contenido digital (audio, video y documentos) y suscripciones. Mediante tu cuenta puedes activar productos, acceder a tu biblioteca de contenido y acceder a beneficios de aliados y especialistas, según el producto que tengas activo.' }],
      },
      { kind: 'h2', text: '2. Tu cuenta' },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Debes ser mayor de edad o contar con la autorización de tus padres o tutores.' }],
          [{ kind: 'text', text: 'La información que nos das debe ser veraz y actualizada.' }],
          [{ kind: 'text', text: 'Puedes registrarte con correo y contraseña, o con tu cuenta de Google o Apple.' }],
          [{ kind: 'text', text: 'Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad realizada desde tu cuenta. Avísanos de inmediato si detectas un uso no autorizado.' }],
        ],
      },
      { kind: 'h2', text: '3. Activación de productos y acceso al contenido' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Los productos con código QR se activan iniciando sesión y vinculando el producto a tu cuenta. La activación es personal: el acceso queda asociado a la cuenta que activó el producto y no puede cederse ni venderse por separado. Algunos recursos pueden estar compartidos entre varios productos; mientras tengas al menos un producto activo que los incluya, conservarás el acceso a ellos.' }],
      },
      { kind: 'h2', text: '4. Compras, precios y pagos' },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Los precios se muestran en pesos colombianos (COP) e incluyen los impuestos aplicables, salvo que se indique lo contrario.' }],
          [{ kind: 'text', text: 'Los pagos se procesan a través de Mercado Pago. No almacenamos los datos completos de tu tarjeta.' }],
          [{ kind: 'text', text: 'Una compra se considera completada cuando el pago es aprobado. Si el pago es rechazado o queda pendiente, el producto no se activará hasta su confirmación.' }],
        ],
      },
      { kind: 'h2', text: '5. Suscripciones' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Cuando ofrezcamos suscripciones, se indicarán de forma clara el precio, la periodicidad y la fecha de renovación. Podrás cancelar la renovación en cualquier momento; conservarás el acceso hasta el final del periodo ya pagado. [Detallar política de reembolsos de suscripciones].' }],
      },
      { kind: 'h2', text: '6. Retracto, cambios y devoluciones' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Las compras a distancia se rigen por la Ley 1480 de 2011 (Estatuto del Consumidor). Para productos físicos puedes ejercer el derecho de retracto y solicitar garantía en los términos que establece la ley. Para contenido digital, el acceso comienza al activarse el producto; las condiciones específicas de devolución son: [DETALLAR]. Escríbenos y gestionaremos tu solicitud.' }],
      },
      { kind: 'h2', text: '7. Propiedad intelectual y licencia de uso' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Todo el contenido de la Plataforma (audios, videos, documentos, textos, marcas, diseños y software) pertenece a Sanatte o a sus licenciantes. Al activar un producto recibes una licencia personal, limitada, no exclusiva, intransferible y revocable para consultar el contenido con fines de uso personal y no comercial.' }],
      },
      { kind: 'h2', text: '8. Uso permitido' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Te comprometes a no:' }],
      },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Copiar, descargar de forma masiva, grabar, redistribuir, revender o publicar el contenido.' }],
          [{ kind: 'text', text: 'Compartir tus credenciales ni usar una misma cuenta para dar acceso a terceros.' }],
          [{ kind: 'text', text: 'Eludir las medidas técnicas de protección, URLs firmadas o límites de acceso.' }],
          [{ kind: 'text', text: 'Usar la Plataforma de forma ilícita, fraudulenta o que afecte su seguridad o disponibilidad.' }],
        ],
      },
      { kind: 'h2', text: '9. Aliados y especialistas' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Algunos productos incluyen beneficios ofrecidos por aliados y especialistas independientes. Sanatte facilita el acceso al beneficio, pero los servicios son prestados por esos terceros bajo su propia responsabilidad y condiciones.' }],
      },
      { kind: 'h2', text: '10. Aviso sobre salud y bienestar' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'El contenido de Sanatte tiene fines de bienestar e información general. ' }, { kind: 'strong', text: 'No sustituye' }, { kind: 'text', text: ' el diagnóstico, tratamiento ni consejo de un profesional de la salud. Si tienes una condición médica o psicológica, consulta a un profesional antes de seguir cualquier práctica. Si estás en una situación de emergencia, contacta a los servicios de emergencia de tu localidad.' }],
      },
      { kind: 'h2', text: '11. Disponibilidad y cambios del servicio' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Procuramos que la Plataforma esté disponible de forma continua, pero no garantizamos que funcione sin interrupciones o errores. Podemos modificar, actualizar o retirar funciones o contenidos, con un aviso razonable cuando afecte a productos que ya hayas adquirido.' }],
      },
      { kind: 'h2', text: '12. Limitación de responsabilidad' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'En la medida permitida por la ley, Sanatte no será responsable por daños indirectos o consecuenciales derivados del uso o la imposibilidad de uso de la Plataforma, ni por el contenido o servicios de terceros. Nada de lo aquí dispuesto limita derechos irrenunciables que la ley te reconozca como consumidor.' }],
      },
      { kind: 'h2', text: '13. Suspensión y terminación' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Podemos suspender o cancelar tu cuenta si incumples estos términos o la ley, con aviso previo cuando sea posible. También puedes eliminar tu cuenta en cualquier momento; consulta la ' }, { kind: 'route', text: 'página de eliminación de cuenta', route: '/legal/eliminar-cuenta' }, { kind: 'text', text: '.' }],
      },
      { kind: 'h2', text: '14. Datos personales' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'El tratamiento de tus datos personales se rige por nuestra ' }, { kind: 'route', text: 'Política de Privacidad', route: '/legal/privacidad' }, { kind: 'text', text: '.' }],
      },
      { kind: 'h2', text: '15. Cambios a estos términos' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Podemos actualizar estos términos. Publicaremos la versión vigente en esta página con su fecha de "última actualización". Si el cambio es sustancial, te lo informaremos por la Plataforma o por correo. El uso continuado de la Plataforma implica la aceptación de la versión vigente.' }],
      },
      { kind: 'h2', text: '16. Ley aplicable y jurisdicción' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a las autoridades competentes de [CIUDAD], Colombia, sin perjuicio de las acciones que puedas ejercer ante la Superintendencia de Industria y Comercio (SIC).' }],
      },
      { kind: 'h2', text: '17. Contacto' },
      {
        kind: 'p',
        content: [{ kind: 'text', text: 'Para dudas sobre estos términos, escríbenos a ' }, { kind: 'mail', text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }, { kind: 'text', text: '.' }],
      },
    ],
  } satisfies LegalDocument,
  accountDeletion: {
    title: 'Eliminar tu cuenta y tus datos',
    lastUpdated: '25 de septiembre de 2026',
    blocks: [
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'Esta página explica cómo solicitar la eliminación de tu cuenta de ' },
          { kind: 'strong', text: 'Sanatte' },
          {
            kind: 'text',
            text: ' ([RAZÓN SOCIAL]) y de los datos personales asociados, tanto en la aplicación móvil (iOS y Android) como en la web.',
          },
        ],
      },
      { kind: 'h2', text: 'Opción 1 — Desde la aplicación' },
      { kind: 'p', content: [{ kind: 'text', text: 'Si tienes la app instalada:' }] },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Abre la app e inicia sesión.' }],
          [
            { kind: 'text', text: 'Ve a ' },
            { kind: 'strong', text: 'Perfil → Ajustes → Eliminar cuenta' },
            { kind: 'text', text: '.' },
          ],
          [{ kind: 'text', text: 'Confirma la eliminación. Tu cuenta y datos se borrarán de forma permanente.' }],
        ],
      },
      { kind: 'h2', text: 'Opción 2 — Por correo' },
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'También puedes solicitar la eliminación escribiendo a ' },
          {
            kind: 'mail',
            text: CONTACT_EMAIL,
            href: `mailto:${CONTACT_EMAIL}?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta`,
          },
          {
            kind: 'text',
            text: ' desde el correo asociado a tu cuenta, con el asunto "Solicitud de eliminación de cuenta". Procesaremos tu solicitud en un plazo máximo de [X] días hábiles.',
          },
        ],
      },
      { kind: 'h2', text: 'Qué datos se eliminan' },
      { kind: 'p', content: [{ kind: 'text', text: 'Al eliminar tu cuenta borramos de forma permanente:' }] },
      {
        kind: 'ul',
        items: [
          [{ kind: 'text', text: 'Tu perfil (nombre, correo, foto de perfil).' }],
          [{ kind: 'text', text: 'Tu biblioteca, activaciones y actividad de uso.' }],
          [{ kind: 'text', text: 'Tus preferencias y datos de sesión.' }],
        ],
      },
      { kind: 'h2', text: 'Qué datos podemos conservar' },
      {
        kind: 'p',
        content: [
          {
            kind: 'text',
            text: 'Por obligaciones legales, contables o de seguridad (por ejemplo, registros de transacciones y facturación), podemos conservar cierta información durante el periodo exigido por la ley, de forma restringida y únicamente para esos fines.',
          },
        ],
      },
      { kind: 'h2', text: 'Contacto' },
      {
        kind: 'p',
        content: [
          { kind: 'text', text: 'Si tienes dudas sobre este proceso, escríbenos a ' },
          { kind: 'mail', text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { kind: 'text', text: '. Consulta también nuestra ' },
          { kind: 'route', text: 'Política de Privacidad', route: '/legal/privacidad' },
          { kind: 'text', text: '.' },
        ],
      },
    ],
  } satisfies LegalDocument,
} as const;
