# GitHub Actions para Zentra

El workflow `workflows/ci.yml` ejecuta controles en cada push y pull request.
También permite ejecuciones manuales desde Actions > Zentra CI > Run workflow,
una vez que el archivo está en la rama predeterminada de GitHub.

- Frontend: instalación con `npm ci`, ESLint, tests con Vitest (`npm test`),
  y compilación de Next.js.
- Backend: instalación con `npm ci`, tests con Vitest (`npm test`) y
  compilación de TypeScript. No se agrega lint al backend porque no tiene
  configuración de ESLint.
- Ambos trabajos usan Node.js 24, cachés independientes y permisos de lectura.
- No requiere secretos ni inicia la base de datos: valida compilación, no la
  integración de la API con PostgreSQL. No realiza despliegues.

Para activar el workflow hay que subir este archivo al repositorio. Los cambios
de aplicación, manifiestos, lockfiles y pruebas deben subirse juntos cuando
dependan entre sí; los archivos locales sin seguimiento no aparecen en el runner.

Comandos equivalentes desde la raíz:

```sh
npm --prefix front ci
npm --prefix front run lint
npm --prefix front test
npm --prefix front run build
npm --prefix back ci
npm --prefix back test
npm --prefix back run build
```

Cuando los controles hayan pasado en GitHub, se pueden seleccionar ambos como
requisitos de una regla de protección de la rama principal en Settings > Rules.
