/**
 * @fileoverview Convertidor de Imágenes Pro v3.0
 * Aplicación web profesional para conversión, compresión y optimización de imágenes.
 *
 * @author Anderson Rivas <@johan2214>
 * @version 3.0.0
 * @license MIT
 *
 * @description
 * Esta aplicación permite convertir imágenes entre formatos WebP, JPEG y PNG,
 * aplicar filtros visuales, comprimir con control de calidad, y procesar
 * múltiples imágenes simultáneamente todo directamente en el navegador.
 *
 * @requires File API
 * @requires Canvas API
 * @requires Drag and Drop API
 * @requires LocalStorage API
 * @requires JSZip (CDN)
 * @requires Font Awesome (CDN)
 *
 * @example
 * // La aplicación se inicializa automáticamente al cargar el DOM
 * document.addEventListener('DOMContentLoaded', () => {
 *   new ImageConverterPro();
 * });
 */

/**
 * Configuración global de la aplicación
 * @constant {Object}
 * @property {number} maxFileSize - Tamaño máximo por archivo (50MB)
 * @property {number} maxConcurrent - Número máximo de procesos concurrentes
 * @property {number} thumbnailCacheSize - Tamaño máximo del caché de miniaturas
 */
const CONFIG = {
  maxFileSize: 50 * 1024 * 1024,
  maxConcurrent: 3,
  thumbnailCacheSize: 100
};

/**
 * Clase principal del Convertidor de Imágenes Pro
 * @class
 * @classdesc Gestiona todo el flujo de trabajo de conversión de imágenes incluyendo
 * carga de archivos, aplicación de filtros, procesamiento por lotes y descargas.
 *
 * @property {File[]} selectedFiles - Archivos seleccionados para procesar
 * @property {Array<Object>} processedImages - Imágenes procesadas con sus datos
 * @property {Array<Object>} conversionHistory - Historial de conversiones guardado
 * @property {boolean} isProcessing - Estado actual del procesamiento
 * @property {Map<string, string>} thumbnailCache - Caché de miniaturas generadas
 * @property {Object} filters - Filtros globales actuales
 * @property {number} previewImageIndex - Índice de imagen para preview
 * @property {Set<number>} selectedForFilters - Índices de archivos seleccionados
 * @property {Map<number, Object>} fileFilters - Filtros específicos por archivo
 */
class ImageConverterPro {
  /**
   * Crea una instancia del convertidor
   * @constructor
   */
  constructor() {
    this.selectedFiles = [];
    this.processedImages = [];
    this.conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    this.isProcessing = false;
    this.thumbnailCache = new Map();
    this.filters = { rotation: 0, filter: 'none', brightness: 100, contrast: 100, saturation: 100 };
    this.previewImageIndex = 0;
    this.selectedForFilters = new Set();
    this.fileFilters = new Map();

    this.init();
  }

  /**
   * Inicializa la aplicación configurando elementos y eventos
   * @returns {void}
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadTheme();
    this.renderHistory();
  }

  cacheElements() {
    this.dropZone = document.getElementById('dropZone');
    this.fileInput = document.getElementById('imageUpload');
    this.previewSection = document.getElementById('previewSection');
    this.previewList = document.getElementById('previewList');
    this.filtersPreviewContainer = document.getElementById('filtersPreviewContainer');
    this.filtersPreviewInfo = document.getElementById('filtersPreviewInfo');
    this.previewImageName = document.getElementById('previewImageName');
    this.applyToSelectedBtn = document.getElementById('applyToSelectedBtn');
    this.applyToAllBtn = document.getElementById('applyToAllBtn');
    this.filterRotation = document.getElementById('rotationValue');
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Drag & Drop
    this.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); this.dropZone.classList.add('dragover'); });
    this.dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); this.dropZone.classList.remove('dragover'); });
    this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));

    // Botones
    document.getElementById('selectFilesBtn').addEventListener('click', () => {
      this.fileInput.removeAttribute('webkitdirectory');
      this.fileInput.click();
    });

    document.getElementById('selectFolderBtn').addEventListener('click', () => {
      this.fileInput.setAttribute('webkitdirectory', '');
      this.fileInput.click();
    });

    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    document.getElementById('clearFilesBtn').addEventListener('click', () => this.clearSelection());
    document.getElementById('convertBtn').addEventListener('click', () => this.processImages());
    document.getElementById('downloadZipBtn').addEventListener('click', () => this.downloadAllAsZip());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Filtros
    document.querySelectorAll('.btn-rotate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rotation = parseInt(e.currentTarget.dataset.rotate);
        this.filters.rotation = (this.filters.rotation + rotation) % 360;
        this.filterRotation.textContent = `${this.filters.rotation}°`;
        this.updateFilterPreview();
      });
    });

    document.getElementById('filterType').addEventListener('change', (e) => {
      this.filters.filter = e.target.value;
      this.updateFilterPreview();
    });

    ['brightness', 'contrast', 'saturation'].forEach(id => {
      document.getElementById(id).addEventListener('input', (e) => {
        this.filters[id] = parseInt(e.target.value);
        document.getElementById(`${id}Value`).textContent = `${e.target.value}%`;
        this.updateFilterPreview();
      });
    });

    this.applyToSelectedBtn.addEventListener('click', () => this.applyFiltersToSelected());
    this.applyToAllBtn.addEventListener('click', () => this.applyFiltersToAll());
    document.getElementById('resetFiltersBtn').addEventListener('click', () => this.resetFilters());
    document.getElementById('changePreviewBtn').addEventListener('click', () => this.changePreviewImage());

    // Quality
    document.getElementById('quality').addEventListener('input', (e) => {
      document.getElementById('qualityValue').textContent = `${e.target.value}%`;
    });

    // Pattern
    document.getElementById('namingPattern').addEventListener('change', (e) => {
      document.getElementById('customPatternInput').style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
  }

  /**
   * Maneja el evento de soltar archivos en la zona de drop
   * @async
   * @param {DragEvent} e - Evento de drag and drop
   * @returns {Promise<void>}
   */
  async handleDrop(e) {
    e.preventDefault();
    this.dropZone.classList.remove('dragover');
    const items = e.dataTransfer.items;
    const files = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        if (entry.isDirectory) {
          await this.traverseDirectory(entry, files);
        } else {
          const file = await new Promise(resolve => entry.file(resolve));
          if (file) {files.push(file);}
        }
      }
    }
    this.processFiles(files);
  }

  /**
   * Recorre recursivamente un directorio para obtener todos los archivos
   * @async
   * @param {DirectoryEntry} dirEntry - Entrada del directorio a recorrer
   * @param {File[]} files - Array donde se almacenarán los archivos encontrados
   * @returns {Promise<void>}
   */
  async traverseDirectory(dirEntry, files) {
    const reader = dirEntry.createReader();
    const readEntries = () => new Promise(resolve => {
      reader.readEntries(async entries => {
        if (entries.length === 0) { resolve(); return; }
        for (const entry of entries) {
          if (entry.isDirectory) {
            await this.traverseDirectory(entry, files);
          } else {
            const file = await new Promise(resolve => entry.file(resolve));
            if (file) { file.relativePath = entry.fullPath; files.push(file); }
          }
        }
        await readEntries();
        resolve();
      });
    });
    await readEntries();
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files).map(file => {
      if (file.webkitRelativePath) {file.relativePath = '/' + file.webkitRelativePath;}
      return file;
    });
    this.processFiles(files);
  }

  /**
   * Procesa y valida los archivos seleccionados
   * @param {File[]} files - Array de archivos a procesar
   * @returns {void}
   * @description Valida que los archivos sean imágenes válidas y no excedan el tamaño máximo,
   * luego los agrega a la lista de archivos seleccionados y actualiza la UI.
   */
  processFiles(files) {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        this.showToast('warning', 'Archivo ignorado', `${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > CONFIG.maxFileSize) {
        this.showToast('warning', 'Archivo muy grande', `${file.name} excede el límite de 50MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {return;}

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    document.getElementById('convertBtn').disabled = false;
    this.applyToAllBtn.disabled = false;

    this.showToast('success', 'Archivos agregados', `${validFiles.length} imagen(es) lista(s)`);
    this.renderPreview();
    this.updateStats();
    this.updateFilterPreview();
  }

  renderPreview() {
    if (this.selectedFiles.length === 0) {
      this.previewSection.style.display = 'none';
      updateConvertButtonCount(0);
      return;
    }

    this.previewSection.style.display = 'block';
    this.previewList.innerHTML = '';

    // Actualizar badge de conteo
    updateConvertButtonCount(this.selectedFiles.length);

    this.selectedFiles.slice(0, 20).forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'preview-item';
      item.dataset.index = i;

      const isSelected = this.selectedForFilters.has(i);
      const hasFilters = this.fileFilters.has(i);

      item.innerHTML = `
        <input type="checkbox" class="preview-checkbox" data-index="${i}" ${isSelected ? 'checked' : ''}>
        ${hasFilters ? '<div class="filter-indicator"><i class="fas fa-magic"></i></div>' : ''}
        <img loading="lazy" alt="${file.name}">
        <div class="preview-item-info">
          <div>${file.name}</div>
          <div>${this.formatSize(file.size)}</div>
        </div>
        <button class="preview-item-remove" data-index="${i}">
          <i class="fas fa-times"></i>
        </button>
      `;

      if (isSelected) {item.classList.add('selected-for-filters');}

      const checkbox = item.querySelector('.preview-checkbox');
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedForFilters.add(i);
          item.classList.add('selected-for-filters');
        } else {
          this.selectedForFilters.delete(i);
          item.classList.remove('selected-for-filters');
        }
        this.updateApplyButtons();
      });

      item.addEventListener('click', (e) => {
        if (!e.target.closest('input') && !e.target.closest('button')) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });

      this.loadThumbnail(file, item.querySelector('img'));

      item.querySelector('.preview-item-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeFile(i);
      });

      this.previewList.appendChild(item);
    });

    if (this.selectedFiles.length > 20) {
      const more = document.createElement('div');
      more.className = 'preview-item';
      more.style.cssText = 'display:flex;align-items:center;justify-content:center;background:var(--bg-tertiary);';
      more.innerHTML = `<span style="color:var(--text-muted)">+${this.selectedFiles.length - 20} más...</span>`;
      this.previewList.appendChild(more);
    }
  }

  async loadThumbnail(file, img) {
    const key = file.name + file.size;
    if (this.thumbnailCache.has(key)) {
      img.src = this.thumbnailCache.get(key);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 150;
        const { width, height } = this.calculateDimensions(image.width, image.height, maxSize);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        const thumb = canvas.toDataURL('image/jpeg', 0.7);
        if (this.thumbnailCache.size < CONFIG.thumbnailCacheSize) {
          this.thumbnailCache.set(key, thumb);
        }
        img.src = thumb;
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  updateFilterPreview() {
    if (this.selectedFiles.length === 0) {
      this.filtersPreviewContainer.innerHTML = `
        <div class="filters-preview-placeholder">
          <i class="fas fa-image"></i>
          <p>Selecciona imágenes para ver la vista previa</p>
        </div>
      `;
      this.filtersPreviewInfo.style.display = 'none';
      return;
    }

    // Usar primera imagen o la seleccionada para preview
    const file = this.selectedFiles[this.previewImageIndex] || this.selectedFiles[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const { width, height } = this.calculateDimensions(img.width, img.height, 400);

        if (this.filters.rotation === 90 || this.filters.rotation === 270) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((this.filters.rotation * Math.PI) / 180);
        ctx.filter = this.getCSSFilter();
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();

        this.filtersPreviewContainer.innerHTML = '';
        const previewImg = document.createElement('img');
        previewImg.src = canvas.toDataURL();
        previewImg.alt = 'Vista previa';
        this.filtersPreviewContainer.appendChild(previewImg);

        this.previewImageName.textContent = file.name;
        this.filtersPreviewInfo.style.display = 'flex';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  changePreviewImage() {
    if (this.selectedFiles.length === 0) {return;}
    this.previewImageIndex = (this.previewImageIndex + 1) % Math.min(this.selectedFiles.length, 5);
    this.updateFilterPreview();
  }

  getCSSFilter() {
    const filters = [];
    if (this.filters.filter === 'grayscale') {filters.push('grayscale(100%)');}
    if (this.filters.filter === 'sepia') {filters.push('sepia(100%)');}
    if (this.filters.filter === 'blur') {filters.push('blur(5px)');}
    filters.push(`brightness(${this.filters.brightness}%)`);
    filters.push(`contrast(${this.filters.contrast}%)`);
    filters.push(`saturate(${this.filters.saturation}%)`);
    return filters.join(' ');
  }

  updateApplyButtons() {
    this.applyToSelectedBtn.disabled = this.selectedForFilters.size === 0;
  }

  applyFiltersToSelected() {
    this.selectedForFilters.forEach(index => {
      this.fileFilters.set(index, { ...this.filters });
    });
    this.showToast('success', 'Filtros aplicados', `Aplicados a ${this.selectedForFilters.size} imagen(es)`);
    this.renderPreview();
  }

  applyFiltersToAll() {
    this.selectedFiles.forEach((_, index) => {
      this.fileFilters.set(index, { ...this.filters });
    });
    this.showToast('success', 'Filtros aplicados', 'Aplicados a todas las imágenes');
    this.renderPreview();
  }

  resetFilters() {
    this.filters = { rotation: 0, filter: 'none', brightness: 100, contrast: 100, saturation: 100 };
    this.filterRotation.textContent = '0°';
    document.getElementById('filterType').value = 'none';
    document.getElementById('brightness').value = 100;
    document.getElementById('brightnessValue').textContent = '100%';
    document.getElementById('contrast').value = 100;
    document.getElementById('contrastValue').textContent = '100%';
    document.getElementById('saturation').value = 100;
    document.getElementById('saturationValue').textContent = '100%';
    this.updateFilterPreview();
    this.showToast('info', 'Filtros restablecidos', 'Valores por defecto restaurados');
  }

  /**
   * Procesa todas las imágenes seleccionadas
   * @async
   * @returns {Promise<void>}
   * @description Inicia el procesamiento por lotes de todas las imágenes seleccionadas,
   * aplicando los filtros y configuraciones especificadas. Muestra progreso en tiempo real
   * y actualiza las estadísticas al finalizar.
   * @throws {Error} Si ocurre un error durante el procesamiento de una imagen
   */
  async processImages() {
    if (this.selectedFiles.length === 0) {
      this.showToast('warning', 'Sin archivos', 'Selecciona al menos una imagen');
      return;
    }

    this.isProcessing = true;
    this.processedImages = [];

    const maxWidth = parseInt(document.getElementById('maxWidth').value) || 1920;
    const quality = parseInt(document.getElementById('quality').value) / 100;
    const format = document.getElementById('outputFormat').value;
    const maintainStructure = document.getElementById('maintainStructure').checked;

    document.getElementById('gallery').innerHTML = '';
    document.getElementById('progressSection').classList.add('active');
    document.getElementById('convertBtn').disabled = true;

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.updateProgress(i, this.selectedFiles.length, this.selectedFiles[i].name);

      try {
        // Usar filtros específicos del archivo o los globales
        const fileFilters = this.fileFilters.get(i) || this.filters;
        const result = await this.processSingleFile(this.selectedFiles[i], i, maxWidth, quality, format, maintainStructure, fileFilters);
        this.processedImages.push(result);
        this.addImageToGallery(result, i);
      } catch (error) {
        console.error('Error:', error);
        this.showToast('error', 'Error', `No se pudo procesar ${this.selectedFiles[i].name}`);
      }
    }

    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressPercentage').textContent = '100%';
    document.getElementById('progressPhase').textContent = 'Completado';

    const originalSize = this.processedImages.reduce((a, b) => a + b.originalSize, 0);
    const compressedSize = this.processedImages.reduce((a, b) => a + b.size, 0);
    this.addToHistory(this.selectedFiles.length, originalSize, compressedSize);

    this.showToast('success', 'Conversión completada', `${this.processedImages.length} imagen(es) procesadas`);
    this.isProcessing = false;
    document.getElementById('convertBtn').disabled = false;
    this.updateFinalStats(originalSize, compressedSize);

    // Ocultar progreso y mostrar resultados
    document.getElementById('progressSection').style.display = 'none';
    showResults(this.processedImages.length, originalSize, compressedSize);

    this.clearSelection();
  }

  /**
   * Procesa una imagen individual aplicando filtros y compresión
   * @async
   * @param {File} file - Archivo de imagen a procesar
   * @param {number} index - Índice del archivo en el array
   * @param {number} maxWidth - Ancho máximo para redimensionar
   * @param {number} quality - Calidad de compresión (0-1)
   * @param {string} format - Formato de salida (webp, jpeg, png)
   * @param {boolean} maintainStructure - Mantener estructura de carpetas
   * @param {Object} fileFilters - Filtros específicos para esta imagen
   * @param {number} fileFilters.rotation - Grados de rotación
   * @param {string} fileFilters.filter - Tipo de filtro (none, grayscale, sepia, blur)
   * @param {number} fileFilters.brightness - Brillo (0-200)
   * @param {number} fileFilters.contrast - Contraste (0-200)
   * @param {number} fileFilters.saturation - Saturación (0-200)
   * @returns {Promise<Object>} Objeto con datos de la imagen procesada
   * @property {string} originalName - Nombre original del archivo
   * @property {string} name - Nuevo nombre con extensión
   * @property {string} relativePath - Ruta relativa (si aplica)
   * @property {string} originalDataUrl - Data URL de imagen original
   * @property {string} dataUrl - Data URL de imagen procesada
   * @property {number} originalSize - Tamaño original en bytes
   * @property {number} size - Tamaño procesado en bytes
   * @property {number} originalWidth - Ancho original
   * @property {number} originalHeight - Alto original
   * @property {number} width - Ancho final
   * @property {number} height - Alto final
   * @throws {Error} Si hay error al leer o procesar la imagen
   */
  async processSingleFile(file, index, maxWidth, quality, format, maintainStructure, fileFilters) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const originalDataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const rotation = fileFilters.rotation;
            const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth);

            if (rotation === 90 || rotation === 270) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);

            const filters = [];
            if (fileFilters.filter === 'grayscale') {filters.push('grayscale(100%)');}
            if (fileFilters.filter === 'sepia') {filters.push('sepia(100%)');}
            if (fileFilters.filter === 'blur') {filters.push('blur(5px)');}
            filters.push(`brightness(${fileFilters.brightness}%)`);
            filters.push(`contrast(${fileFilters.contrast}%)`);
            filters.push(`saturate(${fileFilters.saturation}%)`);
            ctx.filter = filters.join(' ');

            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();

            let mimeType = 'image/webp', extension = 'webp';
            if (format === 'jpeg') { mimeType = 'image/jpeg'; extension = 'jpg'; }
            if (format === 'png') { mimeType = 'image/png'; extension = 'png'; }

            const dataUrl = canvas.toDataURL(mimeType, quality);
            const size = Math.round((dataUrl.split(',')[1].length * 3) / 4);

            resolve({
              originalName: file.name,
              name: `${file.name.replace(/\.[^/.]+$/, '')}.${extension}`,
              relativePath: maintainStructure && file.relativePath ? file.relativePath.replace(/\/[^/]*$/, '') : '',
              originalDataUrl,
              dataUrl,
              originalSize: file.size,
              size,
              originalWidth: img.width,
              originalHeight: img.height,
              width: rotation === 90 || rotation === 270 ? height : width,
              height: rotation === 90 || rotation === 270 ? width : height
            });
          } catch (error) { reject(error); }
        };
        img.onerror = () => reject(new Error('Error cargando imagen'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsDataURL(file);
    });
  }

  calculateDimensions(originalWidth, originalHeight, maxWidth) {
    let width = originalWidth, height = originalHeight;
    if (width > maxWidth || height > maxWidth) {
      const ratio = Math.min(maxWidth / width, maxWidth / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    return { width, height };
  }

  updateProgress(current, total, fileName) {
    const pct = Math.round((current / total) * 100);
    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressPercentage').textContent = `${pct}%`;
    document.getElementById('progressCount').textContent = `${current + 1}/${total}`;
    document.getElementById('currentFile').textContent = `Procesando: ${fileName}`;
  }

  addImageToGallery(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animation = `fadeIn 0.3s ease ${index * 0.1}s both`;

    const savings = ((1 - image.size / image.originalSize) * 100).toFixed(1);

    item.innerHTML = `
      <div class="image-preview">
        <img src="${image.dataUrl}" alt="${image.name}" loading="lazy">
        <button class="compare-btn" data-index="${index}">
          <i class="fas fa-exchange-alt"></i> Comparar
        </button>
      </div>
      <div class="image-info">
        <div class="image-name" title="${image.name}">${image.name}</div>
        <div class="image-dimensions">${image.width}×${image.height} px</div>
        <div class="size-comparison">
          <span class="size-original">${this.formatSize(image.originalSize)}</span>
          <i class="fas fa-arrow-right size-arrow"></i>
          <span class="size-compressed">${this.formatSize(image.size)}</span>
          <span class="savings-badge">-${savings}%</span>
        </div>
        <a href="${image.dataUrl}" download="${image.name}" class="download-btn">
          <i class="fas fa-download"></i> Descargar
        </a>
      </div>
    `;

    item.querySelector('.compare-btn').addEventListener('click', () => this.showComparison(image));
    document.getElementById('gallery').appendChild(item);
  }

  showComparison(image) {
    const modal = document.getElementById('compareModal');
    const originalImg = document.getElementById('compareOriginal');
    const compressedImg = document.getElementById('compareCompressed');
    const slider = document.getElementById('compareSlider');

    originalImg.src = image.originalDataUrl;
    compressedImg.src = image.dataUrl;
    document.getElementById('compareOriginalInfo').textContent = `${image.originalWidth}×${image.originalHeight}px • ${this.formatSize(image.originalSize)}`;
    document.getElementById('compareCompressedInfo').textContent = `${image.width}×${image.height}px • ${this.formatSize(image.size)}`;

    modal.style.display = 'flex';

    // Configurar slider interactivo
    let isDragging = false;

    const updateSlider = (clientX) => {
      const container = modal.querySelector('.compare-images');
      const rect = container.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      slider.style.left = `${percentage}%`;
      originalImg.style.width = `${percentage}%`;
      slider.setAttribute('aria-valuenow', Math.round(percentage));
    };

    // Eventos del mouse
    const handleMouseMove = (e) => {
      if (!isDragging) {return;}
      updateSlider(e.clientX);
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      e.preventDefault();
    });

    // Eventos táctiles
    const handleTouchMove = (e) => {
      if (!isDragging) {return;}
      updateSlider(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      isDragging = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    slider.addEventListener('touchstart', () => {
      isDragging = true;
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }, { passive: true });

    // Click en la imagen para saltar
    modal.querySelector('.compare-images').addEventListener('click', (e) => {
      if (e.target !== slider && !slider.contains(e.target)) {
        updateSlider(e.clientX);
      }
    });

    // Centrar inicialmente
    setTimeout(() => {
      const container = modal.querySelector('.compare-images');
      const rect = container.getBoundingClientRect();
      updateSlider(rect.left + rect.width / 2);
    }, 100);
  }

  formatSize(bytes) {
    if (bytes === 0) {return '0 B';}
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  updateStats() {
    document.getElementById('totalImages').textContent = this.selectedFiles.length;
    const totalSize = this.selectedFiles.reduce((a, b) => a + b.size, 0);
    document.getElementById('originalSize').textContent = this.formatSize(totalSize);

    // Actualizar estadísticas rápidas del preview
    updateQuickStats(this.selectedFiles.length, totalSize);
  }

  updateFinalStats(originalSize, compressedSize) {
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    document.getElementById('compressedSize').textContent = this.formatSize(compressedSize);
    document.getElementById('savingsPercent').textContent = `${savings}%`;
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    this.selectedForFilters.delete(index);
    // Reindexar los filtros guardados
    const newFilters = new Map();
    this.fileFilters.forEach((filters, oldIndex) => {
      if (oldIndex < index) {newFilters.set(oldIndex, filters);}
      else if (oldIndex > index) {newFilters.set(oldIndex - 1, filters);}
    });
    this.fileFilters = newFilters;
    this.renderPreview();
    this.updateStats();
    if (this.selectedFiles.length === 0) {
      document.getElementById('convertBtn').disabled = true;
      this.applyToAllBtn.disabled = true;
    }
  }

  clearSelection() {
    this.selectedFiles = [];
    this.selectedForFilters.clear();
    this.fileFilters.clear();
    this.previewImageIndex = 0;
    this.fileInput.value = '';
    this.renderPreview();
    this.updateStats();
    document.getElementById('convertBtn').disabled = true;
    this.applyToAllBtn.disabled = true;
    this.applyToSelectedBtn.disabled = true;
    this.updateFilterPreview();
    this.showToast('info', 'Selección limpiada', 'Todos los archivos eliminados');
  }

  clearAll() {
    this.selectedFiles = [];
    this.processedImages = [];
    this.selectedForFilters.clear();
    this.fileFilters.clear();
    this.previewImageIndex = 0;
    this.fileInput.value = '';
    document.getElementById('gallery').innerHTML = '';
    this.previewSection.style.display = 'none';
    document.getElementById('progressSection').classList.remove('active');
    document.getElementById('convertBtn').disabled = true;
    this.applyToAllBtn.disabled = true;
    this.applyToSelectedBtn.disabled = true;
    this.updateStats();
    document.getElementById('compressedSize').textContent = '0 MB';
    document.getElementById('savingsPercent').textContent = '0%';
    this.updateFilterPreview();
    this.showToast('info', 'Limpio', 'Todo eliminado');
  }

  async downloadAllAsZip() {
    if (this.processedImages.length === 0) {
      this.showToast('warning', 'Sin imágenes', 'No hay imágenes para descargar');
      return;
    }

    this.showToast('info', 'Creando ZIP', 'Generando archivo...');

    try {
      const zip = new JSZip();
      const maintainStructure = document.getElementById('maintainStructure').checked;

      this.processedImages.forEach(img => {
        const base64Data = img.dataUrl.split(',')[1];
        let path = img.name;
        if (maintainStructure && img.relativePath) {path = img.relativePath + '/' + img.name;}
        zip.file(path, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imagenes-convertidas-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);

      this.showToast('success', 'ZIP descargado', 'Todas las imágenes comprimidas');
    } catch (error) {
      this.showToast('error', 'Error', 'No se pudo crear el ZIP');
    }
  }

  addToHistory(count, originalSize, compressedSize) {
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      count,
      originalSize,
      compressedSize,
      savings: originalSize - compressedSize,
      savingsPercent: savings,
      format: document.getElementById('outputFormat').value
    };

    this.conversionHistory.unshift(historyItem);
    if (this.conversionHistory.length > 20) {this.conversionHistory = this.conversionHistory.slice(0, 20);}
    localStorage.setItem('conversionHistory', JSON.stringify(this.conversionHistory));
    this.renderHistory();
  }

  renderHistory() {
    const list = document.getElementById('historyList');
    const emptyState = document.getElementById('historyEmpty');

    if (this.conversionHistory.length === 0) {
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      // Limpiar items anteriores excepto el empty state
      Array.from(list.children).forEach(child => {
        if (child.id !== 'historyEmpty') {
          child.remove();
        }
      });
      return;
    }

    // Ocultar empty state
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    // Limpiar items anteriores excepto el empty state
    Array.from(list.children).forEach(child => {
      if (child.id !== 'historyEmpty') {
        child.remove();
      }
    });

    // Renderizar items (máximo 10)
    this.conversionHistory.slice(0, 10).forEach(item => {
      const date = new Date(item.date);
      const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-info">
          <div class="history-icon"><i class="fas fa-image"></i></div>
          <div class="history-details">
            <h4>${item.count} imagen(es) ${item.format.toUpperCase()}</h4>
            <p>${dateStr}</p>
          </div>
        </div>
        <div class="history-stats">
          <div class="history-stat">
            <span class="history-stat-value">${this.formatSize(item.originalSize)}</span>
            <span class="history-stat-label">Original</span>
          </div>
          <div class="history-stat">
            <span class="history-stat-value">${this.formatSize(item.compressedSize)}</span>
            <span class="history-stat-label">Final</span>
          </div>
          <div class="history-stat">
            <span class="history-stat-value">-${item.savingsPercent}%</span>
            <span class="history-stat-label">Ahorro</span>
          </div>
        </div>
      `;
      list.appendChild(historyItem);
    });
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelector('#themeToggle i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('#themeToggle i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    this.showToast('info', 'Tema cambiado', `Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  }

  showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };

    toast.innerHTML = `
      <i class="fas ${icons[type]}"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }
}

// ============================================
// FUNCIONES ADICIONALES UX/UI
// ============================================

/**
 * Sistema de Tabs
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Remover active de todos los tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Agregar active al tab seleccionado
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      document.getElementById(`${tabName}-tab`).classList.add('active');

      // Guardar preferencia
      localStorage.setItem('activeTab', tabName);
    });
  });

  // Restaurar tab activo
  const savedTab = localStorage.getItem('activeTab') || 'config';
  const savedTabButton = document.querySelector(`[data-tab="${savedTab}"]`);
  if (savedTabButton) {
    savedTabButton.click();
  }
}

/**
 * Presets de filtros
 */
function initFilterPresets() {
  const presetButtons = document.querySelectorAll('.preset-btn');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover active de todos los presets
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.dataset.preset;
      applyFilterPreset(preset);
    });
  });
}

/**
 * Aplica un preset de filtro
 * @param {string} preset - Nombre del preset
 */
function applyFilterPreset(preset) {
  const presets = {
    none: { filter: 'none', brightness: 100, contrast: 100, saturation: 100, rotation: 0 },
    grayscale: { filter: 'grayscale', brightness: 100, contrast: 100, saturation: 100, rotation: 0 },
    sepia: { filter: 'sepia', brightness: 100, contrast: 100, saturation: 100, rotation: 0 },
    vintage: { filter: 'sepia', brightness: 90, contrast: 110, saturation: 80, rotation: 0 }
  };

  const settings = presets[preset];
  if (settings) {
    // Actualizar controles
    document.getElementById('filterType').value = settings.filter;
    document.getElementById('brightness').value = settings.brightness;
    document.getElementById('contrast').value = settings.contrast;
    document.getElementById('saturation').value = settings.saturation;

    // Actualizar valores mostrados
    document.getElementById('brightnessValue').textContent = `${settings.brightness}%`;
    document.getElementById('contrastValue').textContent = `${settings.contrast}%`;
    document.getElementById('saturationValue').textContent = `${settings.saturation}%`;
    document.getElementById('rotationValue').textContent = `${settings.rotation}°`;

    // Actualizar vista previa si existe
    if (window.imageConverter) {
      window.imageConverter.filters = { ...window.imageConverter.filters, ...settings };
      window.imageConverter.updateFilterPreview();
    }

    // Mostrar badge si no es "none"
    const badge = document.getElementById('filtersBadge');
    if (preset !== 'none') {
      badge.style.display = 'inline-block';
      document.getElementById('filterStatus').style.display = 'flex';
    } else {
      badge.style.display = 'none';
      document.getElementById('filterStatus').style.display = 'none';
    }
  }
}

/**
 * Muestra la sección de resultados
 */
function showResults(count, originalSize, compressedSize) {
  const resultsSection = document.getElementById('resultsSection');
  const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  // Actualizar stats
  document.getElementById('resultCount').textContent = `${count} imagen${count !== 1 ? 'es' : ''}`;
  document.getElementById('resultSizes').textContent = `${formatSize(originalSize)} → ${formatSize(compressedSize)}`;
  document.getElementById('resultSavings').textContent = `-${savings}%`;

  // Mostrar sección
  resultsSection.style.display = 'block';

  // Scroll suave
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/**
 * Oculta la sección de resultados
 */
function hideResults() {
  document.getElementById('resultsSection').style.display = 'none';
}

/**
 * Formatea tamaño en bytes a unidades legibles
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
function formatSize(bytes) {
  if (bytes === 0) {return '0 B';}
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Actualiza el badge de conteo en el botón de conversión
 * @param {number} count - Número de archivos
 */
function updateConvertButtonCount(count) {
  const countSpan = document.getElementById('convertCount');
  const badge = document.getElementById('fileCountBadge');

  if (count > 0) {
    countSpan.textContent = `(${count})`;
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    countSpan.textContent = '';
    badge.style.display = 'none';
  }
}

/**
 * Actualiza las estadísticas rápidas del preview
 * @param {number} count - Número de archivos
 * @param {number} totalSize - Tamaño total en bytes
 */
function updateQuickStats(count, totalSize) {
  document.getElementById('quickTotalFiles').textContent = count;
  document.getElementById('quickTotalSize').textContent = formatSize(totalSize);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar convertidor
  window.imageConverter = new ImageConverterPro();

  // Inicializar tabs
  initTabs();

  // Inicializar presets de filtros
  initFilterPresets();

  // Eventos del modal de comparación
  const compareModal = document.getElementById('compareModal');

  // Cerrar con el botón X
  compareModal.querySelector('.close-modal').addEventListener('click', () => {
    compareModal.style.display = 'none';
  });

  // Cerrar al hacer click fuera del contenido
  compareModal.addEventListener('click', (e) => {
    if (e.target === compareModal) {
      compareModal.style.display = 'none';
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && compareModal.style.display === 'flex') {
      compareModal.style.display = 'none';
    }
  });

  // Evento para limpiar resultados
  document.getElementById('clearResultsBtn')?.addEventListener('click', () => {
    hideResults();
    window.imageConverter.clearAll();
  });
});
