# Sanatte Web (Angular)

Frontend del ecosistema **Sanatte**: landing + tienda + área de cliente
(biblioteca, activación por QR, pedidos, perfil) + panel de administración.
Todo en una sola app Angular.

- **Framework:** Angular 21 (standalone components, signals)
- **Auth:** Firebase Auth (email/contraseña, Google, Apple)
- **Backend:** [Sanatte API (.NET)](../sanatte-api) por REST

## Requisitos

- Node.js 20+ y npm
- La **API .NET corriendo** (el frontend no funciona sin ella: sin backend no hay sesión válida)

## Instalación

```bash
cd sanatte_web_app
npm ci        # o: npm install
```

## Configuración

Los valores viven en `src/environments/`:

| Clave | Dev (`environment.ts`) | Prod (`environment.production.ts`) |
|---|---|---|
| `apiUrl` | `/api` (relativo → proxy) | `https://api-dev.sanatte.com/api` |
| `publicBaseUrl` | `https://sanatte.com` | `https://dev.sanatte.com` |
| `firebase` | config web del proyecto `sanatte-d819d` | idem |

- **`apiUrl`**: dónde está la API .NET. En dev es **relativo** (`/api`): el dev
  server de Angular lo proxya (ver **Arrancar en desarrollo**). Así se evita CORS
  y cambiar de backend es solo editar `proxy.conf.json`.
- **`publicBaseUrl`**: dominio público de la app; se usa para generar los **QR de recursos** (`{publicBaseUrl}/r/{slug}`). Apunta siempre al dominio de producción porque los QR se imprimen.
- **`firebase`**: la config web de Firebase es **pública** (apiKey del cliente) y ya está versionada. Se obtiene en Firebase Console → ⚙️ Configuración del proyecto → *Tus apps* → app web.

> No hay secretos en este repo. Los tokens de acceso los emite Firebase en el navegador; el backend solo los valida.

## Arrancar en desarrollo

```bash
npm start          # ng serve → http://localhost:4200
```

El dev server **proxya `/api`** al backend definido en **`proxy.conf.json`**
(`ng serve` lo toma automáticamente). Como el navegador solo habla con
`localhost:4200`, **no hay CORS**. Hay dos modos — solo cambia `target` en
`proxy.conf.json`:

| Modo | `target` en `proxy.conf.json` | Cuándo |
|---|---|---|
| **API publicada** (por defecto) | `https://api-dev.sanatte.com` | Trabajar solo en frontend, contra datos dev reales |
| **API local** | `http://localhost:5129` | Tocar el backend (requiere la API .NET corriendo) |

> Si el backend está caído, la app no deja iniciar sesión (muestra
> "No pudimos conectar con el servidor").

## Build de producción

```bash
npm run build      # salida: dist/sanatte_frontend/browser
```

## Autenticación y roles

- **Clientes:** se registran solos (email con verificación de correo, o Google/Apple).
- **Administradores:** NO se auto-registran; se crean desde el panel (*Usuarios → Crear administrador*). Un admin inicia sesión y cae en `/admin/dashboard`; desde el área de cliente puede volver con el enlace **"Panel de administración"** del menú de cuenta.
- El rol lo entrega el backend (`GET /api/users/me`) al iniciar sesión.

**Firebase (producción):** agrega el dominio `sanatte.com` en Firebase Console →
Authentication → Settings → *Authorized domains* para que el login con Google/Apple funcione.

## Códigos QR de recursos

Los recursos (audios de Plena, etc.) tienen un **slug** editable en su formulario.
El botón **"Descargar QR"** en *Recursos* genera un PNG que apunta a
`https://sanatte.com/r/{slug}`. Al escanearlo pide sesión y que el usuario tenga el
producto activado (p. ej. Plena).

## Despliegue (Docker / Coolify)

Incluye `Dockerfile` (build Angular → Nginx) y `nginx.conf` con **fallback SPA**
(`try_files → index.html`), necesario para que las rutas profundas (QR `/r/:slug`,
recargar `/app/...`, links directos) funcionen al abrir en frío.

En Coolify:
1. Build Pack: **Dockerfile** · Ports Exposes: **80** · Domain: `https://sanatte.com`
2. No requiere variables de entorno (la config va compilada en el bundle).

## Comandos útiles

```bash
npm start            # servidor de desarrollo (http://localhost:4200)
npm run build        # build de producción
npx ng generate ...  # scaffolding de Angular
```
