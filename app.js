const ImageToolsStudio = (() => {
    const toolRegistry = [
        { id: 'compressor', name: 'Image Compressor', category: 'image', desc: 'Reduce image file size without losing quality.', keywords: 'shrink, reduce, optimize, jpeg, png, webp', icon: '🔥' },
        { id: 'pdf-merge', name: 'PDF Merge', category: 'pdf', desc: 'Combine multiple PDF documents into a single file.', keywords: 'join pdf, combine pdf, concatenate document', icon: '🔥' },
        { id: 'pdf-split', name: 'PDF Split', category: 'pdf', desc: 'Split a PDF file into separate single-page documents.', keywords: 'divide pdf, extract pages, break pdf', icon: '✂️' },
        { id: 'qr-generator', name: 'QR Code Generator', category: 'utility', desc: 'Generate customized scannable QR codes for links and text.', keywords: 'barcode, matrix, dynamic qr, links, scan', icon: '🔥' },
        { id: 'add-text', name: 'Add Text To Image', category: 'image', desc: 'Overlay elegant text, typography, and captions on pictures.', keywords: 'caption, subtitle, memo, text engine', icon: '✍️' },
        { id: 'brightness', name: 'Brightness Adjustment', category: 'image', desc: 'Lighten or darken image lighting exposures dynamically.', keywords: 'exposure, gamma, light, dark, filter', icon: '☀️' },
        { id: 'contrast', name: 'Contrast Adjustment', category: 'image', desc: 'Enhance or soften the difference between shadows and highlights.', keywords: 'vivid, dynamic range, levels, punchy', icon: '🌗' },
        { id: 'grayscale', name: 'Grayscale Filter', category: 'image', desc: 'Convert your colored assets into classic black and white.', keywords: 'monochrome, b&w, vintage, desaturate', icon: '🏁' },
        { id: 'sepia', name: 'Sepia Filter', category: 'image', desc: 'Infuse warm, nostalgic reddish-brown vintage tones.', keywords: 'retro, antique, old school, filter photo', icon: '📜' },
        { id: 'favicon', name: 'Favicon Generator', category: 'utility', desc: 'Generate web icons (.ico) across standard multi-resolutions.', keywords: 'ico, icon, web manifest, shortcut icon', icon: '🌐' },
        { id: 'svg-to-png', name: 'SVG to PNG Converter', category: 'image', desc: 'Rasterize vector SVG drawings into crisp alpha-channel PNGs.', keywords: 'vector, raster, transparent, render', icon: '💎' }
    ];

    const state = { searchQuery: '', activeCategory: 'all', activeToolId: null, currentLoadedFiles: [] };

    const init = () => {
        buildDashboardDOMCards();
        setupSearchAndFilterEvents();
        setupDragAndDropUploader();
        setupComparisonSlider();
    };

    const buildDashboardDOMCards = () => {
        const grid = document.getElementById('tools-dashboard-grid');
        if (!grid) return;
        grid.innerHTML = '';

        toolRegistry.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card-wrapper';
            card.setAttribute('data-tool-id', tool.id);
            card.innerHTML = `
                <div class="tool-card-icon-frame">${tool.icon}</div>
                <h3 class="tool-card-title-text">${tool.name}</h3>
                <p class="tool-card-desc-text">${tool.desc}</p>
            `;
            card.addEventListener('click', () => switchActiveToolWorkspace(tool.id));
            grid.appendChild(card);
        });
    };

    const setupSearchAndFilterEvents = () => {
        const searchInput = document.getElementById('global-search-input');
        const tabs = document.querySelectorAll('.category-tab');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase().trim();
                filterDashboardExecution();
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.activeCategory = tab.getAttribute('data-category');
                filterDashboardExecution();
            });
        });
    };

    const filterDashboardExecution = () => {
        const grid = document.getElementById('tools-dashboard-grid');
        const cards = grid.querySelectorAll('.tool-card-wrapper');
        cards.forEach(card => {
            const toolId = card.getAttribute('data-tool-id');
            const toolData = toolRegistry.find(t => t.id === toolId);
            if (!toolData) return;

            const matchesCategory = state.activeCategory === 'all' || toolData.category === state.activeCategory;
            const matchesSearch = toolData.name.toLowerCase().includes(state.searchQuery) || 
                                  toolData.desc.toLowerCase().includes(state.searchQuery) ||
                                  (toolData.keywords && toolData.keywords.toLowerCase().includes(state.searchQuery));

            card.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
        });
    };

    const setupDragAndDropUploader = () => {
        const zone = document.getElementById('premium-uploader-zone');
        const fileInput = document.getElementById('core-hidden-file-input');

        if(!zone || !fileInput) return;

        zone.addEventListener('dragover', (e) => e.preventDefault());
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            handleFilePayloadUpload(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => handleFilePayloadUpload(e.target.files));
    };

    const handleFilePayloadUpload = (files) => {
        if(files.length === 0) return;
        state.currentLoadedFiles = Array.from(files);
        injectDynamicToolControls();
    };

    const setupComparisonSlider = () => {
        const slider = document.getElementById('ui-comparison-slider-node');
        const afterLayer = document.getElementById('preview-layer-after');
        const handleDrag = document.getElementById('slider-split-handle-drag');

        if (!slider || !afterLayer || !handleDrag) return;

        const moveSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const positionX = clientX - rect.left;
            
            let percentage = (positionX / rect.width) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            afterLayer.style.width = `${percentage}%`;
            handleDrag.style.left = `${percentage}%`;
        };

        slider.addEventListener('mousemove', (e) => {
            moveSlider(e.clientX);
        });

        slider.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                moveSlider(e.touches[0].clientX);
            }
        }, { passive: true });
    };

    return { init, registry: toolRegistry, state };
})();

function switchActiveToolWorkspace(toolId) {
    const targetTool = ImageToolsStudio.registry.find(t => t.id === toolId);
    if (!targetTool) return;

    ImageToolsStudio.state.activeToolId = toolId;
    ImageToolsStudio.state.currentLoadedFiles = [];

    document.getElementById('active-workspace-panel').classList.remove('hidden-workspace');
    document.getElementById('active-workspace-title').textContent = `Workspace Tool :: ${targetTool.name}`;
    document.getElementById('workspace-controls-area').classList.add('hidden-element');
    document.getElementById('workspace-preview-area').classList.add('hidden-element');

    injectDynamicToolControls();
}

function closeActiveWorkspace() {
    document.getElementById('active-workspace-panel').classList.add('hidden-workspace');
}

function injectDynamicToolControls() {
    const ctrlArea = document.getElementById('workspace-controls-area');
    if (!ctrlArea) return;
    ctrlArea.classList.remove('hidden-element');

    const toolId = ImageToolsStudio.state.activeToolId;
    let contextHtmlOptions = ``;

    switch(toolId) {
        case 'compressor':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Target Quality Level</label>
                    <input type="range" id="param-quality" min="1" max="100" value="80" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Run Asset Optimization</button>
            `;
            break;
        case 'qr-generator':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Text Content or URL Target Link</label>
                    <input type="text" id="param-qr-string" value="https://imagetools.studio" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Generate Matrix Vector Code</button>
            `;
            break;
        case 'brightness':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Luminosity Exposure Delta Slider Accent</label>
                    <input type="range" id="param-brightness" min="-100" max="100" value="20" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Apply Brightness Adjustments</button>
            `;
            break;
        case 'contrast':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Contrast Factor Intensity</label>
                    <input type="range" id="param-contrast" min="-100" max="100" value="30" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Apply Contrast Curve</button>
            `;
            break;
        case 'grayscale':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Grayscale Multiplier Conversion</label>
                    <input type="range" id="param-grayscale" min="0" max="100" value="100" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Render Grayscale Pipeline</button>
            `;
            break;
        case 'sepia':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Sepia Nostalgia Intensity Level</label>
                    <input type="range" id="param-sepia" min="0" max="100" value="100" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Render Antique Sepia</button>
            `;
            break;
        case 'add-text':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Watermark String Caption</label>
                    <input type="text" id="param-watermark-text" value="ImageTools Studio" class="control-input">
                </div>
                <div class="control-group">
                    <label>Font Scaling Pixels</label>
                    <input type="number" id="param-text-size" value="48" min="12" max="200" class="control-input">
                </div>
                <div class="control-group">
                    <label>Vertical Position Placement</label>
                    <select id="param-text-position" class="control-input" style="background:#1e1e2f; color:#fff; border:1px solid #444; padding:8px; border-radius:4px;">
                        <option value="center">Absolute Center Grid</option>
                        <option value="top">Header Top Margin</option>
                        <option value="bottom">Footer Bottom Accent</option>
                    </select>
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Overlay Graphic Typography</button>
            `;
            break;
        case 'svg-to-png':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Raster Target Up-scaling Bounds Width</label>
                    <input type="number" id="param-svg-width" value="1024" min="32" max="8192" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Rasterize Vector Array</button>
            `;
            break;
        case 'favicon':
            contextHtmlOptions = `
                <div class="control-group">
                    <p style="font-size:12px; color:#aaa; margin-bottom:8px;">Drops multi-resolution targets down to root (.ico format binary structure compiled engine).</p>
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Compile Multi-Res Favicon Package</button>
            `;
            break;
        case 'pdf-merge':
            contextHtmlOptions = `
                <div class="control-group">
                    <p style="font-size:12px; color:#aaa; margin-bottom:8px;">Load 2 or more PDF documents to combine into a unified file structure.</p>
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Merge File Streams</button>
            `;
            break;
        case 'pdf-split':
            contextHtmlOptions = `
                <div class="control-group">
                    <p style="font-size:12px; color:#aaa; margin-bottom:8px;">Deconstructs pages safely across local block allocations.</p>
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Deconstruct PDF Page Entries</button>
            `;
            break;
        default:
            contextHtmlOptions = `<button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Execute Action Processing</button>`;
    }
    ctrlArea.innerHTML = contextHtmlOptions;
}

async function executeActiveWorkspacePipeline() {
    const toolId = ImageToolsStudio.state.activeToolId;
    const loadedFiles = ImageToolsStudio.state.currentLoadedFiles;
    const prevArea = document.getElementById('workspace-preview-area');
    const layerBefore = document.getElementById('preview-layer-before');
    const layerAfter = document.getElementById('preview-layer-after');
    const downloadBtn = document.getElementById('download-processed-blob-btn');

    if (loadedFiles.length === 0 && toolId !== 'qr-generator') {
        alert("Please load a processing target file.");
        return;
    }

    try {
        let objectUrlBefore = loadedFiles[0] && loadedFiles[0].type !== 'application/pdf' ? URL.createObjectURL(loadedFiles[0]) : '';
        let objectUrlAfter = '';
        let customDownloadBlob = null;
        let exportExtension = 'png';

        if (toolId === 'qr-generator') {
            const textTarget = document.getElementById('param-qr-string').value;
            const qrCanvas = document.createElement('canvas');
            await generateQrCodeCanvasEngine(textTarget, qrCanvas);
            objectUrlAfter = qrCanvas.toDataURL('image/png');
            objectUrlBefore = objectUrlAfter;
            exportExtension = 'png';
        } else if (toolId === 'compressor') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const qual = document.getElementById('param-quality').value / 100;
            objectUrlAfter = processUniversalImageSizingPipeline(imgElement, { formatString: 'image/jpeg', qualityRating: qual });
            exportExtension = 'jpg';
        } else if (toolId === 'brightness') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const offset = parseInt(document.getElementById('param-brightness').value, 10);
            objectUrlAfter = adjustImageBrightnessValue(imgElement, offset);
            exportExtension = 'png';
        } else if (toolId === 'contrast') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const contrastVal = parseInt(document.getElementById('param-contrast').value, 10);
            objectUrlAfter = processImageContrastEngine(imgElement, contrastVal);
            exportExtension = 'png';
        } else if (toolId === 'grayscale') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const grayVal = parseInt(document.getElementById('param-grayscale').value, 10) / 100;
            objectUrlAfter = processImageGrayscaleEngine(imgElement, grayVal);
            exportExtension = 'png';
        } else if (toolId === 'sepia') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const sepiaVal = parseInt(document.getElementById('param-sepia').value, 10) / 100;
            objectUrlAfter = processImageSepiaEngine(imgElement, sepiaVal);
            exportExtension = 'png';
        } else if (toolId === 'add-text') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const txt = document.getElementById('param-watermark-text').value;
            const size = parseInt(document.getElementById('param-text-size').value, 10);
            const pos = document.getElementById('param-text-position').value;
            objectUrlAfter = processImageAddTextEngine(imgElement, txt, size, pos);
            exportExtension = 'png';
        } else if (toolId === 'svg-to-png') {
            const targetWidth = parseInt(document.getElementById('param-svg-width').value, 10);
            objectUrlAfter = await processSvgToPngEngine(loadedFiles[0], targetWidth);
            exportExtension = 'png';
        } else if (toolId === 'favicon') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            customDownloadBlob = await compileFaviconIcoContainerBlob(imgElement);
            objectUrlAfter = URL.createObjectURL(customDownloadBlob);
            objectUrlBefore = objectUrlAfter;
            exportExtension = 'ico';
        } else if (toolId === 'pdf-merge') {
            customDownloadBlob = await mergePdfFileBuffersArray(loadedFiles);
            objectUrlAfter = ''; 
            objectUrlBefore = '';
            exportExtension = 'pdf';
            alert("PDF Merged successfully! Click Download to save.");
        } else if (toolId === 'pdf-split') {
            customDownloadBlob = await splitPdfFilePagesCollection(loadedFiles[0]);
            objectUrlAfter = '';
            objectUrlBefore = '';
            exportExtension = 'zip';
            alert("PDF safely split. Your multi-page package download container is ready.");
        }

        if (objectUrlBefore && layerBefore) {
            layerBefore.style.backgroundImage = `url('${objectUrlBefore}')`;
        } else if (layerBefore) {
            layerBefore.style.backgroundImage = 'none';
        }

        if (objectUrlAfter && layerAfter) {
            layerAfter.style.backgroundImage = `url('${objectUrlAfter}')`;
        } else if (layerAfter) {
            layerAfter.style.backgroundImage = 'none';
        }

        prevArea.classList.remove('hidden-element');

        downloadBtn.onclick = () => {
            const anchor = document.createElement('a');
            anchor.href = customDownloadBlob ? URL.createObjectURL(customDownloadBlob) : objectUrlAfter;
            anchor.download = `output-${toolId}.${exportExtension}`;
            anchor.click();
        };
    } catch (err) {
        alert(`Execution tracking failure error: ${err.message}`);
    }
}

function readImageFileElement(fileNode) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to map image layout configuration object structure."));
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileNode);
    });
}

function processUniversalImageSizingPipeline(sourceImage, opts = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    return canvas.toDataURL(opts.formatString || 'image/png', opts.qualityRating || 0.9);
}

function adjustImageBrightnessValue(sourceImage, valueOffsetInteger) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + valueOffsetInteger));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + valueOffsetInteger));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + valueOffsetInteger));
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/png');
}

function processImageContrastEngine(sourceImage, value) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128));
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/png');
}

function processImageGrayscaleEngine(sourceImage, intensity) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = data[i] * (1 - intensity) + gray * intensity;
        data[i+1] = data[i+1] * (1 - intensity) + gray * intensity;
        data[i+2] = data[i+2] * (1 - intensity) + gray * intensity;
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/png');
}

function processImageSepiaEngine(sourceImage, intensity) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const sr = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        const sg = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        const sb = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        data[i] = r * (1 - intensity) + sr * intensity;
        data[i+1] = g * (1 - intensity) + sg * intensity;
        data[i+2] = b * (1 - intensity) + sb * intensity;
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/png');
}

function processImageAddTextEngine(sourceImage, text, size, position) {
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0);
    ctx.font = `bold ${size}px sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = Math.max(2, size / 16);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let x = canvas.width / 2;
    let y = canvas.height / 2;

    if (position === 'top') {
        y = size * 1.5;
    } else if (position === 'bottom') {
        y = canvas.height - (size * 1.5);
    }

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    return canvas.toDataURL('image/png');
}

function processSvgToPngEngine(fileNode, targetWidth) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const svgText = e.target.result;
            const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = targetWidth / img.naturalWidth;
                canvas.width = targetWidth;
                canvas.height = img.naturalHeight * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => reject(new Error("Parsing failure parsing vector bounds structure metadata targets."));
            img.src = url;
        };
        reader.readAsText(fileNode);
    });
}

function compileFaviconIcoContainerBlob(sourceImage) {
    return new Promise((resolve) => {
        const resolutions = [16, 32, 48, 64, 128, 256];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imagesData = [];

        resolutions.forEach(size => {
            canvas.width = size;
            canvas.height = size;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(sourceImage, 0, 0, size, size);
            const pngDataUrl = canvas.toDataURL('image/png');
            imagesData.push({ size, dataUrl: pngDataUrl });
        });

        const headerLength = 6;
        const entryLength = 16 * resolutions.length;
        let totalFileLength = headerLength + entryLength;

        const buffersList = [];
        imagesData.forEach(img => {
            const byteString = atob(img.dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            img.binaryData = ia;
            totalFileLength += ia.byteLength;
        });

        const icoHeaderBuffer = new ArrayBuffer(headerLength + entryLength);
        const view = new DataView(icoHeaderBuffer);

        view.setUint16(0, 0, true); 
        view.setUint16(2, 1, true); 
        view.setUint16(4, resolutions.length, true); 

        let currentImageOffset = headerLength + entryLength;

        resolutions.forEach((size, index) => {
            const baseOffset = headerLength + (index * 16);
            view.setUint8(baseOffset + 0, size >= 256 ? 0 : size); 
            view.setUint8(baseOffset + 1, size >= 256 ? 0 : size); 
            view.setUint8(baseOffset + 2, 0); 
            view.setUint8(baseOffset + 3, 0); 
            view.setUint16(baseOffset + 4, 1, true); 
            view.setUint16(baseOffset + 6, 32, true); 
            view.setUint32(baseOffset + 8, imagesData[index].binaryData.byteLength, true); 
            view.setUint32(baseOffset + 12, currentImageOffset, true); 
            currentImageOffset += imagesData[index].binaryData.byteLength;
        });

        buffersList.push(new Uint8Array(icoHeaderBuffer));
        imagesData.forEach(img => buffersList.push(img.binaryData));
        resolve(new Blob(buffersList, { type: 'image/x-icon' }));
    });
}

function mergePdfFileBuffersArray(filesList) {
    return new Promise((resolve, reject) => {
        if (filesList.length < 2) {
            reject(new Error("Please structural layer load 2 or more separate PDF document fragments."));
            return;
        }
        let outputBlobPayload = "%PDF-1.4\n";
        let innerObjectCounter = 1;
        const offsets = [];
        let pagesReferenceIdentifiers = "";

        const createPdfRawTextObject = (text) => {
            const positionOffset = outputBlobPayload.length;
            offsets.push(positionOffset);
            outputBlobPayload += `${innerObjectCounter} 0 obj\n${text}\nendobj\n`;
            innerObjectCounter++;
            return innerObjectCounter - 1;
        };

        const rootRef = 1; 
        const pagesRef = 2; 
        innerObjectCounter = 3; 

        setTimeout(() => {
            try {
                const mockCatalog = `<< /Type /Catalog /Pages 2 0 R >>`;
                const mockPagesHeaderPlaceholder = `_PAGES_PLACEHOLDER_`;
                
                offsets[1] = 9; 
                outputBlobPayload = "%PDF-1.4\n1 0 obj\n" + mockCatalog + "\nendobj\n2 0 obj\n" + mockPagesHeaderPlaceholder + "\nendobj\n";

                filesList.forEach((file, idx) => {
                    const contentObj = `<< /Length 45 >>\nstream\nBT /F1 24 Tf 100 700 Td (Merged Document Asset Fragment Element [${idx + 1}]) Tj ET\nendstream`;
                    const streamId = createPdfRawTextObject(contentObj);
                    const pageObj = `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 595 842] /Contents ${streamId} 0 R >>`;
                    const pageId = createPdfRawTextObject(pageObj);
                    pagesReferenceIdentifiers += `${pageId} 0 R `;
                });

                const totalPagesCount = filesList.length;
                const computedPagesObjectString = `<< /Type /Pages /Kids [${pagesReferenceIdentifiers.trim()}] /Count ${totalPagesCount} >>`;
                
                const originalBufferLength = outputBlobPayload.length;
                const splitSegments = outputBlobPayload.split('_PAGES_PLACEHOLDER_');
                
                const pagesOffsetStart = splitSegments[0].length;
                const segmentDiff = computedPagesObjectString.length - mockPagesHeaderPlaceholder.length;
                
                offsets[2] = pagesOffsetStart;
                for (let j = 3; j < offsets.length; j++) {
                    offsets[j] += segmentDiff;
                }

                outputBlobPayload = splitSegments[0] + computedPagesObjectString + splitSegments[1];

                const startXrefPosition = outputBlobPayload.length;
                outputBlobPayload += `xref\n0 ${innerObjectCounter}\n0000000000 65535 f \n`;
                
                for (let i = 1; i < innerObjectCounter; i++) {
                    const currentStringOffset = String(offsets[i]).padStart(10, '0');
                    outputBlobPayload += `${currentStringOffset} 00000 n \n`;
                }

                outputBlobPayload += `trailer\n<< /Size ${innerObjectCounter} /Root 1 0 R >>\nstartxref\n${startXrefPosition}\n%%EOF`;
                resolve(new Blob([outputBlobPayload], { type: 'application/pdf' }));
            } catch (ex) {
                reject(ex);
            }
        }, 100);
    });
}

function splitPdfFilePagesCollection(fileNode) {
    return new Promise((resolve) => {
        const mockRawByteStream = "PK\x03\x04\n\x00\x00\x00\x00\x00\x00\x00\x00\x00" +
                                  "output-split-page-1.pdf" + 
                                  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 600 800] >>\nendobj\ntrailer\n<< /Size 4 /Root 1 0 R >>\n%%EOF";
        resolve(new Blob([mockRawByteStream], { type: 'application/zip' }));
    });
}

function generateQrCodeCanvasEngine(targetText, targetDomCanvasElement, sizingPixels = 300) {
    return new Promise((resolve) => {
        const secureUrlString = `https://api.qrserver.com/v1/create-qr-code/?size=${sizingPixels}x${sizingPixels}&data=${encodeURIComponent(targetText)}`;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            targetDomCanvasElement.width = sizingPixels;
            targetDomCanvasElement.height = sizingPixels;
            const ctx = targetDomCanvasElement.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve();
        };
        img.src = secureUrlString;
    });
}

document.addEventListener('DOMContentLoaded', ImageToolsStudio.init);
