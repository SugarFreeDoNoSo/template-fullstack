# 📋 TODO Board - NX Monorepo: NestJS + NextJS + tRPC

## 🎯 Objetivo del Proyecto
Crear un monorepo NX con:
- **Backend**: NestJS + Fastify + tRPC + TypeORM + PostgreSQL + Redis
- **Frontend**: NextJS 15 + shadcn + tRPC client + React Query + Recharts
- **DevOps**: DevContainer para desarrollo local
- **Funcionalidades**: CRUD de servicios + Dashboard con gráficos

---

## 📝 TODO

### 7. Crear migración de base de datos y configurar entorno de desarrollo
- [x] Crear migración TypeORM para tabla services
- [x] Configurar script de inicialización de base de datos
- [x] Crear datos de prueba (seeders) para desarrollo
- [x] Configurar variables de entorno para diferentes ambientes
- [x] Validar conexiones PostgreSQL y Redis en DevContainer
- **Herramienta principal**: `terminal` + `edit_file`

### 9. Crear componentes de Dashboard y formularios CRUD
- [ ] Diseñar layout principal del dashboard con shadcn/ui
- [ ] Crear formulario para crear/editar servicios
- [ ] Implementar tabla de servicios con paginación y filtros
- [ ] Agregar modal de confirmación para eliminar servicios
- [ ] Crear componentes reutilizables (ServiceCard, ServiceForm, etc.)
- [ ] Implementar validación client-side con Zod
- **Herramienta principal**: `edit_file`

### 10. Implementar gráficos del dashboard con Recharts
- [ ] Instalar y configurar Recharts
- [ ] Crear gráfico de pie: servicios por estado
- [ ] Crear gráfico de barras: servicios por estado
- [ ] Crear gráfico de línea: servicios por día (últimos 5 días hábiles)
- [ ] Implementar componente de métricas y KPIs
- [ ] Agregar responsive design para móviles
- **Herramienta principal**: `edit_file`



### 13. Testing end-to-end y optimizaciones finales
- [ ] Configurar Playwright o Cypress para e2e testing
- [ ] Crear tests para flujos principales del dashboard
- [ ] Optimizar performance del frontend (lazy loading, memoization)
- [ ] Configurar linting y formateo del código
- [ ] Crear CI/CD pipeline básico
- [ ] Validar accesibilidad y UX
- **Herramienta principal**: `edit_file` + `terminal`

### 14. Normalizar ejecuciones con package.json
- [ ] Crear scripts en `package.json` para iniciar base de datos, correr migraciones y seeders
- [ ] Documentar en README el uso de estos scripts
- **Herramienta principal**: `edit_file`

---

## 🔄 IN PROGRESS

---

## ✅ DONE

### 1. Configurar DevContainer con PostgreSQL y Redis
- [x] Crear `.devcontainer/devcontainer.json` y `docker-compose.yml`
- [x] Configurar PostgreSQL (puerto 5432) y Redis (puerto 6379)
- [x] Incluir extensiones VS Code para desarrollo
- **Herramienta principal**: `edit_file`
- **Commit**: `47f6463` - feat: configure DevContainer with PostgreSQL and Redis
- **Documentación**: `docs/iteraciones/tarea_1_iteracion_1.md`

### 2. Crear workspace NX y estructura inicial
- [x] Inicializar workspace NX con preset de aplicaciones TypeScript
- [x] Crear apps: `api` (NestJS) y `web` (NextJS)
- [x] Crear libs: `shared-types`, `trpc-config`
- **Herramienta principal**: `terminal`
- **Commit**: `25e4f63` - feat: create NX workspace with NestJS API and NextJS web apps
- **Documentación**: `docs/iteraciones/tarea_2_iteracion_1.md`

### 3. Configurar aplicación NestJS con Fastify
- [x] Instalar dependencias: @nestjs/platform-fastify, @nestjs/typeorm, typeorm, pg
- [x] Configurar main.ts para usar FastifyAdapter
- [x] Configurar módulo de base de datos con TypeORM
- **Herramienta principal**: `edit_file`
- **Commit**: `2cb280e` - feat: configure NestJS with Fastify and TypeORM
- **Documentación**: `docs/iteraciones/tarea_3_iteracion_1.md`

### 4. Configurar aplicación NextJS 15 con shadcn
- [x] Instalar y configurar shadcn/ui en el proyecto NextJS
- [x] Configurar Tailwind CSS y tema base
- [x] Crear layout básico de la aplicación
- **Herramienta principal**: `terminal` + `edit_file`
- **Commit**: `7060ba4` - feat: configure NextJS 15 with shadcn/ui and Tailwind CSS
- **Documentación**: `docs/iteraciones/tarea_4_iteracion_1.md`

### 5. Definir modelo Service y tipos compartidos
- [x] Crear entidad TypeORM Service en `shared-types`
- [x] Definir schemas Zod para validación (create, update, response)
- [x] Configurar exports de la librería con tipos TypeScript
- [x] Implementar enum ServiceStatus con valores: pending, completed, cancelled
- [x] Crear pruebas TDD completas para entidad y schemas
- **Herramienta principal**: `edit_file`
- **Commit**: `fcc05a0` - feat: implement Service entity with TypeORM and Zod schemas
- **Documentación**: `docs/iteraciones/tarea_5_iteracion_1.md`

### 6. Configurar tRPC router y conectar con NestJS + TypeORM
- [x] Configurar tRPC router en `trpc-config` con procedures CRUD
- [x] Integrar Service entity con TypeORM en NestJS con ServiceModule
- [x] Configurar conexión PostgreSQL y Redis para cache
- [x] Implementar procedures: createService, getServices, getService, updateService, deleteService
- [x] Configurar Redis para cache de operaciones GET con invalidación automática
- [x] Crear pruebas TDD para procedures tRPC (22/22 pruebas pasando)
- [x] Crear controlador tRPC para NestJS con manejo de errores
- [x] Configurar módulos Redis, Service y tRPC en AppModule
- **Herramienta principal**: `edit_file` + `terminal`
- **Commit**: `e917961` - feat: configure tRPC router with NestJS integration and Redis cache
- **Documentación**: `docs/iteraciones/tarea_6_iteracion_1.md`

### 11. Crear README completo y documentación del proyecto
- [x] Escribir README.md con descripción del proyecto
- [x] Documentar requisitos y stack tecnológico
- [x] Crear guía de instalación y configuración
- [x] Documentar API endpoints y procedures tRPC
- [x] Crear troubleshooting y FAQ
- **Herramienta principal**: `edit_file`
- **Commit**: Incluido en el commit de la tarea 12.
- **Documentación**: `README.md`

### 12. Configurar Docker y despliegue en contenedores
- [x] Crear Dockerfile para aplicación NestJS API
- [x] Crear Dockerfile para aplicación NextJS
- [x] Configurar docker-compose.yml para stack completo
- [x] Crear nginx.conf para reverse proxy
- [x] Configurar variables de entorno para producción
- [x] Crear scripts de build y deploy
- [x] Documentar proceso de despliegue
- **Herramienta principal**: `edit_file` + `terminal`
- **Commit**: `b4c2b9f` - feat: configure Docker deployment with production-ready stack
- **Documentación**: `docs/iteraciones/tarea_12_iteracion_1.md`

### 7. Crear migración de base de datos y configurar entorno de desarrollo
- [x] Crear migración TypeORM para tabla services
- [x] Configurar script de inicialización de base de datos
- [x] Crear datos de prueba (seeders) para desarrollo
- [x] Configurar variables de entorno para diferentes ambientes
- [x] Validar conexiones PostgreSQL y Redis en DevContainer
- **Herramienta principal**: `terminal` + `edit_file`
- **Commit**: `e012543` - feat: add database migration and dev environment scripts
- **Documentación**: `docs/iteraciones/tarea_7_iteracion_1.md`

### 8. Configurar tRPC client en Frontend NextJS
- [x] Instalar dependencias tRPC client y React Query
- [x] Configurar tRPC provider en app layout
- [x] Crear hooks personalizados para procedures CRUD
- [x] Configurar error handling y loading states
- [x] Implementar utilidades para manejo de fechas con date-fns
- **Herramienta principal**: `edit_file` + `terminal`
- **Commit**: `f02641a` - feat: configure trpc client and add date utils
- **Documentación**: `docs/iteraciones/tarea_8_iteracion_1.md`

---

## 📊 Modelo de Datos

```typescript
Service {
  id: number
  customerName: string
  serviceType: string
  scheduledAt: Date
  price: number
  status: 'pending' | 'completed' | 'cancelled'
}
```

## 🎨 Funcionalidades del Dashboard
- CRUD completo de servicios
- Gráfico pie: Servicios por estado
- Gráfico barra: Servicios por estado
- Gráfico línea/barra: Servicios por día (últimos 5 días hábiles)
- Cache Redis para operaciones GET

## 🛠️ Stack Tecnológico
- **Monorepo**: NX Workspace
- **Backend**: NestJS, Fastify, tRPC, TypeORM, PostgreSQL, Redis
- **Frontend**: NextJS 15, shadcn/ui, React Query, Recharts
- **Validación**: Zod
- **Fechas**: date-fns
- **Desarrollo**: DevContainer, Docker