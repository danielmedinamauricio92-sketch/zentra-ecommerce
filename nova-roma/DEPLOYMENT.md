# Nova Roma by Barbies

Sitio estático con tres banners de nubes rosas, catálogo de 122 fragancias, búsqueda por nombre y marca, filtros por colección, fichas e ingreso a Tienda Nube. Incluye banner 2×1 e ilustración de motomensajería.

## Validación local

Desde `nova-roma`, ejecutar `node verify-catalog.mjs` y `node verify-details.mjs`. Vista previa: `node preview.mjs`, en http://127.0.0.1:4180.

Los perfiles sin información olfativa confirmada tienen una descripción general y no muestran notas inventadas. Las imágenes son ilustrativas. El sitio no administra inventario, precios, pagos ni descuentos: la operación comercial se gestiona en Tienda Nube. El banner 2×1 no activa descuentos automáticamente.

## Vercel

Directorio raíz del proyecto: `nova-roma`. Framework: Other. Sin comando de compilación. Directorio de salida: `dist`. La configuración está en `vercel.json`.

Despliegue manual desde este directorio: `vercel deploy --prod`. No subir las carpetas `.vercel`, `.openai`, `output` o archivos de autenticación al repositorio.
