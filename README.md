# Convertidor de Imágenes Pro

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/johan2214/Convertidor-de-Im-genes-Pro)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

> 🖼️ Aplicación web profesional para conversión, compresión y optimización de imágenes directamente en el navegador.

![Demo Screenshot](docs/screenshot.png)

## ✨ Características

### 🎯 Funcionalidades Principales
- **Conversión de Formatos**: WebP (recomendado), JPEG, PNG
- **Compresión Inteligente**: Control de calidad ajustable (10-100%)
- **Redimensionamiento**: Ancho máximo configurable (100-8000px)
- **Procesamiento por Lotes**: Múltiples imágenes simultáneamente
- **Mantenimiento de Estructura**: Preserva la organización de carpetas

### 🎨 Filtros y Efectos
- Rotación (90°, 180°, 270°)
- Escala de grises
- Sepia
- Desenfoque (blur)
- Nitidez (sharpen)
- Ajuste de brillo (0-200%)
- Ajuste de contraste (0-200%)
- Ajuste de saturación (0-200%)

### 🚀 Características Avanzadas
- ✅ **Vista previa en tiempo real** de filtros
- ✅ **Arrastrar y soltar** archivos y carpetas completas
- ✅ **Comparación interactiva** antes/después con slider
- ✅ **Descarga masiva** en formato ZIP
- ✅ **Historial de conversiones** persistente
- ✅ **Patrones de renombrado** personalizables
- ✅ **Temas oscuro y claro**
- ✅ **Accesibilidad completa** (WCAG 2.1 AA)

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Recomendado)
1. Abre el archivo `index.html` en tu navegador
2. ¡Listo! No requiere instalación ni servidor

### Opción 2: Servidor Local (para desarrollo)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 3: GitHub Pages
1. Haz fork de este repositorio
2. Ve a Settings > Pages
3. Selecciona la rama `main`
4. Tu app estará disponible en `https://tuusuario.github.io/Convertidor-de-Im-genes-Pro`

## 📖 Guía de Uso

### 1. Cargar Imágenes
- **Arrastra y suelta** archivos o carpetas en la zona de carga
- O haz clic en **"Seleccionar archivos"** o **"Seleccionar carpeta"**

### 2. Configurar Opciones
- **Ancho máximo**: Redimensiona imágenes grandes manteniendo proporción
- **Calidad**: Ajusta entre menor tamaño o mejor calidad
- **Formato de salida**: WebP (recomendado), JPEG o PNG
- **Patrón de nombres**: Original, numeración, fecha o personalizado

### 3. Aplicar Filtros (Opcional)
- Selecciona imágenes con los checkboxes
- Ajusta filtros en el panel derecho
- Visualiza cambios en tiempo real
- Aplica a seleccionadas o a todas

### 4. Convertir y Descargar
- Haz clic en **"Convertir imágenes"**
- Espera el procesamiento
- Descarga individualmente o en **ZIP**

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Diseño moderno con variables CSS y Grid/Flexbox
- **JavaScript ES6+** - Lógica de procesamiento
  - File API - Manejo de archivos
  - Canvas API - Procesamiento de imágenes
  - Drag & Drop API - Interacción intuitiva
  - LocalStorage - Historial persistente
- **JSZip** - Generación de archivos ZIP
- **Font Awesome** - Iconografía

## 📋 Requisitos

- Navegador moderno con soporte ES6+
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- JavaScript habilitado

## 🎨 Personalización

### Temas
La aplicación incluye modo oscuro y claro. Se guarda automáticamente tu preferencia.

### Variables CSS
Puedes personalizar los colores editando las variables CSS en `style.css`:

```css
:root {
  --accent-primary: #6366f1;    /* Cambia el color principal */
  --accent-success: #10b981;    /* Cambia el color de éxito */
  /* ... más variables */
}
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) para más detalles.

### Reportar Issues
Si encuentras un bug o tienes una sugerencia:
1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con la plantilla proporcionada
3. Proporciona pasos para reproducir el problema

## 📝 Changelog

Consulta el archivo [CHANGELOG.md](CHANGELOG.md) para ver el historial de cambios.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Anderson Pérez** - [@johan2214](https://github.com/johan2214)

## 🙏 Agradecimientos

- [JSZip](https://stuk.github.io/jszip/) - Librería para generación de ZIP
- [Font Awesome](https://fontawesome.com/) - Iconos vectoriales
- Comunidad open source ❤️

---

<p align="center">
  ⭐ Si te gusta este proyecto, ¡dale una estrella!
</p>