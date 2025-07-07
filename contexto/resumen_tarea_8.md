# Resumen de Contexto - Tarea 8

## 🎯 Logro Principal
Configuración del cliente tRPC en el frontend de NextJS con manejo básico de errores y utilidades de fechas.

## 🔑 Información Clave
- `web/src/trpc/provider.tsx` ahora inicializa `QueryClient` con opciones de retry, `staleTime` y callbacks de error.
- Se añadió `date-fns` en `package.json` para formateo y cálculo relativo de fechas.
- Nuevas pruebas en `web/specs/date-utils.spec.ts` verifican las utilidades `formatDate` y `relativeTime`.
