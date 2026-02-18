# FAQ - Preguntas Frecuentes

## General

### ¿Es seguro usar esta aplicación?

**Sí, completamente seguro.** Todo el procesamiento ocurre en tu navegador. Las imágenes nunca se envían a ningún servidor externo. Ni siquiera necesitas conexión a internet después de cargar la página.

### ¿Por qué usar WebP?

WebP ofrece:
- **Mejor compresión**: Archivos 25-35% más pequeños que JPEG
- **Calidad superior**: Menos artefactos a igual tamaño
- **Transparencia**: Como PNG pero mucho más pequeño
- **Animación**: Soporte para imágenes animadas
- **Soporte universal**: Todos los navegadores modernos lo soportan

### ¿Funciona sin internet?

Sí, una vez cargada la página puedes usarla offline. Solo necesitas conexión para:
- Cargar la aplicación inicialmente
- Descargar las librerías (JSZip, Font Awesome)

## Uso

### ¿Cuál es el tamaño máximo de archivo?

El límite es **50 MB por archivo**. Esto es para evitar problemas de memoria en el navegador. Si necesitas procesar imágenes más grandes, te recomendamos:
- Redimensionar primero
- Dividir en lotes más pequeños
- Usar una aplicación de escritorio

### ¿Puedo convertir varias imágenes a la vez?

¡Sí! Puedes:
- Seleccionar múltiples archivos
- Arrastrar una carpeta completa
- Procesar cientos de imágenes en un solo lote

### ¿Se pierde calidad al comprimir?

Depende del formato y la configuración:
- **WebP y JPEG**: Compresión con pérdida (ajustable)
- **PNG**: Compresión sin pérdida
- **Calidad 85-90%**: Equilibrio óptimo calidad/tamaño
- **Calidad 100%**: Mínima pérdida (archivos más grandes)

### ¿Cómo mantengo los nombres originales?

En "Patrón de nombres" selecciona: **{nombre-original} - Mantener nombre original**

### ¿Funciona en móvil?

Sí, la aplicación es responsive y funciona en:
- Android Chrome
- iOS Safari
- Navegadores móviles modernos

**Nota**: El procesamiento de muchas imágenes grandes puede ser más lento en móvil debido a limitaciones de hardware.

## Filtros y Efectos

### ¿Los filtros afectan todas las imágenes?

Por defecto, los filtros son **globales** y afectan a todas las imágenes. Pero también puedes:
- Seleccionar imágenes específicas con los checkboxes
- Hacer clic en "Aplicar a seleccionadas"

### ¿Qué es el filtro "sharpen" (nitidez)?

Aumenta el contraste entre bordes adyacentes, haciendo que la imagen se vea más nítida. Útil para:
- Imágenes ligeramente desenfocadas
- Mejorar detalles
- Compensar pérdida de nitidez por compresión

### ¿Puedo ver el resultado antes de convertir?

¡Sí! El panel de "Filtros y efectos" muestra una **vista previa en tiempo real** mientras ajustas los valores.

### ¿Cómo roto una imagen 90°?

En el panel de filtros, usa los botones:
- ↺ Rotar 90° izquierda
- ↻ Rotar 90° derecha
- 🔄 Rotar 180°

## Problemas Comunes

### "No se pudo procesar [archivo]"

Posibles causas:
- Archivo corrupto
- Formato no soportado
- Memoria insuficiente
- Navegador desactualizado

**Solución**: Intenta con otro navegador o verifica que la imagen se puede abrir normalmente.

### Las imágenes procesadas no se descargan

Verifica que:
- No tienes un bloqueador de popups activo
- Tienes espacio disponible en disco
- El navegador tiene permisos de descarga

### La aplicación se congela con muchas imágenes

Si procesas cientos de imágenes grandes:
- Reduce el número de archivos por lote (50-100)
- Cierra otras pestañas del navegador
- Usa un navegador con más memoria (Chrome/Edge)
- Considera usar una aplicación de escritorio

### El historial desapareció

El historial se guarda en:
- **localStorage** del navegador
- Se elimina si limpias datos de navegación
- No se sincroniza entre dispositivos

## Formatos

### ¿Qué formatos de entrada soporta?

Cualquier formato que tu navegador pueda decodificar:
- JPEG/JPG
- PNG
- WebP
- GIF
- BMP
- TIFF (en algunos navegadores)
- SVG (rasterizado)

### ¿Cuál es la diferencia entre WebP y JPEG?

| Característica | WebP | JPEG |
|----------------|------|------|
| Compresión | Superior | Estándar |
| Transparencia | Sí | No |
| Animación | Sí | No |
| Soporte | Moderno | Universal |
| Tamaño típico | -30% | Base |

### ¿Por qué convertir a PNG?

Usa PNG cuando necesites:
- Transparencia completa
- Compresión sin pérdida
- Texto o gráficos nítidos
- Archivos de edición

**Nota**: Los archivos PNG son generalmente más grandes que WebP.

## Configuración

### ¿Cómo cambio el tema (oscuro/claro)?

Haz clic en el ícono ☀️/🌙 en la esquina superior derecha. Tu preferencia se guarda automáticamente.

### ¿Puedo cambiar el ancho máximo por defecto?

Edita el archivo `index.html` y cambia:
```html
<input type="number" id="maxWidth" value="1920" ...>
<!-- Cambia 1920 por tu valor preferido -->
```

### ¿Cómo desactivo las animaciones?

Tu navegador puede respetar la preferencia "prefers-reduced-motion". La aplicación automáticamente reduce animaciones si detecta esta configuración.

## Rendimiento

### ¿Por qué es lento el procesamiento?

Factores que afectan la velocidad:
- **Tamaño de imagen**: Más grande = más lento
- **Cantidad**: Más imágenes = más tiempo
- **Filtros complejos**: Blur y sharpen son intensivos
- **Hardware**: CPU y RAM del dispositivo

**Consejos**:
- Redimensiona primero si no necesitas resolución completa
- Usa calidad 80-85% para mejor velocidad
- Procesa en lotes de 50-100 imágenes

### ¿Usa GPU para procesar?

Actualmente no. El procesamiento usa CPU mediante Canvas API. En el futuro podríamos agregar soporte para WebGL.

## Desarrollo

### ¿Puedo modificar el código?

¡Sí! El proyecto es open source bajo licencia MIT. Puedes:
- Fork en GitHub
- Modificar según tus necesidades
- Contribuir mejoras
- Usar en proyectos propios

### ¿Cómo reporto un bug?

1. Ve a [GitHub Issues](../../issues)
2. Crea un nuevo issue
3. Describe el problema detalladamente
4. Incluye navegador y versión
5. Si es posible, adjunta la imagen problemática

### ¿Cómo contribuyo?

Lee nuestra [Guía de Contribución](../CONTRIBUTING.md) para:
- Estándares de código
- Proceso de pull requests
- Convenciones de commits

## Privacidad

### ¿Almacenan mis imágenes?

**No.** Todo ocurre localmente en tu navegador:
- ❌ No hay servidor backend
- ❌ No hay base de datos
- ❌ No hay analytics
- ❌ No hay cookies de terceros

Solo usamos:
- localStorage para historial y preferencias
- CDN para librerías (JSZip, Font Awesome)

### ¿Qué datos se guardan?

En localStorage:
- Historial de conversiones (cantidad, tamaños, fechas)
- Preferencia de tema (oscuro/claro)
- **No** se guardan imágenes ni datos personales

---

## ¿No encuentras tu pregunta?

- 📧 Email: [tu-email@example.com]
- 🐛 GitHub Issues: [Reportar problema](../../issues)
- 💡 GitHub Discussions: [Hacer preguntas](../../discussions)

---

**Última actualización:** Febrero 2026