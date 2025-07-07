# Sistema de Gestión de Tareas - Prueba Fullstack

## 📋 Descripción General

Este documento describe el sistema de gestión de tareas implementado para el proyecto Prueba Fullstack, basado en la arquitectura de agentes TaskCreator-Agent y TaskExecutor-Agent.

## 🏗️ Arquitectura del Sistema

### Estructura de Carpetas

```
agent/
├── TODO/                    # Tareas pendientes
│   └── tarea_XX_nombre/
│       └── task.md
├── IN_PROGRESS/             # Tareas en progreso
│   └── tarea_XX_nombre/
│       └── task.md
├── DONE/                    # Tareas completadas
│   └── tarea_XX_nombre/
│       └── task.md
└── docs/
    ├── reference/           # Documentación técnica
    ├── iteraciones/         # Documentación de iteraciones TDD
    └── contexto/            # Contexto y decisiones
```

## 🤖 Agentes del Sistema

### TaskCreator-Agent

**Rol:** Experto en diseño de software y gestión de proyectos
**Responsabilidades:**
- Obtener y revisar documentación oficial
- Validar alcance y restricciones con el usuario
- Desglosar ideas en tareas accionables
- Crear archivos `task.md` detallados
- Planificar recursos y dependencias

### TaskExecutor-Agent

**Rol:** Arquitecto de software agnóstico
**Responsabilidades:**
- Ejecutar tareas siguiendo metodología TDD
- Implementar código con pruebas automatizadas
- Documentar decisiones e iteraciones
- Verificar criterios de aceptación
- Actualizar estado de tareas

## 📝 Formato de Tareas

### Estructura de task.md

```markdown
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
```

## 🔄 Flujo de Trabajo

### TaskCreator-Agent

1. **Obtener Documentación**
   - Identificar fuentes oficiales
   - Recopilar requisitos de negocio
   - Guardar en `agent/docs/reference/`

2. **Validación con Usuario**
   - Presentar resumen de documentación
   - Confirmar alcance y restricciones
   - Validar supuestos

3. **Desglose en Tareas**
   - Crear carpeta en `agent/TODO/`
   - Escribir `task.md` detallado
   - Definir criterios de aceptación

4. **Planificación Detallada**
   - Especificar recursos necesarios
   - Definir pasos de verificación
   - Estimar tiempo de ejecución

### TaskExecutor-Agent

1. **Lectura de Tarea**
   - Extraer primera tarea de `agent/TODO/`
   - Analizar criterios de aceptación

2. **Inicio de Tarea**
   - Mover carpeta a `agent/IN_PROGRESS/`
   - Actualizar estado en `task.md`

3. **Ciclo TDD**
   - Escribir prueba fallida
   - Ejecutar y confirmar fallo
   - Implementar código mínimo
   - Verificar éxito de prueba
   - Documentar iteración
   - Refactorizar si necesario

4. **Finalización**
   - Verificar criterios de aceptación
   - Mover carpeta a `agent/DONE/`
   - Actualizar `task.md` con resultados
   - Crear resumen en `agent/docs/contexto/`

## 📚 Tipos de Documentación

### Reference (`agent/docs/reference/`)
- Documentación técnica oficial
- Guías de usuario
- Estándares de codificación
- Especificaciones de API

### Iteraciones (`agent/docs/iteraciones/`)
- Documentación de cada iteración TDD
- Decisiones técnicas tomadas
- Problemas encontrados y soluciones
- Formato: `tarea_X_iter_Y.md`

### Contexto (`agent/docs/contexto/`)
- Resumen de decisiones importantes
- Aprendizajes clave
- Contexto para futuras referencias
- Formato: `resumen_tarea_X.md`

## 🎯 Principios Fundamentales

### Claridad
- Tareas sin ambigüedades
- Criterios de aceptación específicos
- Objetivos bien definidos

### Granularidad
- Tareas suficientemente pequeñas
- Progreso real y medible
- Tiempo de ejecución manejable

### Dependencias
- Orden lógico de ejecución
- Dependencias explícitas
- Identificación de bloqueos

### Tecnología
- Agnóstico a stack tecnológico
- Flexibilidad en herramientas
- Especificación solo cuando necesario

### Interactividad
- Validación continua con usuario
- Feedback constante
- Ajustes basados en retroalimentación

## 🔧 Herramientas Principales

### edit_file
- Crear y modificar archivos
- Implementar código
- Actualizar documentación

### terminal
- Ejecutar comandos
- Correr pruebas
- Verificar funcionalidad

### create_directory
- Crear estructura de carpetas
- Organizar archivos
- Preparar workspace

## 📋 Estados de Tareas

### TODO
- Tareas definidas pero no iniciadas
- Criterios de aceptación claros
- Recursos identificados
- Dependencias resueltas

### IN_PROGRESS
- Tarea actualmente en ejecución
- Ciclo TDD en progreso
- Documentación de iteraciones activa

### DONE
- Tarea completada exitosamente
- Criterios de aceptación cumplidos
- Código y pruebas finalizados
- Documentación actualizada

## 🚀 Comandos Útiles

```bash
# Crear nueva tarea
mkdir agent/TODO/tarea_XX_nombre
touch agent/TODO/tarea_XX_nombre/task.md

# Mover tarea a IN_PROGRESS
mv agent/TODO/tarea_XX_nombre agent/IN_PROGRESS/

# Mover tarea a DONE
mv agent/IN_PROGRESS/tarea_XX_nombre agent/DONE/

# Listar tareas por estado
ls agent/TODO/
ls agent/IN_PROGRESS/
ls agent/DONE/
```

## 📊 Métricas y Seguimiento

### Métricas de Tareas
- Tiempo estimado vs tiempo real
- Número de iteraciones TDD
- Criterios de aceptación cumplidos
- Dependencias resueltas

### Métricas de Calidad
- Cobertura de pruebas
- Documentación completa
- Refactoring realizado
- Problemas encontrados

## 🎓 Mejores Prácticas

1. **Definición Clara**: Cada tarea debe tener un objetivo específico
2. **Criterios Medibles**: Los criterios de aceptación deben ser verificables
3. **Documentación Continua**: Documentar durante la ejecución, no al final
4. **TDD Estricto**: Nunca escribir código sin prueba previa
5. **Feedback Temprano**: Validar con usuario frecuentemente
6. **Iteraciones Pequeñas**: Mantener ciclos TDD cortos
7. **Refactoring Regular**: Mejorar código manteniendo pruebas verdes

## 🔗 Referencias

- [Metodología TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884)
- [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)

---

**Versión:** 1.0  
**Fecha:** 2024-01-XX  
**Autor:** TaskCreator-Agent  
**Revisado por:** TaskExecutor-Agent