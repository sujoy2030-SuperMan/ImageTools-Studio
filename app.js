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
            const matchesSearch = toolData.name.toLowerCase().includes(state.searchQuery) || toolData.desc.toLowerCase().includes(state.searchQuery);

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
        if (!slider || !afterLayer) return;

        slider.addEventListener('mousemove', (e) => {
            const rect = slider.getBoundingClientRect();
            const positionX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min((positionX / rect.width) * 100, 100));
            afterLayer.style.width = `${percentage}%`;
        });
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

    if(toolId === 'qr-generator') {
        injectDynamicToolControls();
    }
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
                    <label>Exposure Offset Delta</label>
                    <input type="range" id="param-brightness" min="-100" max="100" value="20" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Apply Brightness Adjustments</button>
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
        let objectUrlBefore = loadedFiles[0] ? URL.createObjectURL(loadedFiles[0]) : '';
        let objectUrlAfter = '';

        if (toolId === 'qr-generator') {
            const textTarget = document.getElementById('param-qr-string').value;
            const qrCanvas = document.createElement('canvas');
            await generateQrCodeCanvasEngine(textTarget, qrCanvas);
            objectUrlAfter = qrCanvas.toDataURL('image/png');
            objectUrlBefore = objectUrlAfter;
        } else if (toolId === 'compressor') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const qual = document.getElementById('param-quality').value / 100;
            objectUrlAfter = processUniversalImageSizingPipeline(imgElement, { formatString: 'image/jpeg', qualityRating: qual });
        } else if (toolId === 'brightness') {
            const imgElement = await readImageFileElement(loadedFiles[0]);
            const offset = parseInt(document.getElementById('param-brightness').value, 10);
            objectUrlAfter = adjustImageBrightnessValue(imgElement, offset);
        }

        layerBefore.style.backgroundImage = `url('${objectUrlBefore}')`;
        layerAfter.style.backgroundImage = `url('${objectUrlAfter}')`;
        prevArea.classList.remove('hidden-element');

        downloadBtn.onclick = () => {
            const anchor = document.createElement('a');
            anchor.href = objectUrlAfter;
            anchor.download = `output-${toolId}.png`;
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
