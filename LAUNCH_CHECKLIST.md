# Sanatte — Checklist de lanzamiento y pendientes

Estado consolidado del MVP: qué falta para **lanzar a vender** y qué queda del plan.
Es el índice único de pendientes; los planes detallados viven en otros archivos
(ver [Referencias](#referencias)).

---

## 🚦 Bloqueadores de lanzamiento (web)

La web ya es funcional para vender (landing, tienda, checkout MP, admin, auth).
Lo que falta para lanzar **no son features, es configuración/contenido**:

| # | Bloqueador | Dónde se resuelve | Estado |
|---|---|---|---|
| 0 | **Habilitar Firebase Storage** (no hay bucket → toda subida de imagen falla) | Firebase Console → Build → Storage → Comenzar. Ver `FIREBASE_AUTH_SETUP.md` §3 | ⏳ config |
| 1 | **Foto real de Plena** en el hero de la landing (requiere #0) | Admin → Productos → Plena → subir imagen (principal) | ⏳ |
| 2 | **URL de acción de Firebase** (para que verificar correo y restablecer contraseña funcionen) | Firebase Console → Auth → Templates. Ver `FIREBASE_AUTH_SETUP.md` §1 | ⏳ config |
| 3 | **Correos fuera de Spam** (SPF/DKIM/DMARC o proveedor dedicado) | DNS de `sanatte.com`. Ver `FIREBASE_AUTH_SETUP.md` §2 | ⏳ config |
| 4 | **Credenciales de Mercado Pago de producción** (no las de test) | Variables en Coolify (`MercadoPago:AccessToken`) | ⏳ verificar |
| 5 | **Deploy de la web en dominio de producción** (`sanatte.com`; hoy solo `dev.sanatte.com`) | Coolify / DNS | ⏳ |

---

## 📱 Plan MVP (app Flutter)

Detalle en `sanatte_app/MVP_PLAN.md`.

| Fase | Descripción | Estado |
|---|---|---|
| F1 | Fundación (API real + auth + perfil) | ✅ |
| F2 | Biblioteca + escáner QR | ✅ |
| F3 | Tienda + checkout Mercado Pago | ✅ |
| **F4** | **Push notifications (FCM)** — retención | ⏳ pendiente |

**F4 no es bloqueador de lanzamiento** (es retención). Requiere:
- App: `firebase_messaging` + `flutter_local_notifications`.
- Backend: `POST /api/me/devices` (registrar token) + envío FCM (Admin SDK ya integrado).

---

## 🔮 Fuera del MVP (plan futuro, web + móvil)

### Streaming de recursos (audio/video)

**Hoy:** los recursos son **solo metadatos** (título, tipo, duración, thumbnail).
No hay archivo de media almacenado ni servido → el reproductor muestra
"disponible pronto" en web y app.

**Qué falta y cómo abordarlo:**
- **Almacenar** el archivo de audio/video (Firebase Storage / R2 / S3).
- **Servirlo con acceso protegido** — este es el punto clave, no el protocolo:
  - Audio y video corto/medio (meditaciones) → **HTTP Range requests** + **URL firmada
    de corta duración** validando propiedad. Eso ya es "streaming" en la práctica.
  - Video largo con calidad adaptable → **HLS/DASH** (transcodificación a segmentos).
    Solo si se necesita; **no** para el MVP.
- ⚠️ A diferencia de las imágenes de producto (públicas), la media **no puede ser
  pública** (evitar compartir/piratear). Va con **URL firmada** o endpoint autenticado.
- El endpoint `GET /api/me/resources/{slug}` **ya valida propiedad** → extenderlo para
  devolver la URL firmada del archivo en vez de solo metadatos.

### Suscripciones (Mercado Pago Preapproval)
- Hoy solo se venden productos Físico/Digital (pago único, Checkout Pro).
- Suscripción recurrente (Preapproval) → botón "disponible pronto". Pendiente si se
  quiere el flujo de suscripción completo.

---

## ✅ Hecho recientemente (contexto)

- Almacenamiento de imágenes en Firebase Storage (productos, recursos, avatares) — web, API y Flutter.
- Handler de enlaces de correo de Firebase (`/auth/action`) — falta la config de consola (bloqueador #2).
- Fixes admin: crear/eliminar producto con manejo de errores, validaciones, imagen obligatoria.
- Hero de la landing resiliente (ya no depende de un SKU fijo).
- Setup de desarrollo con proxy `/api` (ver `README.md`).

---

## Referencias

- `sanatte_web_app/FIREBASE_AUTH_SETUP.md` — config de URL de acción y anti-spam (bloqueadores #2 y #3).
- `sanatte_app/MVP_PLAN.md` — plan detallado de la app Flutter (fases F1–F4).
- `sanatte-api/BACKEND_PLAN.md` — plan del backend.
- `sanatte_web_app/README.md` — cómo levantar en desarrollo (proxy local/dev).
