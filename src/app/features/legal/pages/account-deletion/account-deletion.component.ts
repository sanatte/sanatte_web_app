import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalPageComponent } from '../../legal-page.component';

/**
 * Eliminación de cuenta y datos — URL pública requerida por Google Play
 * (Data Safety form) para apps que permiten crear cuenta. También la referencia
 * la Política de Privacidad. Debe mencionar el nombre de la app/desarrollador,
 * ser accesible sin login y describir claramente la ruta de solicitud de borrado.
 *
 * ⚠️ PENDIENTE DE REVISIÓN LEGAL. Reemplazar placeholders entre [corchetes].
 */
@Component({
  selector: 'app-account-deletion',
  standalone: true,
  imports: [LegalPageComponent, RouterLink],
  template: `
    <app-legal-page title="Eliminar tu cuenta y tus datos" lastUpdated="25 de septiembre de 2026">

      <p>
        Esta página explica cómo solicitar la eliminación de tu cuenta de
        <strong>Sanatte</strong> ([RAZÓN SOCIAL]) y de los datos personales asociados,
        tanto en la aplicación móvil (iOS y Android) como en la web.
      </p>

      <h2>Opción 1 — Desde la aplicación</h2>
      <p>Si tienes la app instalada:</p>
      <ul>
        <li>Abre la app e inicia sesión.</li>
        <li>Ve a <strong>Perfil → Ajustes → Eliminar cuenta</strong>.</li>
        <li>Confirma la eliminación. Tu cuenta y datos se borrarán de forma permanente.</li>
      </ul>

      <h2>Opción 2 — Por correo</h2>
      <p>
        También puedes solicitar la eliminación escribiendo a
        <a href="mailto:[correo-contacto]?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta">[correo-contacto]</a>
        desde el correo asociado a tu cuenta, con el asunto
        "Solicitud de eliminación de cuenta". Procesaremos tu solicitud en un plazo
        máximo de [X] días hábiles.
      </p>

      <h2>Qué datos se eliminan</h2>
      <p>Al eliminar tu cuenta borramos de forma permanente:</p>
      <ul>
        <li>Tu perfil (nombre, correo, foto de perfil).</li>
        <li>Tu biblioteca, activaciones y actividad de uso.</li>
        <li>Tus preferencias y datos de sesión.</li>
      </ul>

      <h2>Qué datos podemos conservar</h2>
      <p>
        Por obligaciones legales, contables o de seguridad (por ejemplo, registros de
        transacciones y facturación), podemos conservar cierta información durante el
        periodo exigido por la ley, de forma restringida y únicamente para esos fines.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes dudas sobre este proceso, escríbenos a
        <a href="mailto:[correo-contacto]">[correo-contacto]</a>. Consulta también nuestra
        <a routerLink="/legal/privacidad">Política de Privacidad</a>.
      </p>

    </app-legal-page>
  `,
})
export class AccountDeletionComponent {}
