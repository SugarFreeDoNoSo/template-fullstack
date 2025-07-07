# Contexto Tarea 9: Layout del Dashboard

**Completada**: 2025-07-07
**Estado**: ✅ DONE

## 🎯 Lo que se implementó

- Se creó `DashboardLayout` con UI basada en shadcn.
- Nueva ruta `/dashboard` renderiza dicho layout.
- Página principal simplificada con enlace al dashboard.
- Se añadió `ServiceForm` para crear y editar servicios.

## Tabla de Servicios

- Se implementó `ServiceTable` para listar, filtrar y paginar servicios.
  Ahora el dashboard muestra datos dinámicos obtenidos vía tRPC.

## 🔍 Notas

Se añadieron los modales de confirmación para eliminar servicios y la validación
client-side con Zod en `ServiceForm`. También se creó un componente `ServiceCard`
para reutilizar la presentación de un servicio.
