# 📋 TODO Board - NX Monorepo: NestJS + NextJS + tRPC

## 🎯 Objetivo del Proyecto
Crear un monorepo NX con:
- **Backend**: NestJS + Fastify + tRPC + TypeORM + PostgreSQL + Redis
- **Frontend**: NextJS 15 + shadcn + tRPC client + React Query + Recharts
- **DevOps**: DevContainer para desarrollo local
- **Funcionalidades**: CRUD de servicios + Dashboard con gráficos

---

## 📝 TODO

### 2. Crear workspace NX y estructura inicial
- [ ] Inicializar workspace NX con preset de aplicaciones TypeScript
- [ ] Crear apps: `api` (NestJS) y `web` (NextJS)
- [ ] Crear libs: `shared-types`, `trpc-config`
- **Herramienta principal**: `terminal`

### 3. Configurar aplicación NestJS con Fastify
- [ ] Instalar dependencias: @nestjs/platform-fastify, @nestjs/typeorm, typeorm, pg
- [ ] Configurar main.ts para usar FastifyAdapter
- [ ] Configurar módulo de base de datos con TypeORM
- **Herramienta principal**: `edit_file`

### 4. Configurar aplicación NextJS 15 con shadcn
- [ ] Instalar y configurar shadcn/ui en el proyecto NextJS
- [ ] Configurar Tailwind CSS y tema base
- [ ] Crear layout básico de la aplicación
- **Herramienta principal**: `terminal` + `edit_file`

### 5. Definir modelo Service y tipos compartidos
- [ ] Crear entidad TypeORM Service en `libs/shared-types`
- [ ] Definir schemas Zod para validación
- [ ] Configurar exports de la librería
- **Herramienta principal**: `edit_file`

---

## 🔄 IN PROGRESS

### 1. Configurar DevContainer con PostgreSQL y Redis
- [ ] Crear `.devcontainer/devcontainer.json` y `docker-compose.yml`
- [ ] Configurar PostgreSQL (puerto 5432) y Redis (puerto 6379)
- [ ] Incluir extensiones VS Code para desarrollo
- **Herramienta principal**: `edit_file`

---

## ✅ DONE

_No hay tareas completadas aún_

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