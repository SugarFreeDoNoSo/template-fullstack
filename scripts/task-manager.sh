#!/bin/bash

# Task Manager Script - Prueba Fullstack
# Script para gestión de tareas del sistema TaskCreator-Agent / TaskExecutor-Agent

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
AGENT_DIR="agent"
TODO_DIR="$AGENT_DIR/TODO"
IN_PROGRESS_DIR="$AGENT_DIR/IN_PROGRESS"
DONE_DIR="$AGENT_DIR/DONE"
DOCS_DIR="$AGENT_DIR/docs"

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

log_header() {
    echo -e "${PURPLE}[HEADER]${NC} $1"
}

log_task() {
    echo -e "${CYAN}[TASK]${NC} $1"
}

# Función para mostrar ayuda
show_help() {
    echo "🤖 Task Manager - Prueba Fullstack"
    echo "=================================="
    echo ""
    echo "USO: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "COMANDOS:"
    echo "  status          - Mostrar estado de todas las tareas"
    echo "  list [estado]   - Listar tareas por estado (todo|progress|done|all)"
    echo "  create          - Crear nueva tarea interactivamente"
    echo "  move <id>       - Mover tarea entre estados"
    echo "  show <id>       - Mostrar detalles de una tarea"
    echo "  stats           - Mostrar estadísticas del proyecto"
    echo "  init            - Inicializar estructura de carpetas"
    echo "  validate        - Validar estructura de tareas"
    echo "  help            - Mostrar esta ayuda"
    echo ""
    echo "EJEMPLOS:"
    echo "  $0 status                    # Ver estado general"
    echo "  $0 list todo                 # Ver tareas pendientes"
    echo "  $0 create                    # Crear nueva tarea"
    echo "  $0 move tarea_01_ejemplo     # Mover tarea interactivamente"
    echo "  $0 show tarea_01_ejemplo     # Ver detalles de tarea"
    echo ""
}

# Función para inicializar estructura
init_structure() {
    log_header "Inicializando estructura de tareas..."

    # Crear directorios principales
    mkdir -p "$TODO_DIR"
    mkdir -p "$IN_PROGRESS_DIR"
    mkdir -p "$DONE_DIR"
    mkdir -p "$DOCS_DIR/reference"
    mkdir -p "$DOCS_DIR/iteraciones"
    mkdir -p "$DOCS_DIR/contexto"

    log_success "Estructura de carpetas creada"

    # Crear archivo de plantilla si no existe
    if [ ! -f "$DOCS_DIR/reference/task_template.md" ]; then
        create_task_template
    fi

    log_success "Estructura inicializada correctamente"
}

# Función para crear plantilla de tarea
create_task_template() {
    cat > "$DOCS_DIR/reference/task_template.md" << 'EOF'
# Tarea X: [Título con verbo imperativo]

## 📋 Información General
- **ID**: tarea_XX_nombre_descriptivo
- **Estado**: TODO | IN_PROGRESS | DONE
- **Fecha de inicio**: YYYY-MM-DD
- **Fecha de finalización**: YYYY-MM-DD
- **Tiempo estimado**: X horas
- **Tiempo real**: X horas

## 🎯 Objetivo
[Descripción clara del objetivo de la tarea]

## 📝 Descripción
[Descripción detallada de lo que se debe hacer]

## ✅ Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio N

## 🔧 Herramientas Principales
- **Principal**: [edit_file | terminal | create_directory]
- **Secundarias**: [herramientas adicionales]

## 📦 Recursos Necesarios
- [Librerías, endpoints, estándares requeridos]

## 🧪 Pasos de Verificación
1. [Paso de verificación 1]
2. [Paso de verificación 2]
3. [Paso de verificación N]

## 🔗 Dependencias
- [Tareas de las que depende]

## 📋 Dependencias Bloqueantes
- [Tareas que bloquean esta tarea]

## 🎯 Resultados Obtenidos
[Resultados específicos alcanzados - solo para DONE]

## 📊 Archivos Creados/Modificados
[Lista de archivos afectados - solo para DONE]

## 🔄 Commit
- **Hash**: [hash del commit]
- **Mensaje**: [mensaje del commit]

## 📚 Documentación
[Enlaces a documentación relacionada]

## 🎓 Aprendizajes
[Aprendizajes obtenidos durante la implementación]

## 🔧 Notas Técnicas
[Detalles técnicos importantes]
EOF
}

# Función para contar tareas por estado
count_tasks() {
    local todo_count=$(find "$TODO_DIR" -maxdepth 1 -type d ! -path "$TODO_DIR" 2>/dev/null | wc -l)
    local progress_count=$(find "$IN_PROGRESS_DIR" -maxdepth 1 -type d ! -path "$IN_PROGRESS_DIR" 2>/dev/null | wc -l)
    local done_count=$(find "$DONE_DIR" -maxdepth 1 -type d ! -path "$DONE_DIR" 2>/dev/null | wc -l)

    echo "$todo_count $progress_count $done_count"
}

# Función para mostrar estado general
show_status() {
    log_header "Estado General de Tareas"
    echo "========================="
    echo ""

    read todo_count progress_count done_count <<< $(count_tasks)
    local total_count=$((todo_count + progress_count + done_count))

    echo "📊 Resumen:"
    echo "  📋 TODO: $todo_count tareas"
    echo "  ⚠️  IN_PROGRESS: $progress_count tareas"
    echo "  ✅ DONE: $done_count tareas"
    echo "  📈 TOTAL: $total_count tareas"
    echo ""

    if [ $total_count -gt 0 ]; then
        local done_percentage=$((done_count * 100 / total_count))
        echo "🎯 Progreso: $done_percentage% completado"
        echo ""
    fi

    # Mostrar tareas en progreso
    if [ $progress_count -gt 0 ]; then
        echo "🔄 Tareas en progreso:"
        for task_dir in "$IN_PROGRESS_DIR"/*; do
            if [ -d "$task_dir" ]; then
                local task_name=$(basename "$task_dir")
                echo "  • $task_name"
            fi
        done
        echo ""
    fi

    # Mostrar próximas tareas
    if [ $todo_count -gt 0 ]; then
        echo "📋 Próximas tareas:"
        local count=0
        for task_dir in "$TODO_DIR"/*; do
            if [ -d "$task_dir" ] && [ $count -lt 3 ]; then
                local task_name=$(basename "$task_dir")
                echo "  • $task_name"
                count=$((count + 1))
            fi
        done
        if [ $todo_count -gt 3 ]; then
            echo "  ... y $((todo_count - 3)) más"
        fi
        echo ""
    fi
}

# Función para listar tareas
list_tasks() {
    local state=${1:-all}

    case $state in
        "todo"|"TODO")
            log_header "Tareas TODO"
            list_tasks_in_dir "$TODO_DIR"
            ;;
        "progress"|"IN_PROGRESS"|"in_progress")
            log_header "Tareas IN_PROGRESS"
            list_tasks_in_dir "$IN_PROGRESS_DIR"
            ;;
        "done"|"DONE")
            log_header "Tareas DONE"
            list_tasks_in_dir "$DONE_DIR"
            ;;
        "all"|*)
            log_header "Todas las Tareas"
            echo ""
            echo "📋 TODO:"
            list_tasks_in_dir "$TODO_DIR" "  "
            echo ""
            echo "⚠️  IN_PROGRESS:"
            list_tasks_in_dir "$IN_PROGRESS_DIR" "  "
            echo ""
            echo "✅ DONE:"
            list_tasks_in_dir "$DONE_DIR" "  "
            ;;
    esac
}

# Función auxiliar para listar tareas en directorio
list_tasks_in_dir() {
    local dir=$1
    local prefix=${2:-""}

    if [ ! -d "$dir" ]; then
        echo "${prefix}No hay tareas"
        return
    fi

    local count=0
    for task_dir in "$dir"/*; do
        if [ -d "$task_dir" ]; then
            local task_name=$(basename "$task_dir")
            local task_title=""

            # Extraer título del task.md si existe
            if [ -f "$task_dir/task.md" ]; then
                task_title=$(grep "^# " "$task_dir/task.md" | head -1 | sed 's/^# //')
            fi

            if [ -n "$task_title" ]; then
                echo "${prefix}• $task_name: $task_title"
            else
                echo "${prefix}• $task_name"
            fi
            count=$((count + 1))
        fi
    done

    if [ $count -eq 0 ]; then
        echo "${prefix}No hay tareas"
    fi
}

# Función para mostrar detalles de una tarea
show_task() {
    local task_id=$1

    if [ -z "$task_id" ]; then
        log_error "Debes especificar el ID de la tarea"
        return 1
    fi

    # Buscar la tarea en todos los directorios
    local task_path=""
    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR"; do
        if [ -d "$dir/$task_id" ]; then
            task_path="$dir/$task_id"
            break
        fi
    done

    if [ -z "$task_path" ]; then
        log_error "Tarea '$task_id' no encontrada"
        return 1
    fi

    log_header "Detalles de la Tarea: $task_id"
    echo ""

    if [ -f "$task_path/task.md" ]; then
        cat "$task_path/task.md"
    else
        log_warning "Archivo task.md no encontrado para la tarea $task_id"
    fi
}

# Función para crear nueva tarea
create_task() {
    log_header "Crear Nueva Tarea"
    echo ""

    read -p "Número de tarea: " task_number
    read -p "Nombre descriptivo: " task_name
    read -p "Título de la tarea: " task_title

    if [ -z "$task_number" ] || [ -z "$task_name" ] || [ -z "$task_title" ]; then
        log_error "Todos los campos son obligatorios"
        return 1
    fi

    local task_id="tarea_${task_number}_${task_name}"
    local task_dir="$TODO_DIR/$task_id"

    if [ -d "$task_dir" ]; then
        log_error "La tarea '$task_id' ya existe"
        return 1
    fi

    mkdir -p "$task_dir"

    # Crear task.md basado en plantilla
    cat > "$task_dir/task.md" << EOF
# Tarea $task_number: $task_title

## 📋 Información General
- **ID**: $task_id
- **Estado**: TODO
- **Fecha de inicio**: $(date +%Y-%m-%d)
- **Fecha de finalización**:
- **Tiempo estimado**: X horas
- **Tiempo real**:

## 🎯 Objetivo
[Descripción clara del objetivo de la tarea]

## 📝 Descripción
[Descripción detallada de lo que se debe hacer]

## ✅ Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio N

## 🔧 Herramientas Principales
- **Principal**: [edit_file | terminal | create_directory]
- **Secundarias**: [herramientas adicionales]

## 📦 Recursos Necesarios
- [Librerías, endpoints, estándares requeridos]

## 🧪 Pasos de Verificación
1. [Paso de verificación 1]
2. [Paso de verificación 2]
3. [Paso de verificación N]

## 🔗 Dependencias
- [Tareas de las que depende]

## 📋 Dependencias Bloqueantes
- [Tareas que bloquean esta tarea]

## 🎯 Resultados Obtenidos
[Pendiente de completar]

## 📊 Archivos Creados/Modificados
[Pendiente de completar]

## 🔄 Commit
- **Hash**: [pendiente]
- **Mensaje**: [pendiente]

## 📚 Documentación
[Enlaces a documentación relacionada]

## 🎓 Aprendizajes
[Pendiente de completar]

## 🔧 Notas Técnicas
[Detalles técnicos importantes]
EOF

    log_success "Tarea '$task_id' creada exitosamente"
    log_info "Ubicación: $task_dir/task.md"
    log_info "Puedes editar el archivo para completar los detalles"
}

# Función para mover tarea
move_task() {
    local task_id=$1

    if [ -z "$task_id" ]; then
        log_error "Debes especificar el ID de la tarea"
        return 1
    fi

    # Buscar la tarea en todos los directorios
    local current_dir=""
    local task_path=""

    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR"; do
        if [ -d "$dir/$task_id" ]; then
            current_dir=$(basename "$dir")
            task_path="$dir/$task_id"
            break
        fi
    done

    if [ -z "$task_path" ]; then
        log_error "Tarea '$task_id' no encontrada"
        return 1
    fi

    echo "Tarea encontrada en: $current_dir"
    echo ""
    echo "Opciones de destino:"
    echo "1) TODO"
    echo "2) IN_PROGRESS"
    echo "3) DONE"
    echo "4) Cancelar"
    echo ""

    read -p "Selecciona destino (1-4): " choice

    local dest_dir=""
    case $choice in
        1)
            dest_dir="$TODO_DIR"
            ;;
        2)
            dest_dir="$IN_PROGRESS_DIR"
            ;;
        3)
            dest_dir="$DONE_DIR"
            ;;
        4)
            log_info "Operación cancelada"
            return 0
            ;;
        *)
            log_error "Opción inválida"
            return 1
            ;;
    esac

    if [ "$task_path" = "$dest_dir/$task_id" ]; then
        log_warning "La tarea ya está en el destino seleccionado"
        return 0
    fi

    # Mover la tarea
    mv "$task_path" "$dest_dir/"

    # Actualizar estado en task.md
    local new_state=$(basename "$dest_dir")
    if [ -f "$dest_dir/$task_id/task.md" ]; then
        sed -i "s/- \*\*Estado\*\*: .*/- **Estado**: $new_state/" "$dest_dir/$task_id/task.md"

        # Actualizar fecha si se mueve a IN_PROGRESS o DONE
        if [ "$new_state" = "IN_PROGRESS" ]; then
            sed -i "s/- \*\*Fecha de inicio\*\*: .*/- **Fecha de inicio**: $(date +%Y-%m-%d)/" "$dest_dir/$task_id/task.md"
        elif [ "$new_state" = "DONE" ]; then
            sed -i "s/- \*\*Fecha de finalización\*\*: .*/- **Fecha de finalización**: $(date +%Y-%m-%d)/" "$dest_dir/$task_id/task.md"
        fi
    fi

    log_success "Tarea '$task_id' movida a $new_state"
}

# Función para mostrar estadísticas
show_stats() {
    log_header "Estadísticas del Proyecto"
    echo "========================="
    echo ""

    read todo_count progress_count done_count <<< $(count_tasks)
    local total_count=$((todo_count + progress_count + done_count))

    echo "📊 Resumen General:"
    echo "  Total de tareas: $total_count"
    echo "  Completadas: $done_count"
    echo "  En progreso: $progress_count"
    echo "  Pendientes: $todo_count"
    echo ""

    if [ $total_count -gt 0 ]; then
        local done_percentage=$((done_count * 100 / total_count))
        local progress_percentage=$((progress_count * 100 / total_count))
        local todo_percentage=$((todo_count * 100 / total_count))

        echo "📈 Distribución:"
        echo "  ✅ Completadas: $done_percentage%"
        echo "  ⚠️  En progreso: $progress_percentage%"
        echo "  📋 Pendientes: $todo_percentage%"
        echo ""
    fi

    # Estadísticas de archivos
    local total_files=0
    local total_docs=0

    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR"; do
        if [ -d "$dir" ]; then
            total_files=$((total_files + $(find "$dir" -name "*.md" | wc -l)))
        fi
    done

    if [ -d "$DOCS_DIR" ]; then
        total_docs=$(find "$DOCS_DIR" -name "*.md" | wc -l)
    fi

    echo "📁 Archivos:"
    echo "  Archivos de tareas: $total_files"
    echo "  Documentos: $total_docs"
    echo ""

    # Última actividad
    local last_modified=""
    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR"; do
        if [ -d "$dir" ]; then
            local latest=$(find "$dir" -name "task.md" -exec stat -c "%Y %n" {} \; 2>/dev/null | sort -n -r | head -1)
            if [ -n "$latest" ]; then
                last_modified="$latest"
                break
            fi
        fi
    done

    if [ -n "$last_modified" ]; then
        local timestamp=$(echo "$last_modified" | cut -d' ' -f1)
        local filepath=$(echo "$last_modified" | cut -d' ' -f2-)
        local task_name=$(basename "$(dirname "$filepath")")
        local date_formatted=$(date -d "@$timestamp" "+%Y-%m-%d %H:%M")

        echo "🕐 Última actividad:"
        echo "  Tarea: $task_name"
        echo "  Fecha: $date_formatted"
    fi
}

# Función para validar estructura
validate_structure() {
    log_header "Validando Estructura de Tareas"
    echo ""

    local errors=0

    # Verificar directorios principales
    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR" "$DOCS_DIR"; do
        if [ ! -d "$dir" ]; then
            log_error "Directorio faltante: $dir"
            errors=$((errors + 1))
        fi
    done

    # Verificar task.md en cada tarea
    for dir in "$TODO_DIR" "$IN_PROGRESS_DIR" "$DONE_DIR"; do
        if [ -d "$dir" ]; then
            for task_dir in "$dir"/*; do
                if [ -d "$task_dir" ]; then
                    local task_name=$(basename "$task_dir")
                    if [ ! -f "$task_dir/task.md" ]; then
                        log_error "Archivo task.md faltante en: $task_name"
                        errors=$((errors + 1))
                    else
                        # Verificar estructura básica del task.md
                        if ! grep -q "^# Tarea" "$task_dir/task.md"; then
                            log_warning "Formato de título incorrecto en: $task_name"
                        fi
                        if ! grep -q "## 📋 Información General" "$task_dir/task.md"; then
                            log_warning "Sección 'Información General' faltante en: $task_name"
                        fi
                    fi
                fi
            done
        fi
    done

    echo ""
    if [ $errors -eq 0 ]; then
        log_success "Estructura válida - no se encontraron errores"
    else
        log_error "Se encontraron $errors errores en la estructura"
    fi
}

# Función principal
main() {
    # Verificar si estamos en el directorio correcto
    if [ ! -f "package.json" ] || [ ! -f "nx.json" ]; then
        log_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        exit 1
    fi

    # Crear estructura si no existe
    if [ ! -d "$AGENT_DIR" ]; then
        log_info "Estructura de tareas no encontrada, inicializando..."
        init_structure
    fi

    case ${1:-help} in
        "status")
            show_status
            ;;
        "list")
            list_tasks "$2"
            ;;
        "create")
            create_task
            ;;
        "move")
            move_task "$2"
            ;;
        "show")
            show_task "$2"
            ;;
        "stats")
            show_stats
            ;;
        "init")
            init_structure
            ;;
        "validate")
            validate_structure
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
