# AGENTS.md — sanatte_web_app (Angular 21)

Web de Sanatte. Incluye landing y tienda pública, el área de cliente (`/app`: biblioteca, activación por QR, pedidos, emociones, perfil) y el panel de administración (`/admin`).

- Backend: API .NET en `../sanatte-api`
- Auth: Firebase (proyecto `sanatte-d819d`)
- Diseño: tokens de `../sanatte-design-tokens` y maquetas en `../stich/`

## Comandos

```bash
npm install
npm start          # ng serve en :4200 con proxy.conf.json (/api → http://localhost:5129)
npm run build      # build de producción → dist/sanatte_frontend/browser
npx tsc -p tsconfig.app.json --noEmit    # chequeo rápido de tipos
```

- Antes de terminar una tarea, `npm run build` debe pasar **sin errores ni warnings de budget** (el bundle inicial avisa a los 600 kB y los estilos de cada componente a los 4 kB).
- **Los tests no funcionan todavía:** no hay target `test` en `angular.json` ni runner instalado. Los schematics usan `skipTests: true`. Si se pide agregar tests, usa Vitest (`tsconfig.spec.json` ya declara `vitest/globals`).
- Sin el backend no hay sesión válida. Para usar la API publicada, cambia el `target` de `proxy.conf.json` a `https://api-dev.sanatte.com`, pero no hagas commit de ese cambio salvo que se pida.

## Stack

- Angular 21 **standalone** (no hay NgModules), builder esbuild y ejecución zoneless (no hay `zone.js`)
- Signals para el estado. No se usa NgRx y **no** debe introducirse.
- Tailwind CSS **v3** con tokens de diseño; SCSS solo en `styles.scss`
- SDK modular de `firebase`. `@angular/fire` está instalado pero **no se usa**.
- Librerías: chart.js, quill, plyr, wavesurfer.js, pdfjs-dist, qrcode, jspdf y html2canvas
- TypeScript estricto: `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature` y `noImplicitReturns`

No agregues dependencias sin que se pida explícitamente.

## Estructura (`src/app`)

```
core/        guards/ interceptors/ services/auth.service.ts models/ i18n/
shared/      components/ directives/ pipes/ services/ utils/theme-color.ts
layouts/     admin-layout/ app-layout/ public-layout/
features/<feature>/
  pages/ components/ services/ models/ <feature>.routes.ts
```

- Features: activation, administration, allies, authentication, legal, library, moods, orders, profile, public, resource-viewer, subscriptions, welcome.
- Archivos en kebab-case con sufijo de tipo: `*.component.ts`, `*.service.ts`, `*.guard.ts`, `*.routes.ts`, `*.model.ts`, `*.texts.ts`. Selector con prefijo `app-`. Las páginas de admin llevan el prefijo `Admin` (`AdminProductsComponent`).
- Todo es lazy: `loadComponent` para páginas y layouts, y `loadChildren` para los arrays `Routes` exportados en camelCase (`libraryRoutes`). Cada ruta nueva se registra en `app.routes.ts`, en la sección que le corresponda.

## Patrones Angular

Los componentes siguen esta forma:

```ts
@Component({
  selector: 'app-status-badge',
  imports: [...],
  template: `...`,                 // inline si es corto; templateUrl si es una página o diálogo grande
})
export class StatusBadgeComponent {
  private readonly productService = inject(ProductService);
  readonly status = input.required<string>();
  readonly label  = input('');
  readonly changed = output<string>();
  readonly config = computed(() => STATUS_MAP[this.status().toLowerCase()] ?? FALLBACK);
  protected readonly t = TEXTS.admin.products;
}
```

- **No** pongas `standalone: true`: ya es el valor por defecto.
- DI siempre con `inject()` en campos `private readonly`. No uses inyección por constructor. El constructor queda solo para `effect()` o suscripciones con `takeUntilDestroyed()`.
- Usa `input()`, `input.required()`, `output()`, `viewChild()` y `computed()`, nunca los decoradores `@Input`/`@Output`/`@ViewChild`. Para eventos del host usa `host: {}`, no `@HostListener`.
- Control flow nativo (`@if`, `@for (x of list(); track x.id)`, `@switch`, `@defer`, `@let`), sin `*ngIf`/`*ngFor`. Clases y estilos con `[class.x]`/`[class]`/`[style.x]`, no `NgClass`/`NgStyle`.
- Usa `ChangeDetectionStrategy.OnPush` en componentes nuevos. Hoy no se usa, pero es coherente con la app zoneless basada en signals.
- Componentes pequeños con una sola responsabilidad. **La lógica de negocio va en services, nunca en componentes.**
- Guards e interceptors funcionales (`CanActivateFn`, `HttpInterceptorFn`) que hacen `await auth.whenReady()` y redirigen devolviendo `router.createUrlTree(...)`.

## Services, HTTP y estado

```ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(this.base));
      this._products.set(raw.map(mapApiProduct));
    } finally {
      this._loading.set(false);
    }
  }
}
```

- Las APIs de los services son **basadas en Promise**: `await firstValueFrom(...)`. El estado se guarda en un signal privado y se expone como `asReadonly()`/`computed()`. Las mutaciones actualizan el estado local con `signal.update(...)`.
- La URL base sale de `environment.apiUrl`. No escribas URLs a mano.
- **Mapeo con la API:** la API .NET envía los enums como **int**, y el front usa uniones de string. Toda conversión va en `features/administration/services/api-mappers.ts` (`TYPE_MAP`, `*_TO_INT`, `mapApiX`, `toApiXBody`). Si cambia un DTO en `sanatte-api`, actualiza el mapper.
- La paginación usa `PagedResult<T>` (`items`, `page`, `pageSize`, `totalItems`) con `HttpParams`.
- `authInterceptor` agrega `Authorization: Bearer <idToken>` en las URLs que contienen `/api/`.
- Las claves de localStorage llevan el prefijo `sanatte_`.
- Evita `any`: tipa las respuestas con interfaces del modelo.

## Formularios

- Formularios reactivos con `fb.nonNullable.group({...})` y `Validators`. Si el submit es inválido, llama a `markAllAsTouched()`. Para cargar datos desde un input, usa `patchValue` dentro de un `effect()`.
- Diálogos: reciben los inputs `isOpen`/`saving`/`errorMessage` y emiten los outputs `save`/`cancel`. La página que los abre guarda en signals `isModalOpen`, `editingX` y `saveError`.
- **Nunca** uses `alert()`/`window.confirm`: usa `ConfirmDialog`.

## Auth

- `core/services/auth.service.ts` usa el SDK modular de Firebase. Expone los signals `currentUser`, `isAuthenticated`, `role`, `isAdmin` y `emailVerified`, y la promesa `whenReady()`.
- El rol sale del backend (`GET /api/users/me`), no del token.
- Los emails de verificación y de reset los envía el backend. `/auth/action` maneja `mode` y `oobCode`.
- Guards:
  - `mockAuthGuard`: pese al nombre, es la autenticación real
  - `adminGuard`: protege `/admin`
  - `clientShellGuard`: protege `/app`
  - `guestGuard`: para pantallas de invitado
- Los administradores no se registran solos; se crean desde el panel.

## Estilos y design tokens

- **Nunca edites `tailwind.tokens.js` ni `src/styles/tokens.css`.** Se generan con `npm run tokens` en `../sanatte-design-tokens`.
- Usa las clases de rol del tema: `bg-primary`, `text-on-surface`, `bg-surface-container-low`, `text-on-surface-variant`, `border-outline-variant`, `bg-error-container`, y las escalas `brand-*`/`foil`. Las opacidades funcionan (`bg-primary/10`).
- **Sin colores hex ni de la paleta por defecto de Tailwind** (`emerald-*`, `green-*`, `amber-*`...). Usa `success`, `warning`, `info` y `error` con sus `-container`.
- Si una librería necesita un string de color (chart.js, wavesurfer, qrcode), usa `themeHex('primary')`/`themeRgba(role, alpha)` de `shared/utils/theme-color.ts`.
- Para tipografía, radios, sombras y espaciado usa las utilidades de `tailwind.config.js`:
  - `font-heading`
  - `text-headline-lg`, `text-body-md`, `text-label-sm`
  - `shadow-card`, `shadow-modal`
  - `gap-gutter`
- Iconos: `<span class="material-symbols-outlined">name</span>`.
- Solo Tailwind en los templates: nada de `.scss` por componente. Los estilos globales van en `src/styles.scss` (`@layer components`).
- Diseño mobile-first. En las tablas de admin, las columnas se ocultan en tres niveles (móvil, tablet y escritorio), y los diálogos ocupan toda la pantalla en móvil.
- Las maquetas de `../stich/admin|user/*/screen.png` son la referencia de layout. Los colores **siempre** salen de los tokens; parte del `code.html` de Stitch usa una paleta vieja.
- Componentes compartidos obligatorios:
  - `AdminPageHeader` en cada página de admin
  - `StatusBadge` para cualquier estado
  - `Pagination` para listas paginadas
  - `SearchInput` para búsquedas
  - `ConfirmDialog` para confirmaciones

## Textos, idioma y moneda

- La UI está en **español (es-CO)** y no se usa `$localize`. **No hay textos hardcodeados en los templates.** Todos van en `core/i18n/es/<area>/<feature>.texts.ts`, reexportados desde el `index.ts` del área y agregados en `TEXTS` (`core/i18n/texts.ts`).
  ```ts
  export const PRODUCTS_TEXTS = {
    title: 'Productos',
    found: (count: number) => `${count} producto${plural(count)}`,
  } as const;
  ```
  En el componente se accede con `protected readonly t = TEXTS.admin.products;`. Los mapas de etiquetas de enums usan `satisfies Record<ProductType, string>`.
- La moneda es **solo COP**. En los templates usa el pipe `| money` (que usa `CurrencyService`), nunca `| currency`.
- Identificadores en inglés. Comentarios y documentación en español.

## Formato

Prettier con `printWidth: 100` y `singleQuote: true` (parser `angular` para el HTML), 2 espacios y salto de línea al final del archivo. Formatea los archivos que toques.

## Entornos y despliegue

- `environment.ts` define `apiUrl: '/api'` (vía proxy) y `publicBaseUrl` (base de los QR: `https://sanatte.com/r/{slug}`). `environment.production.ts` entra con `fileReplacements`.
- La configuración de Firebase es pública y está versionada. No agregues secretos al front.
- Docker multi-stage: build con Node 20 y servido con nginx, con fallback SPA a `index.html` y assets hasheados cacheados un año. Se despliega con Coolify.
- `public/.well-known/` contiene `apple-app-site-association` y `assetlinks.json` (deep links de la app). No los borres.

## Git

- Ramas `develop`, `feature/*` y `fix/*`, con PR hacia `develop`.
- Commits en Conventional Commits, con scope y descripción en español: `feat(admin,i18n): ...`, `fix(login): ...`.

## Notas

- `docs/REFACTOR_PLAN.md` contiene las decisiones y reglas de negocio, pero su paleta "Serene Pulse" está desactualizada: la vigente es **Indigo Luxury**, la de los tokens.
- Deuda conocida:
  - `app.html` sin uso
  - un `*ngFor` en `activation-card`
  - dos `@ViewChild`
  - `alert()` en admin-resources, admin-users y admin-orders
  - `features/administration/mocks/` sin uso
  - `environment.production.ts` apunta a dev

  Si tocas alguno de esos archivos, corrígelo según estas reglas.
