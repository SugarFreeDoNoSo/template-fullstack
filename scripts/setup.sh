#!/bin/bash

# Script de configuración inicial para Prueba Fullstack
# Este script automatiza la configuración completa del proyecto

set -e

echo "🚀 Configurando Prueba Fullstack..."
echo "================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar requisitos
check_requirements() {
    log_info "Verificando requisitos del sistema..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado. Instala Node.js 24.3.x o superior."
        exit 1
    fi

    NODE_VERSION=$(node --version)
    log_success "Node.js encontrado: $NODE_VERSION"

    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado."
        exit 1
    fi

    NPM_VERSION=$(npm --version)
    log_success "npm encontrado: $NPM_VERSION"

    if ! command -v docker &> /dev/null; then
        log_warning "Docker no está instalado. Algunas funcionalidades pueden no estar disponibles."
    else
        log_success "Docker encontrado"
    fi
}

# Instalar dependencias
install_dependencies() {
    log_info "Instalando dependencias..."
    npm install
    log_success "Dependencias instaladas correctamente"
}

# Configurar variables de entorno
setup_environment() {
    log_info "Configurando variables de entorno..."

    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            log_success "Archivo .env creado desde .env.example"
        else
            log_info "Creando archivo .env básico..."
            cat > .env << EOF
# Base de datos
DATABASE_URL=postgresql://postgres:password@localhost:5432/nx_monorepo_db
POSTGRES_DB=nx_monorepo_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_PORT=6379

# API
NODE_ENV=development
PORT=3001
API_PREFIX=api
CORS_ORIGIN=http://localhost:3000

# TypeORM
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true

# JWT
JWT_SECRET=your_jwt_secret_key_here

# NextJS
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1
EOF
            log_success "Archivo .env creado con configuración básica"
        fi
    else
        log_info "Archivo .env ya existe, omitiendo creación"
    fi
}

# Configurar bases de datos
setup_databases() {
    log_info "Configurando bases de datos..."

    if command -v docker &> /dev/null; then
        log_info "Levantando bases de datos con Docker..."
        npm run docker:dev

        # Esperar a que las bases de datos estén listas
        log_info "Esperando a que las bases de datos estén disponibles..."
        sleep 10

        # Verificar conexiones
        if npm run health &> /dev/null; then
            log_success "Bases de datos configuradas y conectadas"
        else
            log_warning "Las bases de datos pueden no estar completamente disponibles"
        fi
    else
        log_warning "Docker no disponible. Asegúrate de tener PostgreSQL y Redis ejecutándose localmente."
    fi
}

# Inicializar base de datos
initialize_database() {
    log_info "Inicializando base de datos..."

    if [ -f "scripts/init-db.sh" ]; then
        npm run db:init
        log_success "Base de datos inicializada"
    else
        log_warning "Script de inicialización de BD no encontrado"
    fi

    if [ -f "scripts/run-migrations.ts" ]; then
        npm run db:migrate
        log_success "Migraciones ejecutadas"
    else
        log_warning "Scripts de migración no encontrados"
    fi

    if [ -f "scripts/seed-dev.ts" ]; then
        npm run db:seed
        log_success "Datos de prueba cargados"
    else
        log_warning "Scripts de seed no encontrados"
    fi
}

# Construir el proyecto
build_project() {
    log_info "Construyendo proyectos..."

    # Construir dependencias compartidas primero
    if npx nx build shared-types 2>/dev/null; then
        log_success "shared-types construido"
    else
        log_warning "No se pudo construir shared-types"
    fi

    if npx nx build trpc-config 2>/dev/null; then
        log_success "trpc-config construido"
    else
        log_warning "No se pudo construir trpc-config"
    fi
}

# Verificar configuración
verify_setup() {
    log_info "Verificando configuración..."

    # Verificar que los puertos estén disponibles
    if lsof -i :3000 &> /dev/null; then
        log_warning "Puerto 3000 está en uso"
    fi

    if lsof -i :3001 &> /dev/null; then
        log_warning "Puerto 3001 está en uso"
    fi

    # Verificar estructura de archivos
    if [ ! -f "nx.json" ]; then
        log_error "Este no parece ser un proyecto NX válido"
        exit 1
    fi

    log_success "Verificación completada"
}

# Mostrar información final
show_final_info() {
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo "=============================="
    echo ""
    echo "Para iniciar el desarrollo:"
    echo "  npm run dev                 # Inicia ambas aplicaciones"
    echo "  npm run api:dev             # Solo API (puerto 3001)"
    echo "  npm run web:dev             # Solo frontend (puerto 3000)"
    echo ""
    echo "URLs disponibles:"
    echo "  🌐 Frontend: http://localhost:3000"
    echo "  🔧 API: http://localhost:3001/api"
    echo "  📊 Base de datos: localhost:5432 (postgres/password)"
    echo "  🚀 Redis: localhost:6379"
    echo ""
    echo "Comandos útiles:"
    echo "  npm run docker:dev          # Levantar bases de datos"
    echo "  npm run db:reset            # Resetear base de datos"
    echo "  npm run health              # Verificar conexiones"
    echo "  npm run clean               # Limpiar cache y dependencias"
    echo ""
    echo "¡Listo para desarrollar! 🚀"
}

# Manejo de errores
handle_error() {
    log_error "Error en la configuración. Revisa los logs anteriores."
    exit 1
}

# Configurar trap para errores
trap handle_error ERR

# Función principal
main() {
    echo ""
    check_requirements
    echo ""
    install_dependencies
    echo ""
    setup_environment
    echo ""
    setup_databases
    echo ""
    initialize_database
    echo ""
    build_project
    echo ""
    verify_setup
    echo ""
    show_final_info
}

# Ejecutar si se llama directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
