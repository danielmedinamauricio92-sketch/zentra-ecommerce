# Zentra — Frontend

Frontend de Zentra, e-commerce de calzado urbano. Aplicación Next.js 16
(App Router) con React 19, TypeScript y Tailwind CSS 4.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- React Compiler (activado en `next.config.ts`)

## Desarrollo

```bash
cp .env.example .env.local   # ver variables abajo
npm ci
npm run dev                  # http://localhost:3000
```

## Variables de entorno

Ver `front/.env.example`:

- `NEXT_PUBLIC_API_URL`: URL de la API para el navegador. Por defecto `/api`,
  que `next.config.ts` redirige al backend con rewrites.
- `BACKEND_URL`: URL del backend para los rewrites del servidor. Por defecto
  `https://zentra-backend-production-8613.up.railway.app` (definido en
  `next.config.ts` y en `src/services/product.service.ts`).

El backend corre por separado desde `../back` (Express + TypeORM +
PostgreSQL). Ver el README raíz y `../DEPLOYMENT.md`.

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción (Next.js)
npm run start        # sirve el build
npm run lint         # ESLint
npm test             # Vitest (tests unitarios, `vitest run`)
npm run test:watch   # Vitest en modo interactivo
npm run test:demos   # alias de `npm test`, por compatibilidad con la CI anterior
```

## Tests

Tests unitarios con Vitest para funciones puras en
`src/utils/__tests__/`: precios, productos/categorías, validaciones de login,
registro y checkout, y completitud del perfil. No requieren base de datos ni
servidor. Ver el README raíz para el alcance y los pendientes.

## Estructura

```txt
src/
├── app/         # Rutas: products, cart, checkout, orders, login, register, admin, dashboard…
├── components/  # Componentes de UI
├── services/    # Llamadas a la API (usan NEXT_PUBLIC_API_URL / BACKEND_URL)
├── types/       # Tipos: product, order, forms, user, category…
└── utils/       # Funciones puras testeadas (pricing, product, validaciones, profile)
```
