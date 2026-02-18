# API Documentation

Documentación de la API pública del Convertidor de Imágenes Pro.

## Clase: ImageConverterPro

### Constructor

```javascript
const converter = new ImageConverterPro();
```

Inicializa automáticamente la aplicación y carga el estado guardado.

---

## Propiedades Públicas

### `selectedFiles` 
**Tipo:** `File[]`

Array de archivos seleccionados para procesar.

```javascript
// Acceder a archivos seleccionados
console.log(converter.selectedFiles.length);
console.log(converter.selectedFiles[0].name);
```

### `processedImages`
**Tipo:** `Array<Object>`

Imágenes que han sido procesadas exitosamente.

```javascript
// Estructura de cada objeto
{
  originalName: "foto.jpg",
  name: "foto.webp",
  relativePath: "/carpeta/subcarpeta",
  originalDataUrl: "data:image/jpeg;base64,...",
  dataUrl: "data:image/webp;base64,...",
  originalSize: 2048576,
  size: 512000,
  originalWidth: 1920,
  originalHeight: 1080,
  width: 1920,
  height: 1080
}
```

### `conversionHistory`
**Tipo:** `Array<Object>`

Historial de conversiones (persistido en localStorage).

```javascript
// Ver última conversión
const last = converter.conversionHistory[0];
console.log(`${last.count} imágenes, ${last.savingsPercent}% de ahorro`);
```

### `filters`
**Tipo:** `Object`

Filtros globales actualmente configurados.

```javascript
{
  rotation: 0,           // 0, 90, 180, 270
  filter: 'none',        // 'none', 'grayscale', 'sepia', 'blur'
  brightness: 100,       // 0-200
  contrast: 100,         // 0-200
  saturation: 100        // 0-200
}
```

---

## Métodos Públicos

### `processFiles(files)`

Procesa y valida archivos seleccionados.

**Parámetros:**
- `files` (`File[]`): Array de objetos File

**Retorna:** `void`

**Ejemplo:**
```javascript
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
  converter.processFiles(Array.from(e.target.files));
});
```

---

### `async processImages()`

Inicia el procesamiento de todas las imágenes seleccionadas.

**Parámetros:** Ninguno

**Retorna:** `Promise<void>`

**Ejemplo:**
```javascript
document.getElementById('convertBtn').addEventListener('click', async () => {
  try {
    await converter.processImages();
    console.log('¡Conversión completada!');
  } catch (error) {
    console.error('Error:', error);
  }
});
```

**Notas:**
- Lee configuración de los controles de UI
- Muestra progreso en tiempo real
- Actualiza estadísticas automáticamente
- Limpia selección al completar

---

### `async processSingleFile(file, index, maxWidth, quality, format, maintainStructure, fileFilters)`

Procesa una imagen individual.

**Parámetros:**
- `file` (`File`): Archivo de imagen
- `index` (`number`): Índice en el array
- `maxWidth` (`number`): Ancho máximo (px)
- `quality` (`number`): Calidad 0-1
- `format` (`string`): 'webp', 'jpeg', 'png'
- `maintainStructure` (`boolean`): Mantener carpetas
- `fileFilters` (`Object`): Filtros específicos

**Retorna:** `Promise<Object>`

**Ejemplo:**
```javascript
const result = await converter.processSingleFile(
  file,
  0,
  1920,
  0.85,
  'webp',
  true,
  { rotation: 90, filter: 'grayscale', brightness: 100, contrast: 100, saturation: 100 }
);

console.log(`Original: ${result.originalSize} bytes`);
console.log(`Procesada: ${result.size} bytes`);
```

---

### `applyFiltersToSelected()`

Aplica los filtros globales a las imágenes seleccionadas.

**Parámetros:** Ninguno

**Retorna:** `void`

**Ejemplo:**
```javascript
// Seleccionar imágenes primero
converter.selectedForFilters.add(0);
converter.selectedForFilters.add(2);

// Configurar filtros
converter.filters.rotation = 90;
converter.filters.filter = 'sepia';

// Aplicar
converter.applyFiltersToSelected();
```

---

### `applyFiltersToAll()`

Aplica los filtros globales a todas las imágenes.

**Parámetros:** Ninguno

**Retorna:** `void`

---

### `resetFilters()`

Restablece todos los filtros a valores por defecto.

**Parámetros:** Ninguno

**Retorna:** `void`

---

### `clearSelection()`

Limpia la selección actual de archivos.

**Parámetros:** Ninguno

**Retorna:** `void`

---

### `clearAll()`

Limpia todo: selección, imágenes procesadas, galería y estadísticas.

**Parámetros:** Ninguno

**Retorna:** `void`

---

### `async downloadAllAsZip()`

Descarga todas las imágenes procesadas como archivo ZIP.

**Parámetros:** Ninguno

**Retorna:** `Promise<void>`

**Ejemplo:**
```javascript
document.getElementById('downloadZip').addEventListener('click', () => {
  converter.downloadAllAsZip();
});
```

---

### `showToast(type, title, message)`

Muestra una notificación toast.

**Parámetros:**
- `type` (`string`): 'success', 'error', 'warning', 'info'
- `title` (`string`): Título de la notificación
- `message` (`string`): Mensaje descriptivo

**Retorna:** `void`

**Ejemplo:**
```javascript
converter.showToast('success', '¡Listo!', 'Imágenes procesadas correctamente');
converter.showToast('error', 'Error', 'No se pudo procesar la imagen');
```

---

### `formatSize(bytes)`

Formatea bytes a unidades legibles.

**Parámetros:**
- `bytes` (`number`): Tamaño en bytes

**Retorna:** `string`

**Ejemplo:**
```javascript
converter.formatSize(1024);        // "1 KB"
converter.formatSize(1536000);     // "1.46 MB"
converter.formatSize(0);           // "0 B"
```

---

### `calculateDimensions(originalWidth, originalHeight, maxWidth)`

Calcula dimensiones manteniendo proporción.

**Parámetros:**
- `originalWidth` (`number`): Ancho original
- `originalHeight` (`number`): Alto original
- `maxWidth` (`number`): Ancho máximo permitido

**Retorna:** `Object` `{ width, height }`

**Ejemplo:**
```javascript
const dims = converter.calculateDimensions(4000, 3000, 1920);
console.log(dims);  // { width: 1920, height: 1440 }
```

---

## Eventos

La clase no dispara eventos personalizados, pero puedes extenderla:

```javascript
class ExtendedConverter extends ImageConverterPro {
  async processImages() {
    // Emitir evento antes
    window.dispatchEvent(new CustomEvent('conversion:start'));
    
    await super.processImages();
    
    // Emitir evento después
    window.dispatchEvent(new CustomEvent('conversion:end', {
      detail: { count: this.processedImages.length }
    }));
  }
}
```

---

## Constantes

### CONFIG

Objeto de configuración global.

```javascript
CONFIG.maxFileSize        // 52428800 (50MB)
CONFIG.maxConcurrent      // 3
CONFIG.thumbnailCacheSize // 100
```

---

## Ejemplos de Uso

### Ejemplo 1: Conversión Simple

```javascript
const converter = new ImageConverterPro();

// Simular selección de archivo
const file = new File([''], 'imagen.jpg', { type: 'image/jpeg' });
converter.processFiles([file]);

// Configurar y convertir
document.getElementById('outputFormat').value = 'webp';
document.getElementById('quality').value = '85';

await converter.processImages();
```

### Ejemplo 2: Filtros Personalizados

```javascript
// Aplicar filtros a imágenes específicas
converter.selectedForFilters.add(0);
converter.selectedForFilters.add(1);

// Configurar
converter.filters = {
  rotation: 90,
  filter: 'grayscale',
  brightness: 120,
  contrast: 110,
  saturation: 80
};

// Aplicar
converter.applyFiltersToSelected();
```

### Ejemplo 3: Integración con API de Historial

```javascript
// Obtener estadísticas del historial
const stats = converter.conversionHistory.reduce((acc, item) => {
  acc.totalImages += item.count;
  acc.totalSaved += item.savings;
  return acc;
}, { totalImages: 0, totalSaved: 0 });

console.log(`Total procesadas: ${stats.totalImages}`);
console.log(`Espacio ahorrado: ${converter.formatSize(stats.totalSaved)}`);
```

---

## TypeScript Definitions

Para usar con TypeScript:

```typescript
interface ProcessedImage {
  originalName: string;
  name: string;
  relativePath: string;
  originalDataUrl: string;
  dataUrl: string;
  originalSize: number;
  size: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
}

interface FilterSettings {
  rotation: number;
  filter: 'none' | 'grayscale' | 'sepia' | 'blur';
  brightness: number;
  contrast: number;
  saturation: number;
}

declare class ImageConverterPro {
  selectedFiles: File[];
  processedImages: ProcessedImage[];
  conversionHistory: any[];
  filters: FilterSettings;
  
  processFiles(files: File[]): void;
  processImages(): Promise<void>;
  processSingleFile(
    file: File,
    index: number,
    maxWidth: number,
    quality: number,
    format: string,
    maintainStructure: boolean,
    fileFilters: FilterSettings
  ): Promise<ProcessedImage>;
  showToast(type: string, title: string, message: string): void;
  formatSize(bytes: number): string;
}
```