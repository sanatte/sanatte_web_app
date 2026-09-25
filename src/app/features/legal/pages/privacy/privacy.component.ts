import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalPageComponent } from '../../legal-page.component';

/**
 * Política de Privacidad — URL pública requerida por App Store y Play Store.
 *
 * ⚠️ PENDIENTE DE REVISIÓN LEGAL. Reemplazar los placeholders entre [corchetes]
 * con los datos reales de la empresa antes de publicar en las tiendas.
 */
@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalPageComponent, RouterLink],
  template: `
    <app-legal-page title="Política de Privacidad" lastUpdated="25 de septiembre de 2026">

      <p>
        En <strong>Sanatte</strong> ([RAZÓN SOCIAL], NIT [NIT]) valoramos tu privacidad.
        Esta política explica qué datos personales recopilamos, con qué finalidad, con
        quién los compartimos y cómo puedes ejercer tus derechos, en cumplimiento de la
        Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.
      </p>
      <p>
        Aplica a nuestro sitio web, la aplicación móvil Sanatte (iOS y Android) y los
        servicios asociados (en conjunto, la "Plataforma").
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        [RAZÓN SOCIAL], con domicilio en [DIRECCIÓN], es responsable del tratamiento de
        tus datos personales. Para cualquier solicitud puedes escribirnos a
        <a href="mailto:[correo-contacto]">[correo-contacto]</a>.
      </p>

      <h2>2. Datos que recopilamos</h2>
      <ul>
        <li><strong>Datos de cuenta:</strong> nombre, correo electrónico y, si registras con Google o Apple, el identificador de esos proveedores.</li>
        <li><strong>Foto de perfil:</strong> si decides subir un avatar.</li>
        <li><strong>Datos de uso y actividad:</strong> productos activados, recursos consultados, fechas de activación y dispositivo (web, iOS, Android).</li>
        <li><strong>Datos de compra:</strong> pedidos y estado de pago (el procesamiento de pagos lo realiza Mercado Pago; no almacenamos los datos completos de tu tarjeta).</li>
        <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo e identificadores para seguridad y funcionamiento.</li>
      </ul>

      <h2>3. Finalidades del tratamiento</h2>
      <ul>
        <li>Crear y gestionar tu cuenta y autenticación.</li>
        <li>Activar productos mediante código QR y darte acceso a tu biblioteca digital.</li>
        <li>Procesar compras y suscripciones.</li>
        <li>Enviar notificaciones relacionadas con el servicio.</li>
        <li>Mejorar la Plataforma y garantizar su seguridad.</li>
      </ul>

      <h2>4. Terceros y encargados</h2>
      <p>Compartimos datos, solo lo necesario, con proveedores que nos prestan servicios:</p>
      <ul>
        <li><strong>Google Firebase</strong> — autenticación y almacenamiento (Google LLC).</li>
        <li><strong>Mercado Pago</strong> — procesamiento de pagos.</li>
        <li><strong>Cloudflare R2</strong> — almacenamiento y entrega de contenido multimedia.</li>
      </ul>
      <p>Estos proveedores pueden tratar datos fuera de Colombia bajo sus propias políticas y garantías de seguridad.</p>

      <h2>5. Conservación de los datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa y durante el tiempo
        necesario para cumplir obligaciones legales, contables o de seguridad. Cuando
        eliminas tu cuenta, borramos o anonimizamos tus datos personales salvo aquellos
        que debamos retener por ley.
      </p>

      <h2>6. Tus derechos</h2>
      <p>Como titular puedes, en cualquier momento:</p>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
      </ul>
      <p>
        Para eliminar tu cuenta y tus datos, consulta nuestra
        <a routerLink="/legal/eliminar-cuenta">página de eliminación de cuenta</a>.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y administrativas razonables para proteger tus datos
        contra acceso no autorizado, pérdida o alteración. La comunicación con nuestros
        servidores se realiza cifrada mediante HTTPS.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        La Plataforma no está dirigida a menores de edad sin autorización de sus padres
        o tutores. Si detectamos datos de un menor sin dicha autorización, procederemos
        a eliminarlos.
      </p>

      <h2>9. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política. Publicaremos la versión vigente en esta página
        con su fecha de "última actualización".
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos a
        <a href="mailto:[correo-contacto]">[correo-contacto]</a>.
      </p>

    </app-legal-page>
  `,
})
export class PrivacyComponent {}
