# 📋 TODO Board - NX Monorepo: NestJS + NextJS + tRPC

## 🎯 Objetivo del Proyecto
Crear un monorepo NX con:
- **Backend**: NestJS + Fastify + tRPC + TypeORM + PostgreSQL + Redis
- **Frontend**: NextJS 15 + shadcn + tRPC client + React Query + Recharts
- **DevOps**: DevContainer para desarrollo local
- **Funcionalidades**: CRUD de servicios + Dashboard con gráficos

---

## 📝 TODO

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
- **Commit**: Pendiente - feat: configure tRPC router with NestJS integration and Redis cache
- **Documentación**: Pendiente - `docs/iteraciones/tarea_6_iteracion_1.md`

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