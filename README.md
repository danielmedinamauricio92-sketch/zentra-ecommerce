# 🛒 Zentra E-commerce

Zentra es una aplicación web de comercio electrónico desarrollada como proyecto personal con el objetivo de poner en práctica conceptos de desarrollo Full Stack utilizando tecnologías modernas del ecosistema JavaScript.

## 🚀 Tecnologías utilizadas

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- Express 4 (API REST, **no NestJS** — ver nota abajo)
- TypeORM 0.3
- PostgreSQL (`pg`)
- Autenticación con bcrypt y JSON Web Tokens (`jsonwebtoken`)
- Documentación de la API con Swagger (`swagger-jsdoc` / `swagger-ui-express`)

### Herramientas

- Git / GitHub
- Vercel (frontend)
- Railway (backend + PostgreSQL)
- GitHub Actions (CI: lint, tests y build)

> **Nota sobre el backend:** versiones anteriores de este README decían que el
> backend era NestJS. Eso era incorrecto: `back/package.json` no tiene ninguna
> dependencia `@nestjs/*`. El backend real es **Express + TypeORM +
> PostgreSQL**. Esta corrección se hizo en la rama `fix/technical-improvements`
> para que la documentación coincida con el código.

> **Nota sobre Cloudinary:** no hay SDK de Cloudinary en las dependencias del
> frontend ni del backend. Las imágenes de los productos están alojadas en
> Cloudinary como hosting: las URLs `res.cloudinary.com` aparecen en
> `back/src/helpers/preLoadProducts.ts`, `front/next.config.ts` permite ese
> host para `next/image`, y `scripts/upload-cloudinary-images.mjs` usa las
> variables `CLOUDINARY_*` para subir imágenes. No hay integración con el SDK
> de Cloudinary en la aplicación.

## ✨ Funcionalidades

- Registro e inicio de sesión de usuarios (incluye login con Google).
- Catálogo de productos con categorías, ofertas y panel de administración.
- Carrito de compras, checkout y gestión de pedidos.
- Diseño responsive para dispositivos móviles y escritorio.
- Integración entre frontend y backend mediante API REST.
- Gestión de datos utilizando PostgreSQL.

## 📂 Estructura del repositorio

```txt
.
├── front/        # Next.js 16 + React 19 + TypeScript + Tailwind 4
├── back/         # Express 4 + TypeORM + PostgreSQL
├── scripts/      # Scripts auxiliares (p. ej. subida de imágenes a Cloudinary)
├── DEPLOYMENT.md # Despliegue en Railway (back) y Vercel (front)
└── .github/      # CI de GitHub Actions
```

## 🔧 Getting Started

### Requisitos

- Node.js 24 (el que usa la CI)
- PostgreSQL local o una `DATABASE_URL` (Railway) para el backend

### Backend

```bash
cd back
cp .env.example .env   # completar JWT_SECRET y los datos de la base de datos
npm ci
npm run dev            # http://localhost:3000 (ver PORT en .env)
```

Variables principales (ver `back/.env.example`): `PORT`, `DATABASE_URL` o
`DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`, `DB_SYNCHRONIZE`,
`FRONTEND_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.

### Frontend

```bash
cd front
cp .env.example .env.local
npm ci
npm run dev            # http://localhost:3000
```

Variables (ver `front/.env.example`):

- `NEXT_PUBLIC_API_URL`: URL de la API que usa el navegador. Por defecto
  `/api`, que `next.config.ts` redirige (rewrites) al backend.
- `BACKEND_URL`: URL del backend que usa el servidor de Next.js para los
  rewrites `/api/:path*`. Por defecto
  `https://zentra-backend-production-8613.up.railway.app` en
  `front/next.config.ts` y en `front/src/services/product.service.ts`.

## 🧪 Tests

Hay tests unitarios con Vitest para funciones puras, sin base de datos ni
servidor. Ver `front/src/utils/__tests__/` y `back/src/utils/__tests__/`.

```bash
npm --prefix front test   # vitest run
npm --prefix back test    # vitest run
npm --prefix front run test:watch  # modo interactivo (solo front)
```

La CI de GitHub Actions (`.github/workflows/ci.yml`) corre `npm test` en
front y en back, además de lint (front) y build en ambos. Ver `.github/CI.md`.

> **Pendiente:** no hay tests de integración ni de base de datos. Los tests
> actuales cubren utilidades puras (precios, productos, validaciones de
> formularios, `ClientError` y `catchedController`). La autenticación, el
> carrito y el checkout de punta a punta no están testeados.

## 🚀 Deploy

Ver `DEPLOYMENT.md` para el despliegue en Railway (backend) y Vercel
(frontend).

> **Pendiente:** la URL de la demo vigente no está confirmada. `DEPLOYMENT.md`
> usa `FRONTEND_URL=https://zentra-blond-eight.vercel.app`, distinta de
> `https://zentra-store-daniel.vercel.app/products`, que dio timeout al
> intentar leerla. No se afirma en este README cuál es la demo vigente hasta
> que el dueño del proyecto lo confirme.

## 📚 Objetivos del proyecto

- Aplicar buenas prácticas de desarrollo.
- Trabajar con arquitectura Frontend y Backend desacoplada.
- Implementar autenticación y manejo de datos persistentes.
- Fortalecer conocimientos en React, Next.js, Express, TypeORM y TypeScript.

## 📂 Repositorio

GitHub:
https://github.com/danielmedinamauricio92-sketch/zentra-ecommerce

## 🔧 Estado del proyecto

Proyecto académico y de portfolio actualmente en mantenimiento y mejora continua.

## 👨‍💻 Autor

Mauricio Daniel Medina

Frontend Developer especializado en React, Next.js y TypeScript.

LinkedIn:
https://www.linkedin.com/in/mauricio-daniel-medina

GitHub:
https://github.com/danielmedinamauricio92-sketch
