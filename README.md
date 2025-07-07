# 🚀 Prueba Fullstack - NX Monorepo

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-398CCB?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

Un moderno sistema de gestión de servicios construido con **NX Monorepo**, featuring un dashboard interactivo con gráficos en tiempo real, CRUD completo y arquitectura escalable.

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [✨ Características Principales](#-características-principales)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🔧 Instalación Detallada](#-instalación-detallada)
- [🚀 Desarrollo](#-desarrollo)
- [📚 API Documentation](#-api-documentation)
- [🐳 Docker & Despliegue](#-docker--despliegue)
- [🧪 Testing](#-testing)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Contribución](#-contribución)

## 🎯 Descripción del Proyecto

**Prueba Fullstack** es una aplicación web moderna para la gestión de servicios empresariales que incluye:

- **Dashboard Interactivo**: Visualización de datos con gráficos dinámicos usando Recharts
- **CRUD Completo**: Crear, leer, actualizar y eliminar servicios
- **Cache Inteligente**: Sistema de cache con Redis para optimizar performance
- **Type Safety**: TypeScript end-to-end con validación Zod
- **Real-time Updates**: Actualizaciones en tiempo real con tRPC y React Query
- **Responsive Design**: Interface optimizada para desktop y móvil con shadcn/ui

### 🎨 Funcionalidades del Dashboard

- 📊 **Gráfico Pie**: Distribución de servicios por estado
- 📈 **Gráfico Barras**: Comparativa de servicios por estado
- 📉 **Gráfico Línea**: Tendencia de servicios por día (últimos 5 días hábiles)
- 🔍 **Filtros Avanzados**: Búsqueda y filtrado de servicios
- ⚡ **Cache Redis**: Operaciones GET optimizadas con invalidación automática

## 🛠️ Stack Tecnológico

### 🏗️ Arquitectura
- **[NX Workspace](https://nx.dev/)** - Monorepo tooling y build system
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety en todo el stack
- **[Docker](https://www.docker.com/)** - Containerización y DevContainer

### 🔙 Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js enterprise-grade
- **[Fastify](https://www.fastify.io/)** - Web framework de alta performance
- **[tRPC](https://trpc.io/)** - Type-safe APIs sin código repetitivo
- **[TypeORM](https://typeorm.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos relacional robusta
- **[Redis](https://redis.io/)** - Cache in-memory para performance
- **[Zod](https://zod.dev/)** - Validación de schemas TypeScript-first

### 🎨 Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework con App Router
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Query](https://tanstack.com/query)** - State management para server state
- **[Recharts](https://recharts.org/)** - Librería de gráficos para React
- **[date-fns](https://date-fns.org/)** - Utilidades modernas para fechas

### 🧪 Testing & Quality
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ESLint](https://eslint.org/)** - Linting para calidad de código
- **[Prettier](https://prettier.io/)** - Formateo automático de código

## ✨ Características Principales

### 🔒 Type Safety End-to-End
```typescript
// Backend tRPC procedure
const service = await caller.createService({
  customerName: "John Doe",
  serviceType: "Consultation",
  scheduledAt: new Date(),
  price: 150.00,
  status: ServiceStatus.PENDING
});

// Frontend con types automáticos
const { data, isLoading } = api.getServices.useQuery();
```

### ⚡ Sistema de Cache Inteligente
- **Read-Through Cache**: Los datos se cachean automáticamente en operaciones GET
- **Cache Invalidation**: Limpieza automática en operaciones CREATE/UPDATE/DELETE
- **Graceful Degradation**: Funciona sin cache si Redis está indisponible
- **TTL Optimizado**: 5 minutos de cache para balance performance/freshness

### 📊 Modelo de Datos

```typescript
interface Service {
  id: number;                    // ID único autoincremental
  customerName: string;          // Nombre del cliente (requerido)
  serviceType: string;           // Tipo de servicio (requerido)
  scheduledAt: Date;             // Fecha programada
  price: number;                 // Precio (decimal con 2 decimales)
  status: 'pending' | 'completed' | 'cancelled'; // Estado del servicio
}
```

## 📁 Estructura del Proyecto

```
Prueba-Fullstack/
├── 📁 .devcontainer/           # Configuración DevContainer
│   ├── devcontainer.json       # Definición del contenedor de desarrollo
│   └── docker-compose.yml      # PostgreSQL + Redis para desarrollo
├── 📁 api/                     # Backend NestJS
│   ├── src/
│   │   ├── app/               # Módulo principal de la aplicación
│   │   ├── redis/             # Módulo Redis (cache global)
│   │   ├── service/           # Módulo Service (business logic)
│   │   ├── trpc/              # Módulo tRPC (HTTP adapter)
│   │   └── main.ts            # Entry point de la aplicación
│   └── project.json           # Configuración NX para API
├── 📁 web/                     # Frontend NextJS
│   ├── src/
│   │   ├── app/               # App Router (NextJS 15)
│   │   ├── components/        # Componentes reutilizables
│   │   ├── lib/               # Utilidades y configuraciones
│   │   └── hooks/             # Custom hooks
│   └── project.json           # Configuración NX para Web
├── 📁 shared-types/            # Tipos y schemas compartidos
│   ├── src/lib/
│   │   ├── shared-types.ts    # Entidad Service + Zod schemas
│   │   └── *.spec.ts          # Tests TDD
│   └── project.json           # Configuración NX para tipos
├── 📁 trpc-config/             # Configuración tRPC
│   ├── src/lib/
│   │   ├── trpc-config.ts     # Router tRPC con procedures CRUD
│   │   └── *.spec.ts          # Tests TDD (22 tests)
│   └── project.json           # Configuración NX para tRPC
├── 📁 docs/                    # Documentación del proyecto
│   └── iteraciones/           # Documentación de desarrollo TDD
├── 📁 contexto/                # Resúmenes de contexto por tarea
├── 🔧 nx.json                 # Configuración principal NX
├── 🔧 package.json            # Dependencias del monorepo
├── 🔧 tsconfig.base.json      # Configuración TypeScript base
├── 🔧 .env                    # Variables de entorno
└── 📚 README.md               # Este archivo
```

## ⚡ Inicio Rápido

### Opción 1: DevContainer (Recomendado)

```bash
# 1. Clona el repositorio
git clone <repository-url>
cd Prueba-Fullstack

# 2. Abre en VS Code con DevContainer
code .
# Selecciona "Reopen in Container" cuando aparezca la notificación

# 3. Una vez dentro del container, instala dependencias
npm install

# 4. Inicia la aplicación
npm run dev
```

### Opción 2: Instalación Local

```bash
# 1. Verifica requisitos
node --version  # >= 18.x
npm --version   # >= 9.x

# 2. Instala y configura la base de datos
# Instala PostgreSQL y Redis localmente
# O usa Docker:
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
docker run --name redis -p 6379:6379 -d redis

# 3. Clona e instala
git clone <repository-url>
cd Prueba-Fullstack
npm install

# 4. Configura variables de entorno
cp .env.example .env
# Edita .env con tus configuraciones

# 5. Inicia la aplicación
npm run dev
```

## 🔧 Instalación Detallada

### 📋 Requisitos del Sistema

#### Para DevContainer:
- **[Docker Desktop](https://www.docker.com/products/docker-desktop)**
- **[VS Code](https://code.visualstudio.com/)** con extensión **Dev Containers**

#### Para Instalación Local:
- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (incluido con Node.js)
- **PostgreSQL** >= 13.x ([Download](https://www.postgresql.org/download/))
- **Redis** >= 6.x ([Download](https://redis.io/download))

### 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/prueba_fullstack

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
NODE_ENV=development
PORT=3001
API_PREFIX=api

# Development flags
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
```

### 🗄️ Configuración de Base de Datos

```bash
# Crear la base de datos (PostgreSQL local)
createdb prueba_fullstack

# O usando Docker
docker exec -it postgres createdb -U postgres prueba_fullstack

# La aplicación creará las tablas automáticamente con TypeORM sync
```

## 🚀 Desarrollo

### 📜 Scripts Disponibles

```bash
# Desarrollo - Inicia ambas aplicaciones
npm run dev

# Desarrollo separado
npm run dev:api          # Solo backend (puerto 3001)
npm run dev:web          # Solo frontend (puerto 3000)

# Build
npm run build            # Build completo
npm run build:api        # Solo API
npm run build:web        # Solo web

# Testing
npm test                 # Todos los tests
npm test shared-types    # Tests de tipos compartidos
npm test trpc-config     # Tests de tRPC (22 tests)
npm run e2e             # Tests end-to-end con Playwright

# Linting y formateo
npm run lint            # ESLint en todo el proyecto
npm run format          # Prettier en todo el proyecto

# NX utilidades
npx nx graph            # Visualizar dependencias del proyecto
npx nx affected:test    # Tests solo en código modificado

# Scripts de base de datos
npm run db:init         # Inicializa la base de datos con init-db.sql
npm run db:migrate      # Ejecuta migraciones TypeORM
npm run db:seed         # Inserta datos de ejemplo

# Scripts de producción
./scripts/build.sh       # Build optimizado para producción
./scripts/deploy.sh      # Deploy con Docker Compose
./scripts/build.sh --docker  # Build con imágenes Docker
./scripts/deploy.sh --rollback  # Rollback de despliegue
```

### 🏗️ Flujo de Desarrollo

1. **Crear rama de feature**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollo TDD**:
   - Escribir tests primero
   - Implementar funcionalidad
   - Refactorizar

3. **Validar calidad**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit y push**:
   ```bash
   git add .
   git commit -m "feat: descripción de la funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

### 🔄 Hot Reload

- **Backend**: Reinicio automático con cambios en `api/src`
- **Frontend**: Hot Module Replacement con cambios en `web/src`
- **Tipos compartidos**: Rebuild automático en `shared-types` y `trpc-config`

## 📚 API Documentation

### 🔗 Endpoints Disponibles

Base URL: `http://localhost:3001/api/trpc`

#### 🔍 GET Endpoints

```bash
# Obtener todos los servicios
GET /api/trpc/getServices

# Obtener servicio por ID
GET /api/trpc/getService?id=1
```

#### ✏️ POST Endpoints

```bash
# Crear nuevo servicio
POST /api/trpc/createService
Content-Type: application/json

{
  "customerName": "John Doe",
  "serviceType": "Consultation",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "price": 150.00,
  "status": "pending"
}

# Actualizar servicio
POST /api/trpc/updateService
Content-Type: application/json

{
  "id": 1,
  "customerName": "Jane Doe",
  "price": 200.00,
  "status": "completed"
}

# Eliminar servicio
POST /api/trpc/deleteService
Content-Type: application/json

{
  "id": 1
}
```

### 📋 Response Format

#### Success Response
```json
{
  "result": {
    "data": {
      "id": 1,
      "customerName": "John Doe",
      "serviceType": "Consultation",
      "scheduledAt": "2024-01-15T10:00:00.000Z",
      "price": 150.00,
      "status": "pending"
    }
  }
}
```

#### Error Response
```json
{
  "error": {
    "message": "Service not found",
    "code": "NOT_FOUND"
  }
}
```

### 🔒 Error Codes

| Code | Description |
|------|-------------|
| `NOT_FOUND` | Servicio no encontrado |
| `INTERNAL_SERVER_ERROR` | Error interno del servidor |
| `BAD_REQUEST` | Datos de entrada inválidos |

### 🎯 tRPC Procedures

Si usas el cliente tRPC directamente:

```typescript
import { api } from '~/lib/api';

// Queries (GET)
const { data: services } = api.getServices.useQuery();
const { data: service } = api.getService.useQuery({ id: 1 });

// Mutations (POST)
const createMutation = api.createService.useMutation();
const updateMutation = api.updateService.useMutation();
const deleteMutation = api.deleteService.useMutation();

// Uso
await createMutation.mutateAsync({
  customerName: "John Doe",
  serviceType: "Consultation",
  scheduledAt: new Date(),
  price: 150.00,
  status: "pending"
});
```

## 🐳 Docker & Despliegue

### 🛠️ DevContainer (Desarrollo)

El proyecto incluye configuración completa de DevContainer:

```json
// .devcontainer/devcontainer.json
{
  "name": "Prueba Fullstack Dev Environment",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "extensions": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

### 🚀 Despliegue con Docker Compose

El proyecto incluye configuración completa para despliegue en producción:

#### 📁 Archivos de Configuración

```
├── 📁 config/
│   ├── nginx.conf              # Configuración principal nginx
│   ├── nginx.prod.conf         # Virtual host para producción
│   └── redis.conf              # Configuración Redis optimizada
├── 📁 scripts/
│   ├── build.sh               # Script de build automatizado
│   ├── deploy.sh              # Script de deploy con health checks
│   └── init-db.sql            # Inicialización de base de datos
├── 🐳 api/Dockerfile          # Imagen multi-stage para NestJS
├── 🐳 web/Dockerfile          # Imagen optimizada para NextJS
├── 🐳 docker-compose.prod.yml # Stack completo de producción
├── 🔧 .env.production         # Variables de entorno de producción
└── 📝 .dockerignore           # Optimización de builds
```

#### 🚀 Despliegue Rápido

```bash
# 1. Configurar variables de entorno
cp .env.production .env.production.local
# Editar .env.production.local con tus valores

# 2. Build y deploy automático
./scripts/build.sh --docker
./scripts/deploy.sh

# 3. Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

#### 🔧 Configuración Manual

```bash
# 1. Build de imágenes Docker
docker build -f api/Dockerfile -t prueba-fullstack-api:latest .
docker build -f web/Dockerfile -t prueba-fullstack-web:latest .

# 2. Crear red y volúmenes
docker network create prueba-network
docker volume create postgres_data
docker volume create redis_data

# 3. Desplegar stack completo
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# 4. Verificar health checks
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

#### 🌐 Servicios Desplegados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **nginx** | 80, 443 | Reverse proxy y load balancer |
| **web** | 3000 | Frontend NextJS (interno) |
| **api** | 3001 | Backend NestJS (interno) |
| **postgres** | 5432 | Base de datos PostgreSQL |
| **redis** | 6379 | Cache y sesiones |

#### 🔒 Características de Seguridad

- **Multi-stage builds** para imágenes optimizadas
- **Non-root containers** para mayor seguridad
- **Health checks** integrados en todos los servicios
- **Network isolation** entre frontend/backend
- **Resource limits** configurados por servicio
- **Security headers** en nginx
- **Rate limiting** para APIs

#### 📊 Monitoring y Logs

```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f api

# Estadísticas de contenedores
docker stats

# Health check manual
curl -f http://localhost/health
curl -f http://localhost/api/health
```

## 🧪 Testing

### 📊 Cobertura Actual

- **shared-types**: 15/15 tests ✅
- **trpc-config**: 22/22 tests ✅
- **Total**: 37 tests pasando

### 🔍 Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test shared-types     # Tests de entidades y schemas
npm test trpc-config      # Tests de procedures tRPC

# Tests en modo watch
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### 🎯 Estrategia de Testing

- **Unit Tests**: Funciones puras y business logic
- **Integration Tests**: tRPC procedures con mocks
- **E2E Tests**: Próximamente con Playwright

## ❓ Troubleshooting

### 🐛 Problemas Comunes

#### "Cannot connect to database"
```bash
# Desarrollo (DevContainer/Local)
docker ps | grep postgres
pg_isready -h localhost -p 5432

# Producción (Docker Compose)
docker-compose -f docker-compose.prod.yml ps postgres
docker-compose -f docker-compose.prod.yml logs postgres
```

#### "Redis connection failed"
```bash
# Desarrollo
docker ps | grep redis
redis-cli ping

# Producción
docker-compose -f docker-compose.prod.yml ps redis
docker exec prueba-redis redis-cli ping
```

#### "Port 3000/3001 already in use"
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
lsof -i :3001

# Matar proceso
kill -9 <PID>

# Para producción, verificar Docker Compose
docker-compose -f docker-compose.prod.yml down
```

#### "Docker build fails"
```bash
# Limpiar cache de Docker
docker system prune -a

# Rebuild sin cache
docker build --no-cache -f api/Dockerfile .

# Verificar .dockerignore
cat .dockerignore
```

#### "Module not found" después de instalar dependencias
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

# O rebuild NX cache
npx nx reset

# Para Docker, rebuild imágenes
./scripts/build.sh --docker
```

#### "Health checks failing in production"
```bash
# Verificar logs de servicios
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs web

# Test manual de endpoints
curl -f http://localhost/health
curl -f http://localhost/api/health

# Verificar configuración nginx
docker exec prueba-nginx nginx -t
```

### 🔧 Comandos de Diagnóstico

```bash
# Desarrollo
npx nx report                    # Configuración NX
npx nx graph                     # Dependencias del proyecto
DEBUG=* npm run dev:api          # Logs detallados

# Producción
./scripts/deploy.sh --help       # Opciones de deploy
docker-compose -f docker-compose.prod.yml ps  # Estado de servicios
docker-compose -f docker-compose.prod.yml logs -f  # Logs en tiempo real
docker stats                     # Uso de recursos
```

### 📋 Checklist de Ambiente

#### Desarrollo
- [ ] Node.js >= 18.x instalado
- [ ] Docker Desktop instalado y corriendo
- [ ] VS Code con extensión Dev Containers (para DevContainer)
- [ ] Variables de entorno configuradas en `.env`
- [ ] Dependencias instaladas con `npm install`

#### Producción
- [ ] Docker y Docker Compose instalados
- [ ] Archivo `.env.production` configurado con valores reales
- [ ] Puertos 80/443 disponibles para nginx
- [ ] Suficiente espacio en disco (>2GB recomendado)
- [ ] Firewall configurado para permitir tráfico HTTP/HTTPS
- [ ] SSL certificados configurados (opcional para HTTPS)

## 🤝 Contribución

### 🔄 Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### 📝 Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: cambio de código que no es bug ni feature
test: agregar tests faltantes
chore: cambios en build, dependencias, etc
```

### 🧪 Estándares de Calidad

- **Tests**: Todas las nuevas features deben incluir tests
- **TypeScript**: Código debe ser type-safe, sin `any`
- **Linting**: Código debe pasar ESLint sin errores
- **Documentation**: Funciones públicas deben estar documentadas

### 📚 Recursos para Contribuidores

- [NX Documentation](https://nx.dev/getting-started/intro)
- [tRPC Documentation](https://trpc.io/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 🐛 **Issues**: [GitHub Issues](./issues)
- 📧 **Email**: [tu-email@dominio.com]
- 💬 **Discord**: [Link al servidor de Discord]

---

**Hecho con ❤️ usando TypeScript, NX, tRPC y las mejores prácticas de desarrollo moderno.**

[![Built with NX](https://img.shields.io/badge/Built%20with-NX-143055?style=flat-square&logo=nx)](https://nx.dev/)
[![Powered by tRPC](https://img.shields.io/badge/Powered%20by-tRPC-398CCB?style=flat-square)](https://trpc.io/)
