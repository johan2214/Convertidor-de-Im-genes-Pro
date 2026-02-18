# Ejemplos de Uso

Esta guía muestra casos de uso comunes del Convertidor de Imágenes Pro.

## Tabla de Contenidos

1. [Compresión Básica](#compresión-básica)
2. [Conversión por Lotes](#conversión-por-lotes)
3. [Aplicación de Filtros](#aplicación-de-filtros)
4. [Optimización Web](#optimización-web)
5. [Organización por Carpetas](#organización-por-carpetas)
6. [Patrones de Nombres](#patrones-de-nombres)

---

## Compresión Básica

### Escenario
Tienes fotos de 5MB cada una y quieres reducir su tamaño para compartirlas por email.

### Pasos

1. **Arrastra las imágenes** a la zona de carga
2. **Configuración**:
   - Ancho máximo: `1920` (mantiene buena calidad)
   - Calidad: `85%` (balance óptimo)
   - Formato: `WebP (Recomendado)`
3. **Haz clic en "Convertir imágenes"**
4. **Descarga** como ZIP o individualmente

### Resultado esperado
- Reducción de 60-80% en tamaño
- Calidad visual prácticamente idéntica
- Fotos de ~1MB en lugar de 5MB

---

## Conversión por Lotes

### Escenario
Necesitas convertir 100 imágenes JPG a WebP para tu sitio web.

### Pasos

1. **Selecciona la carpeta** usando "Seleccionar carpeta"
2. **Verifica** que todas las imágenes aparecen en la vista previa
3. **Configuración**:
   - Ancho máximo: `1200` (para web)
   - Calidad: `80%`
   - Formato: `WebP`
   - Mantener estructura: ✅ (si tienes subcarpetas)
4. **Convierte y espera** (puede tomar unos minutos)
5. **Descarga el ZIP** con todas las imágenes

### Consejos
- Procesa en lotes de 50 si son muchas
- Usa el historial para ver el ahorro total

---

## Aplicación de Filtros

### Escenario
Quieres aplicar filtros artísticos a un grupo específico de fotos.

### Pasos

1. **Carga todas las imágenes**
2. **Selecciona** las que quieres modificar:
   - Activa los checkboxes en las miniaturas
   - O haz clic en las imágenes
3. **Ajusta filtros**:
   ```
   Rotación: 90° derecha
   Filtro: Sepia
   Brillo: 110%
   Contraste: 120%
   Saturación: 80%
   ```
4. **Vista previa** en tiempo real en el panel derecho
5. **Aplica** con "Aplicar a seleccionadas"
6. **Convierte** el lote completo

### Filtros recomendados

| Estilo | Configuración |
|--------|--------------|
| Vintage | Sepia + Brillo 90% + Contraste 110% |
| B&W Artístico | Grayscale + Contraste 150% |
| Instagram | Brillo 105% + Saturación 120% |
| Suave | Blur + Brillo 110% |

---

## Optimización Web

### Escenario
Preparar imágenes para un sitio web con carga rápida.

### Mejores prácticas

#### Para fotografías
```
Formato: WebP
Ancho máximo: 1200px
Calidad: 80%
Patrón: {nombre-original}
```

#### Para iconos/logos
```
Formato: PNG (si necesitas transparencia)
Ancho máximo: 512px
Calidad: N/A (PNG es lossless)
Patrón: {nombre-original}
```

#### Para thumbnails
```
Formato: WebP
Ancho máximo: 400px
Calidad: 70%
Patrón: thumb-{nombre-original}
```

### Ejemplo completo

1. **Prepara 3 versiones** de cada imagen:
   - Original grande (1920px, WebP 85%)
   - Versión web (1200px, WebP 80%)
   - Thumbnail (400px, WebP 70%)

2. **Usa el comparador** para verificar calidad antes de subir

3. **Resultado**:
   - Carga inicial rápida (thumbnails pequeños)
   - Calidad óptima en vista completa
   - Ahorro de 70-80% en ancho de banda

---

## Organización por Carpetas

### Escenario
Tienes imágenes organizadas en carpetas y quieres mantener esa estructura.

### Estructura de ejemplo
```
fotos/
├── 2024/
│   ├── enero/
│   │   ├── foto1.jpg
│   │   └── foto2.jpg
│   └── febrero/
│       └── foto3.jpg
└── 2023/
    └── diciembre/
        └── foto4.jpg
```

### Pasos

1. **Arrastra la carpeta "fotos"** completa
2. **Activa** "Mantener estructura de carpetas"
3. **Configura**:
   - Formato: WebP
   - Calidad: 85%
4. **Convierte**
5. **Descarga el ZIP**

### Resultado en el ZIP
```
imagenes-convertidas-1234567890.zip
├── 2024/
│   ├── enero/
│   │   ├── foto1.webp
│   │   └── foto2.webp
│   └── febrero/
│       └── foto3.webp
└── 2023/
    └── diciembre/
        └── foto4.webp
```

---

## Patrones de Nombres

### Escenario
Quieres renombrar imágenes con un formato específico.

### Opciones disponibles

#### 1. Numeración secuencial
```
Patrón: {numero}
Resultado: 1.webp, 2.webp, 3.webp...
```

#### 2. Con fecha
```
Patrón: {fecha}
Resultado: 2024-02-18_14-30-22.webp
```

#### 3. Personalizado
```
Patrón: proyecto-{numero}-{fecha}
Resultado: proyecto-1-2024-02-18.webp
```

### Variables disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{nombre}` | Nombre original | `foto` |
| `{numero}` | Número secuencial | `1`, `2`, `3`... |
| `{fecha}` | Fecha actual | `2024-02-18` |
| `{hora}` | Hora actual | `14-30-22` |
| `{dimensiones}` | Tamaño en px | `1920x1080` |

### Ejemplo avanzado

**Patrón:** `web_{nombre}_{numero}_{fecha}`

**Archivos originales:**
- `IMG_1234.jpg`
- `IMG_5678.jpg`

**Resultado:**
- `web_IMG_1234_1_2024-02-18.webp`
- `web_IMG_5678_2_2024-02-18.webp`

---

## Flujo de Trabajo Completo

### Caso: Optimizar galería de fotos para web

```
PASO 1: Preparación
├── Seleccionar 50 fotos de alta resolución
└── Organizar en carpetas por categoría

PASO 2: Configuración
├── Ancho máximo: 1200px
├── Calidad: 80%
├── Formato: WebP
├── Mantener estructura: Sí
└── Patrón: {nombre-original}

PASO 3: Filtros (opcional)
├── Seleccionar fotos que necesiten ajuste
├── Aplicar brillo 105% a fotos oscuras
└── Aplicar a seleccionadas

PASO 4: Procesamiento
├── Click en "Convertir imágenes"
├── Esperar ~2-3 minutos
└── Revisar estadísticas de ahorro

PASO 5: Descarga
├── Descargar ZIP completo
├── Descomprimir en proyecto web
└── Usar rutas relativas en HTML

RESULTADO:
├── Tamaño original: 250 MB
├── Tamaño final: 45 MB
├── Ahorro: 82%
└── Calidad: Excelente
```

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Tab` | Navegar entre controles |
| `Enter` | Activar botón seleccionado |
| `Espacio` | Toggle checkbox |
| `Escape` | Cerrar modal de comparación |
| `Ctrl + A` | Seleccionar todos los archivos (en input file) |

---

## Consejos Profesionales

### Para fotógrafos
1. Guarda siempre el original
2. Usa WebP para web, TIFF para archivo
3. Calidad 90% para portfolios, 80% para redes sociales

### Para desarrolladores web
1. Implementa lazy loading en tu sitio
2. Usa srcset para imágenes responsivas
3. Prepara múltiples tamaños de cada imagen
4. Usa el comparador para encontrar el balance óptimo

### Para diseñadores
1. PNG para elementos con transparencia
2. WebP para fotografías
3. Comprueba en múltiples dispositivos
4. Usa filtros para mantener consistencia visual

---

**¿Tienes un caso de uso específico?** Compártelo en [GitHub Discussions](../../discussions)!