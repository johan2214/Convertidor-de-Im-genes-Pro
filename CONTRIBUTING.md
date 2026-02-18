# Guía de Contribución

¡Gracias por tu interés en contribuir al Convertidor de Imágenes Pro! 🎉

## Código de Conducta

Este proyecto y todos los participantes están gobernados por nuestro compromiso de mantener un ambiente respetuoso e inclusivo.

## ¿Cómo puedo contribuir?

### Reportar Bugs

Antes de crear un issue, por favor:
1. **Busca** si el bug ya ha sido reportado
2. **Usa la plantilla** de bug reports
3. **Proporciona** información detallada:
   - Versión del navegador
   - Sistema operativo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

### Sugerir Mejoras

Las sugerencias son bienvenidas. Por favor:
1. Usa el label `enhancement`
2. Explica el problema que resuelve
3. Describe la solución propuesta
4. Considera alternativas

### Pull Requests

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nombre-feature`)
3. **Haz** tus cambios siguiendo los estándares de código
4. **Prueba** que todo funcione correctamente
5. **Commit** usando [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: ✨ agregar nuevo filtro de viñeta
   fix: 🐛 corregir error en drag and drop
   docs: 📚 actualizar README
   style: 💄 formatear código con prettier
   refactor: ♻️ simplizar función de procesamiento
   perf: ⚡ optimizar generación de thumbnails
   test: ✅ agregar tests de conversión
   chore: 🔧 actualizar dependencias
   ```
6. **Push** a tu fork (`git push origin feature/nombre-feature`)
7. **Abre** un Pull Request con descripción clara

## Estándares de Código

### HTML
- Usa HTML5 semántico
- Incluye atributos ARIA para accesibilidad
- Mantén la indentación con 2 espacios
- Cierra todas las etiquetas correctamente

### CSS
- Usa variables CSS para colores y tamaños
- Sigue la metodología BEM para clases
- Mobile-first responsive design
- Prefiere flexbox y grid

### JavaScript
- Usa ES6+ (const/let, arrow functions, etc.)
- Sigue el estilo del código existente
- Documenta funciones con JSDoc
- Maneja errores con try/catch
- Evita console.log en producción

### Ejemplo de JSDoc:
```javascript
/**
 * Procesa una imagen individual aplicando filtros y compresión
 * @param {File} file - Archivo de imagen a procesar
 * @param {number} index - Índice del archivo en el array
 * @param {number} maxWidth - Ancho máximo para redimensionar
 * @param {number} quality - Calidad de compresión (0-1)
 * @param {string} format - Formato de salida (webp, jpeg, png)
 * @returns {Promise<Object>} Objeto con datos de la imagen procesada
 */
async processSingleFile(file, index, maxWidth, quality, format) {
  // ... código
}
```

## Configuración de Desarrollo

No se requiere configuración especial. Solo necesitas:
1. Un editor de código (VS Code recomendado)
2. Un navegador moderno
3. (Opcional) Extensión Live Server para VS Code

## Estructura del Proyecto

```
Convertidor-de-Im-genes-Pro/
├── index.html          # Estructura principal
├── style.css           # Estilos y temas
├── script.js           # Lógica de la aplicación
├── README.md           # Documentación
├── LICENSE             # Licencia MIT
├── CHANGELOG.md        # Historial de cambios
└── CONTRIBUTING.md     # Esta guía
```

## Reportar Vulnerabilidades de Seguridad

Si descubres una vulnerabilidad de seguridad, por favor:
1. **NO** abras un issue público
2. Envía un email a [tu-email@example.com]
3. Describe el problema con detalle
4. Espera una respuesta antes de divulgar públicamente

## Reconocimientos

Los contribuidores serán reconocidos en:
- El archivo README.md
- Las notas de release
- La sección de contribuidores de GitHub

## ¿Preguntas?

- Revisa la [documentación](README.md)
- Abre un [issue](https://github.com/johan2214/Convertidor-de-Im-genes-Pro/issues)

¡Gracias por contribuir! 🚀