# SANATTE — Plan de Refactorización Frontend (Angular)

> **Estado:** Fase 3 en progreso (Bloque Admin) — rama `feature/admin-flow`
> **Última actualización:** 2026-07-01
> **Stack confirmado:** Angular 21 · Standalone · Signals · RxJS · **Tailwind CSS** · SCSS · TypeScript
> **Datos:** 100% Mock. Sin HTTP real. Preparado para NestJS + Firebase.

---

## 1. Decisiones tomadas

| Tema | Decisión |
|------|----------|
| UI Framework | **Solo Tailwind** — fidelidad 1:1 con mockups de Stitch |
| Auth fase mock | **MockAuthService** + roles USER/ADMIN + dev-switcher flotante |
| Auth real (futuro) | **Firebase Auth** — instalado, pendiente credenciales |
| Estado | **Signals** (sin NgRx) |
| Datos | Mock con servicios intercambiables (preparado para NestJS) |
| Roles | USER / ADMIN — guardado en localStorage, switcher dev visible |
| Imágenes de producto | Array `ProductImage[]` con campo `isPrimary` |
| Envíos físicos | Modal con transportadora + guía + link de rastreo |
| **Arquitectura multi-tenant** | **Entitlements layer** — ecommerce core desacoplado del módulo de contenido |

---

## 1b. Visión Multi-Tenant ⭐

Este ecommerce está diseñado para ser **reutilizable en múltiples proyectos**. El principio central:

> **El ecommerce core nunca conoce el tipo de contenido digital del tenant.**

### Capas del sistema

```
┌──────────────────────────────────────────────────────────┐
│  ECOMMERCE CORE (domain-agnostic, reutilizable)           │
│  Product · Order · License · Activation · User            │
│                                                           │
│  Product.entitlements: Entitlement[]                      │
│    { id, type, referenceId, label }  ← 100% abstracto    │
└──────────────────────────────────────────────────────────┘
                    ↓ pluggable por tenant (sin tocar el core)
  ┌─────────────────────┐    ┌─────────────────────┐
  │  MÓDULO SANATTE      │    │  MÓDULO ACADEMIA     │
  │  Resource            │    │  Lesson              │
  │  (audio/video/pdf/   │    │  (partitura/video/   │
  │   artículo)          │    │   pista de práctica) │
  │  EntitlementService  │    │  EntitlementService  │
  │  → resuelve          │    │  → resuelve          │
  │    content_item=res  │    │    content_item=lesson│
  └─────────────────────┘    └─────────────────────┘
```

### Cómo agregar un nuevo tenant
1. Crear el módulo de contenido propio (`Lesson`, `DownloadLink`, etc.)
2. Implementar un `EntitlementService` que resuelva `content_item → TuModelo`
3. **Sin tocar** `Product`, `Order`, `License`, `Activation`

### EntitlementType (extensible sin breaking changes)
```ts
type EntitlementType =
  | 'content_item'       // Sanatte: audio, video, pdf, artículo
  | 'download'           // Software: archivo descargable
  | 'license_key'        // Software: clave de activación de software
  | 'qr_access'          // Físicos: acceso via escaneo QR
  | 'subscription_tier'; // Suscripciones: nivel de acceso
```

---

## 2. Arquitectura implementada

```
src/app/
├── core/
│   ├── guards/         mockAuthGuard · adminGuard · guestGuard
│   ├── interceptors/   authInterceptor (preparado, inactivo en mock)
│   ├── models/         User · Role
│   └── services/       MockAuthService · RoleService
│
├── shared/components/
│   ├── admin-page-header/   título + descripción + CTA (reutilizado en todas las páginas admin)
│   ├── confirm-dialog/      modal de confirmación danger/primary (reutilizado en todos los CRUDs)
│   ├── dev-role-switcher/   floater solo en dev
│   ├── pagination/          paginación con ellipsis inteligente
│   ├── search-input/        buscador reutilizable
│   └── status-badge/        badge con dot: active · inactive · blocked · published · draft · paid · shipped · cancelled
│
├── layouts/
│   ├── admin-layout/    sidebar colapsable (mobile hamburger) + topbar
│   ├── app-layout/      nav usuario autenticado
│   └── public-layout/   navbar público + footer
│
└── features/
    ├── administration/  (ver detalle en §3)
    ├── authentication/  login (funcional)
    ├── library/         placeholder
    ├── orders/          placeholder (app usuario)
    ├── profile/         placeholder
    ├── public/          home placeholder
    └── subscriptions/   placeholder
```

---

## 3. Bloque Admin — Estado detallado

### ✅ Pantallas completadas

| Pantalla | Ruta | Mockup | Componentes clave |
|---|---|---|---|
| **Dashboard** | `/admin/dashboard` | ✅ | KpiCard · GrowthChart · TopResources · RecentOrdersTable |
| **Productos** | `/admin/products` | ✅ | ProductTable (col-hiding) · ProductFormDialog (multi-imagen) · GenerateBatchDialog |
| **Detalle Producto** | `/admin/products/:id` | Adaptado | Galería interactiva · Recursos vinculados · Specs técnicas |
| **Recursos** | `/admin/resources` | ✅ | ResourceCard · ResourceFormDialog · tabs por tipo/tag |
| **Usuarios** | `/admin/users` | Sin mockup | UserTable (col-hiding) · toggle rol/estado · stats chips |
| **Pedidos** | `/admin/orders` | ✅ | OrderTable (col-hiding) · ShipOrderDialog (transportadora+guía) · KPIs |
| **Licencias** | `/admin/licenses` | ✅ | LicenseTable · GenerateBatchDialog · feed actividad · barras CSS |
| **Activaciones** | `/admin/activations` | ✅ | ActivationTable · análisis dispositivos · alertas seguridad |

### ❌ Pantallas pendientes (Admin)

| Pantalla | Ruta | Mockup |
|---|---|---|
| **Reportes** | `/admin/reports` | Pendiente |
| **Configuración** | `/admin/settings` | Pendiente |

---

## 4. Modelos de negocio implementados

| Modelo | Campos clave | Notas |
|---|---|---|
| `Product` | `images[]` (multi-imagen + isPrimary) · `tags[]` · `specs[]` · `resources[]` | Physical QR → `requiresActivation: true` |
| `Resource` | `type` (audio/video/pdf/article) · `tags[]` · `linkedProductIds[]` | Tags para filtro "Ejercicios" |
| `Order` | `paymentStatus` · `deliveryStatus` · `shippingCarrier` · `trackingNumber` · `trackingUrl` | Guía de envío en modal ShipOrder |
| `License` | `code` · `batchId` · `status` (available/active/revoked) · `orderId` | Trazabilidad hasta el pedido |
| `Activation` | `status` (success/pending/failed) · `ipAddress` · `device` · `resourcesUnlocked` | Log de eventos QR |
| `AdminUser` | `role` (USER/ADMIN) · `status` (active/blocked) · `hasActiveSubscription` | Gestión de roles en caliente |

### Regla de negocio clave (Plena)
```
Producto físico + QR → usuario debe autenticarse → activar con QR → accede a recursos digitales
```

---

## 5. Design System

- **Paleta "Serene Pulse"**: primary `#6b38d4` · surface `#f8f9ff` · on-surface `#121c2a`
- **Tipografía**: Manrope (headings) + Be Vietnam Pro (body)
- **Fuente iconos**: Material Symbols Outlined
- **glass-card**: `background: #fff; box-shadow: 0 10px 30px rgba(76,29,149,0.07); border: 1px solid rgba(203,195,215,0.4)`
- **Select**: flecha SVG custom (reemplaza nativa del navegador) via CSS global
- **Responsive**: Mobile-first, col-hiding en tablas admin (3 niveles: mobile/tablet/desktop)

---

## 6. Roadmap pendiente

### 🔹 Bloque Admin (en curso)
- [x] Dashboard
- [x] Productos + Detalle producto + Galería multi-imagen
- [x] Recursos
- [x] Usuarios
- [x] Pedidos + Guía de envío
- [x] Licencias + Generar lote
- [x] Activaciones
- [ ] **Reportes** ← siguiente
- [ ] Configuración

### 🔹 Bloque B — Autenticación
- [x] Login (funcional con MockAuth)
- [ ] Registro
- [ ] Recuperar contraseña

### 🔹 Bloque C — App Usuario
- [x] **Biblioteca** (home cliente: hero enfoque del día + progreso semanal + Mis Productos + estado vacío)
- [x] **Detalle recurso** (visor con playlist del producto + 4 visores compartidos por tipo + estado "sin recursos")
- [x] **Mis pedidos + detalle** (lista con búsqueda/filtros por tipo + detalle con envío físico/acceso digital)
- [x] **Perfil** (datos personales + seguridad + preferencias de correo/newsletter + gestión de datos)
- [x] **Suscripciones** (plan actual + método de pago + facturación + planes disponibles + cancelar/reactivar/cambiar) ✅ Bloque C completo

### 🔹 Bloque D — Sitio Público
- [ ] Home
- [x] **Catálogo público** (grid + búsqueda + filtros por tipo) + **Detalle producto** (galería, compra, highlights, specs, reseñas)
- [ ] Carrito / Checkout (checkout exige cuenta) ← siguiente
- [ ] Blog · FAQ · Contacto

**Decisión negocio:** navegar/carrito = público; la cuenta se exige en el **checkout** (todo lo vendido se entrega vía cuenta: activación QR, biblioteca, suscripción).

### 🔹 Fase 4 — Navegación completa
- [ ] Flujo público → auth → app usuario
- [ ] Flujo admin completo
- [ ] Estados vacío / loading / error en todas las pantallas

### 🔹 Fase 5 — Firebase + NestJS
- [ ] Integrar Firebase Auth (ya instalado, pendiente credenciales)
- [ ] Reemplazar Mock services por HTTP services (1 provider por dominio)

---

## 7. Reglas de calidad
- Componentes pequeños, responsabilidad única
- Lógica de negocio en servicios, nunca en componentes
- `ConfirmDialog` reutilizable en todos los CRUDs (no `window.confirm`)
- `AdminPageHeader` en todas las páginas admin
- `StatusBadge` para todos los estados
- `Pagination` con ellipsis inteligente
- Column hiding en tablas: mobile (esencial) → tablet (+medio) → desktop (completo)
- Responsive: mobile-first, sidebar colapsable, dialogs full-screen en móvil

---

## 8. Bitácora de avance

| Fecha | Cambio |
|-------|--------|
| 2026-06-30 | Plan creado. Decisiones: Tailwind + eliminar `emotions`. |
| 2026-06-30 | Fase 1: Estructura limpia, 3 layouts, guards, MockAuthService, rutas, dev-switcher. |
| 2026-07-01 | Fase 2: Design system "Serene Pulse" — tokens Tailwind, fuentes, glass-card, select custom. |
| 2026-07-01 | Fase 3 Admin: Dashboard · Productos · Recursos · Usuarios · Pedidos · Licencias · Activaciones. |
| 2026-07-01 | Extras: Detalle producto con galería multi-imagen · ShipOrderDialog con transportadora/guía · Select arrows CSS global · Responsive mobile-first (sidebar hamburger, col-hiding tables, dialogs full-screen). |
| 2026-07-01 | Arquitectura multi-tenant: capa Entitlements (ecommerce core desacoplado del módulo de contenido). Gestión de recursos↔producto editable en form y detalle. |
| 2026-07-02 | Bloque C: **Biblioteca del cliente** (Library 1). Shared `CircularProgress`. Componentes `DailyFocusCard`/`WeeklyProgressCard`/`OwnedProductCard`. `UserLibraryService` (progreso mock). AppLayout alineado con AdminLayout (sidebar + hamburger + título dinámico). |
| 2026-07-02 | Bloque C: **Visor de recurso** (`/app/library/:productId/:resourceId`) con playlist del producto y estado "sin recursos". **Consolidación anti-duplicación:** 4 visores por tipo → `shared/components/resource-viewers/` (usados por visor usuario Y modal admin); `RESOURCE_TYPE_META` única en `resource.model` (eliminó 5 mapeos duplicados de icono/label). |
| 2026-07-02 | Bloque C: **Mis Pedidos** (`/app/orders`) lista con búsqueda + filtros (Todos/En proceso/Enviado/Entregado/Activo) y **detalle** (`/app/orders/:id`) con bloque de envío para físicos y botón "Acceder" al visor para digitales/suscripción. `UserOrdersService` (subset del usuario). **Validación negocio:** filtros/estados adaptados para cubrir físico + digital + suscripción (el mockup solo contemplaba físico). `DELIVERY_STATUS_META` única en `order.model` (refactor del admin `order-table`, sin duplicar). |
| 2026-07-02 | Bloque C: **Perfil** (`/app/profile`) con datos personales, seguridad (password + 2FA) y **preferencias de correo/newsletter** (opt-in/opt-out). `UserProfileService` (persistencia localStorage, swappable a backend). **Validación negocio:** notificaciones push del mockup → newsletter por correo (web sin push hoy); biometría/Touch ID eliminada (solo móvil). |
| 2026-07-02 | Bloque C: **Suscripciones** (`/app/subscriptions`) — plan actual, método de pago, facturación y planes disponibles (cambiar/cancelar/reactivar). `UserSubscriptionService` (mock, swappable a Mercado Pago). Cancelación estilo SaaS (fin de periodo). Reusa `ConfirmDialog`/`EntitlementService`. **✅ Bloque C — App Usuario completo.** |
