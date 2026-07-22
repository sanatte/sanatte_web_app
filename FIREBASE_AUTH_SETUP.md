# Configuración de Firebase Auth — correos y enlaces

Guía para el equipo. Cubre dos cosas que **requieren configuración en consola/DNS**
(no se resuelven solo con código):

1. **Enlaces de correo** (verificar cuenta / restablecer contraseña) → apuntar a nuestro dominio.
2. **Correos que caen a Spam** → autenticar el dominio de envío.

Proyecto Firebase: **`sanatte-d819d`**

---

## 1. URL de acción — hacer que los enlaces de correo funcionen

Firebase manda TODOS los enlaces de correo (verificar correo, restablecer
contraseña, recuperar correo) a **una sola URL de acción**. El código ya tiene el
handler que la procesa:

- Ruta Angular: **`/auth/action`** → `AuthActionComponent`
- Lee `mode` + `oobCode` y despacha:
  - `resetPassword` → `/auth/reset` (formulario de nueva contraseña)
  - `verifyEmail` → `/auth/verified` (aplica el código y confirma)
  - inválido/expirado → pantalla "Enlace no válido"

### Qué configurar (una sola vez)

**Firebase Console → Authentication → Templates** (Plantillas de correo)
→ en cualquier plantilla, ícono de lápiz ✏️ → **Personalizar URL de acción**:

```
https://sanatte.com/auth/action
```

> ⚠️ Hoy los enlaces apuntan a `https://www.sanatte.com/__/auth/action`, que la app
> **no** maneja → por eso los enlaces "no hacen nada". Al cambiar la URL de acción
> al valor de arriba, empiezan a funcionar.

### Requisito de dominio autorizado

**Authentication → Settings → Authorized domains**: debe incluir `sanatte.com`
(y `dev.sanatte.com` si aplica). Si no, Firebase rechaza el `oobCode`.

### Prueba rápida

1. Registrar un usuario nuevo o pedir "restablecer contraseña".
2. Abrir el correo → el enlace debe ir a `sanatte.com/auth/action?mode=...&oobCode=...`.
3. Debe redirigir a la pantalla correcta y completar la acción.
4. Probar también **abriendo el enlace en otro navegador** (sin sesión): debe
   funcionar igual — el handler usa `applyActionCode`, que no depende de la sesión local.

---

## 2. Correos a Spam — autenticar el dominio de envío

Los correos de Firebase Auth salen por defecto desde `noreply@sanatte-d819d.firebaseapp.com`.
Ese dominio **no está autenticado con nuestros DNS**, así que Gmail/Outlook los marcan
como spam. Hay dos niveles de solución:

### Opción A — Dominio y SMTP personalizados en Firebase (rápido)

**Authentication → Templates → Personalizar dominio** (o SMTP):
- Configurar el remitente a un correo de `@sanatte.com`.
- Agregar en el DNS de `sanatte.com` los registros que Firebase indique:
  - **SPF** (TXT): autoriza a Firebase/Google a enviar por el dominio.
  - **DKIM** (TXT): firma criptográfica de los correos.
  - **DMARC** (TXT): política de qué hacer con correos no autenticados.

Con SPF + DKIM + DMARC bien puestos, los correos dejan de caer en spam.

### Opción B — Proveedor de correo dedicado (lo más profesional)

Para producción seria, sacar los correos transaccionales de Firebase y enviarlos
por un proveedor con reputación de entrega — **Resend**, **Amazon SES** o **SendGrid**:

- Se verifica el dominio `sanatte.com` en el proveedor (SPF/DKIM/DMARC).
- Firebase permite **SMTP personalizado** apuntando al proveedor, o se generan los
  enlaces con el Admin SDK y se envían con plantillas propias.
- Ventaja: entregabilidad, plantillas con marca Sanatte, métricas de apertura/rebote.

> Recomendación: empezar con **Opción A** para salir de spam ya, y migrar a
> **Opción B (Resend)** cuando se quiera control total de las plantillas y métricas.

---

## Checklist

- [ ] URL de acción = `https://sanatte.com/auth/action` (Templates)
- [ ] `sanatte.com` en Authorized domains
- [ ] SPF + DKIM + DMARC en el DNS de `sanatte.com`
- [ ] Remitente personalizado `@sanatte.com` (Opción A) o proveedor dedicado (Opción B)
- [ ] Probado: verificar correo + restablecer contraseña, incluido en otro navegador
