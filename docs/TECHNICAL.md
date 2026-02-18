# Documentación Técnica

## Arquitectura del Proyecto

### Diagrama de Flujo

```
Usuario
    ↓
┌─────────────────────────────────────┐
│  Interfaz de Usuario (index.html)   │
│  - Drag & Drop                      │
│  - Controles de configuración       │
│  - Vista previa de filtros          │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  Lógica de Negocio (script.js)      │
│  - ImageConverterPro (Clase)        │
│  - Gestión de archivos              │
│  - Procesamiento Canvas             │
│  - Generación ZIP                   │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│  APIs del Navegador                 │
│  - File API                         │
│  - Canvas API                       │
│  - Drag & Drop API                  │
│  - LocalStorage API                 │
└─────────────────────────────────────┘
```

## Estructura de Clases

### ImageConverterPro

La clase principal que orquesta toda la aplicación:

```javascript
class ImageConverterPro {
  // Propiedades principales
  selectedFiles: File[]           // Archivos seleccionados
  processedImages: Object[]       // Imágenes procesadas
  conversionHistory: Object[]     // Historial persistente
  filters: Object                 // Filtros globales
  fileFilters: Map                // Filtros por archivo
  
  // Métodos principales
  init()                          // Inicialización
  handleDrop()                    // Drag & Drop
  processFiles()                  // Validación
  processImages()                 // Procesamiento batch
  processSingleFile()             // Procesamiento individual
  applyFiltersToSelected()        // Aplicar filtros
  downloadAllAsZip()              // Descarga ZIP
}
```

## Flujo de Procesamiento de Imágenes

### 1. Carga de Archivos

```javascript
// Eventos soportados
- Drag & Drop de archivos individuales
- Drag & Drop de carpetas completas
- Selección mediante input file
- Selección de carpetas (webkitdirectory)
```

### 2. Validación

```javascript
Validaciones realizadas:
✓ Tipo MIME debe comenzar con 'image/'
✓ Tamaño menor a 50MB (CONFIG.maxFileSize)
✓ Evitar duplicados (opcional)
```

### 3. Procesamiento Canvas

```javascript
Flujo de renderizado:
1. FileReader lee archivo como Data URL
2. Crear imagen HTMLImageElement
3. Crear canvas con dimensiones calculadas
4. Aplicar transformaciones:
   - Rotación (ctx.rotate)
   - Filtros CSS (ctx.filter)
5. Dibujar imagen transformada
6. Exportar a Data URL (canvas.toDataURL)
7. Calcular tamaño final
```

### 4. Filtros Disponibles

```javascript
Filtros implementados:
- Rotación: 0°, 90°, 180°, 270°
- Grayscale: escala de grises
- Sepia: tono sepia
- Blur: desenfoque gaussiano 5px
- Brightness: brillo 0-200%
- Contrast: contraste 0-200%
- Saturation: saturación 0-200%

Combinación de filtros CSS:
ctx.filter = "grayscale(100%) brightness(120%) contrast(110%)"
```

## Almacenamiento Local

### Estructura de Datos

```javascript
// Historial de conversiones
localStorage.conversionHistory = [
  {
    id: 1708281600000,              // Timestamp
    date: "2024-02-18T12:00:00Z",   // ISO 8601
    count: 5,                       // Número de imágenes
    originalSize: 5242880,          // Bytes originales
    compressedSize: 1048576,        // Bytes comprimidos
    savings: 4194304,               // Bytes ahorrados
    savingsPercent: "80.0",         // Porcentaje
    format: "webp"                  // Formato usado
  }
]

// Preferencia de tema
localStorage.theme = "dark" | "light"
```

## Optimizaciones de Rendimiento

### 1. Caché de Miniaturas

```javascript
// Map para almacenar miniaturas generadas
this.thumbnailCache = new Map()

// Clave: nombre + tamaño del archivo
// Valor: Data URL de miniatura

// Límite: 100 miniaturas (CONFIG.thumbnailCacheSize)
```

### 2. Lazy Loading

```javascript
// Imágenes en galería usan loading="lazy"
<img src="..." loading="lazy" alt="...">

// Preview limitado a 20 elementos visibles
// "+N más..." indica elementos adicionales
```

### 3. Procesamiento por Lotes

```javascript
// Configuración de concurrencia
CONFIG.maxConcurrent = 3

// Procesamiento secuencial actual
// TODO: Implementar Web Workers para paralelismo real
```

## Compatibilidad

### Navegadores Soportados

| Navegador | Versión Mínima | Características |
|-----------|---------------|-----------------|
| Chrome    | 60+           | Completo        |
| Firefox   | 55+           | Completo        |
| Safari    | 12+           | Completo        |
| Edge      | 79+           | Completo        |
| Opera     | 47+           | Completo        |

### APIs Requeridas

- File API: Lectura de archivos
- Canvas API: Manipulación de imágenes
- Drag and Drop API: Interacción
- LocalStorage API: Persistencia
- CSS Filters: Efectos visuales
- ES6+ Features: Arrow functions, const/let, etc.

## Consideraciones de Seguridad

### Procesamiento Client-Side

```javascript
Ventajas de seguridad:
✓ Las imágenes nunca salen del navegador
✓ No hay servidor que comprometer
✓ No hay exposición de datos del usuario
✓ Procesamiento aislado por pestaña
```

### Limitaciones de WebKit Directory

```javascript
webkitdirectory solo funciona en:
- Chrome/Edge (completo)
- Firefox (parcial)
- Safari (no soportado)

Fallback: Selección múltiple de archivos
```

## Extensiones Futuras

### Posibles Mejoras

```markdown
- [ ] Web Workers para procesamiento paralelo
- [ ] Soporte para formatos AVIF, HEIC
- [ ] Procesamiento de video (frames)
- [ ] Opciones de compresión lossless
- [ ] Integración con cloud storage
- [ ] Progressive Web App (PWA)
- [ ] Service Worker para offline
- [ ] Compartir como target nativo
```

## Debugging

### Herramientas Recomendadas

```javascript
// Ver caché de miniaturas
console.log(converter.thumbnailCache)

// Ver filtros aplicados
console.log(converter.fileFilters)

// Ver historial
console.log(JSON.parse(localStorage.conversionHistory))

// Medir rendimiento
console.time('procesamiento')
await converter.processImages()
console.timeEnd('procesamiento')
```

## Recursos

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [JSZip Documentation](https://stuk.github.io/jszip/)
- [Can I Use - CSS Filters](https://caniuse.com/css-filters)