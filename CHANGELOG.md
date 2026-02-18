# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- Documentación completa del proyecto (README, LICENSE, CONTRIBUTING)
- Configuración de estándares de código
- Archivo .gitignore

## [3.0.0] - 2026-02-18

### Added
- ✨ Filtros visuales con preview en tiempo real
  - Rotación (90°, 180°, 270°)
  - Escala de grises
  - Sepia
  - Desenfoque (blur)
  - Nitidez (sharpen)
  - Ajuste de brillo (0-200%)
  - Ajuste de contraste (0-200%)
  - Ajuste de saturación (0-200%)
- ✨ Comparación interactiva antes/después con slider
- ✨ Selección múltiple de imágenes para aplicar filtros
- ✨ Indicadores visuales de filtros aplicados
- ✨ Botón para cambiar imagen de preview

### Changed
- 🎨 Mejoras en la interfaz de filtros
- 🎨 Diseño responsive optimizado para filtros
- ⚡ Optimización de rendimiento en vista previa

### Fixed
- 🐛 Corrección de índices al eliminar archivos con filtros aplicados
- 🐛 Sincronización de filtros entre preview y procesamiento

## [2.0.0] - 2026-02-15

### Added
- ✨ Soporte para arrastrar y soltar carpetas completas
- ✨ Historial de conversiones persistente (localStorage)
- ✨ Patrones de renombrado personalizables
- ✨ Opción para mantener estructura de carpetas
- ✨ Descarga masiva en formato ZIP
- ✨ Temas oscuro y claro
- ✨ Notificaciones toast elegantes
- ✨ Estadísticas en tiempo real
- ✨ Barra de progreso detallada

### Changed
- 🎨 Rediseño completo de la interfaz
- 🎨 Implementación de glassmorphism y gradientes modernos
- ♻️ Refactorización completa del código a POO
- ⚡ Mejoras de rendimiento significativas

### Fixed
- 🐛 Problemas de memoria con imágenes grandes
- 🐛 Errores en navegadores móviles
- 🐛 Compatibilidad con diferentes formatos de entrada

## [1.0.0] - 2026-02-10

### Added
- ✨ Lanzamiento inicial
- ✨ Conversión a WebP, JPEG y PNG
- ✨ Compresión con control de calidad
- ✨ Redimensionamiento de imágenes
- ✨ Arrastrar y soltar archivos
- ✨ Vista previa de archivos seleccionados
- ✨ Descarga individual de imágenes
- ✨ Accesibilidad básica (ARIA labels)
- ✨ Diseño responsive

---

## Tipos de cambios

- `Added` para nuevas funcionalidades
- `Changed` para cambios en funcionalidades existentes
- `Deprecated` para funcionalidades que serán eliminadas
- `Removed` para funcionalidades eliminadas
- `Fixed` para corrección de bugs
- `Security` para mejoras de seguridad