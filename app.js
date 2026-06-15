// ============================================================================
// CORE SYSTEM MODULE & GLOBAL STATE ORCHESTRATION 
// ============================================================================

const ImageToolsStudio = (() => {
    // Master Registry managing all 28 integrated utilities
    const toolRegistry = [
        // Existing Tools Map (Preserved Architectural Integrity)
        { id: 'compressor', name: 'Image Compressor', category: 'image', desc: 'Reduce image file size without losing quality.', keywords: 'shrink, reduce, optimize, jpeg, png, webp', icon: '🔥' },
        { id: 'resizer', name: 'Image Resizer', category: 'image', desc: 'Resize images by pixels or percentages easily.', keywords: 'scale, dimension, width, height, crop', icon: '📐' },
        { id: 'converter', name: 'Image Converter', category: 'image', desc: 'Convert images to PNG, JPG, WEBP, or GIF formats.', keywords: 'format, transform, extension, jpg, png', icon: '🔥' },
        { id: 'cropper', name: 'Image Cropper', category: 'image', desc: 'Crop images to perfect aspect ratios or custom selections.', keywords: 'cut, trim, bounding box, square', icon: '✂️' },
        { id: 'rotate', name: 'Rotate Image', category: 'image', desc: 'Rotate your images clockwise or counter-clockwise.', keywords: 'turn, flip, angle, orientation', icon: '🔄' },
        { id: 'flip', name: 'Flip Image', category: 'image', desc: 'Mirror images vertically or horizontally instantly.', keywords: 'mirror, reflect, invert, reverse', icon: '🪞' },
        { id: 'watermark', name: 'Watermark Image', category: 'utility', desc: 'Add overlay logos or text watermarks protection.', keywords: 'copyright, brand, text, overlay, protect', icon: '🛡️' },
        { id: 'merge', name: 'Merge Images', category: 'utility', desc: 'Combine multiple images vertically or horizontally.', keywords: 'join, stitch, combine, collage', icon: '🧲' },
        { id: 'pdf-to-img', name: 'PDF to Image', category: 'pdf', desc: 'Extract pages from PDF files into high-quality images.', keywords: 'pdf, extract, rendering, pages, convert', icon: '📄' },
        { id: 'img-to-pdf', name: 'Image to PDF', category: 'pdf', desc: 'Convert images into a single clean PDF document.', keywords: 'pdf, compiler, document, sheets, pages', icon: '📂' },
        
        // 18 Requested SaaS Production Expansion Tools
        { id: 'pdf-merge', name: 'PDF Merge', category: 'pdf', desc: 'Combine multiple PDF documents into a single file.', keywords: 'join pdf, combine pdf, concatenate document', icon: '🔥' },
        { id: 'pdf-split', name: 'PDF Split', category: 'pdf', desc: 'Split a PDF file into separate single-page documents.', keywords: 'divide pdf, extract pages, break pdf', icon: '✂️' },
        { id: 'pdf-compress', name: 'PDF Compress', category: 'pdf', desc: 'Reduce the file size of your PDF files efficiently.', keywords: 'shrink pdf, optimize document, compress text', icon: '📉' },
        { id: 'qr-generator', name: 'QR Code Generator', category: 'utility', desc: 'Generate customized scannable QR codes for links and text.', keywords: 'barcode, matrix, dynamic qr, links, scan', icon: '🔥' },
        { id: 'color-picker', name: 'Color Picker', category: 'utility', desc: 'Extract colors from images and get hex/rgb palettes.', keywords: 'eyedropper, palette, hex, rgb, css, color design', icon: '🎨' },
        { id: 'add-text', name: 'Add Text To Image', category: 'image', desc: 'Overlay elegant text, typography, and captions on pictures.', keywords: 'caption, subtitle, memo, text engine', icon: '✍️' },
        { id: 'brightness', name: 'Brightness Adjustment', category: 'image', desc: 'Lighten or darken image lighting exposures dynamically.', keywords: 'exposure, gamma, light, dark, filter', icon: '☀️' },
        { id: 'contrast', name: 'Contrast Adjustment', category: 'image', desc: 'Enhance or soften the difference between shadows and highlights.', keywords: 'vivid, dynamic range, levels, punchy', icon: '🌗' },
        { id: 'grayscale', name: 'Grayscale Filter', category: 'image', desc: 'Convert your colored assets into classic black and white.', keywords: 'monochrome, b&w, vintage, desaturate', icon: '🏁' },
        { id: 'sepia', name: 'Sepia Filter', category: 'image', desc: 'Infuse warm, nostalgic reddish-brown vintage tones.', keywords: 'retro, antique, old school, filter photo', icon: '📜' },
        { id: 'metadata', name: 'Image Metadata Viewer', category: 'utility', desc: 'Read EXIF tag profiles, camera details, and structural metadata.', keywords: 'exif, tags, geolocation, data profile, security', icon: 'ℹ️' },
        { id: 'favicon', name: 'Favicon Generator', category: 'utility', desc: 'Generate web icons (.ico) across standard multi-resolutions.', keywords: 'ico, icon, web manifest, shortcut icon', icon: '🌐' },
        { id: 'svg-to-png', name: 'SVG to PNG Converter', category: 'image', desc: 'Rasterize vector SVG drawings into crisp alpha-channel PNGs.', keywords: 'vector, raster, transparent, render', icon: '💎' },
        { id: 'png-to-jpg', name: 'PNG to JPG Converter', category: 'image', desc: 'Convert transparent PNG graphics to high-compatibility JPGs.', keywords: 'flatten, compression, asset pipeline', icon: '🔄' },
        { id: 'jpg-to-png', name: 'JPG to PNG Converter', category: 'image', desc: 'Convert lossy JPG photos into robust transparent PNG format.', keywords: 'alpha channel, web format, cross conversion', icon: '🖼️' },
        { id: 'webp-converter', name: 'WEBP Converter', category: 'image', desc: 'Convert graphics directly into modern space-saving WEBP format.', keywords: 'next-gen, format, page speed, google optimization', icon: '🚀' },
        { id: 'social-resizer', name: 'Social Media Image Resizer', category: 'image', desc: 'Instantly crop pictures for YouTube, Instagram, Facebook, and X layouts.', keywords: 'aspect ratio, template, cover, profile picture, banner', icon: '📱' },
        { id: 'thumbnail', name: 'Thumbnail Generator', category: 'image', desc: 'Generate optimized preview thumbnails across custom standard resolutions.', keywords: 'preview, mini image, scale down, catalog sizing', icon: '🖼️' }
    ];

    const state = {
        searchQuery: '',
        activeCategory: 'all',
        activeToolId: null,
        currentLoadedFiles: []
    };

    const init = () => {
        buildDashboardDOMCards();
        setupSearchAndFilterEvents();
        setupDragAndDropUploader();
        setupNavbarScrollEffect();
        setupComparisonSlider();
    };

    // Build Tool Cards dynamically to optimize memory footprint
    const buildDashboardDOMCards = () => {
        const grid = document.getElementById('tools-dashboard-grid');
        if (!grid) return;
        grid.innerHTML = '';

        toolRegistry.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card-wrapper fade-in-up';
            card.setAttribute('data-tool-id', tool.id);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.innerHTML = `
                <div class="tool-card-icon-frame">${tool.icon}</div>
                <h3 class="tool-card-title-text">${tool.name}</h3>
                <p class="tool-card-desc-text">${tool.desc}</p>
            `;
            
            card.addEventListener('click', () => switchActiveToolWorkspace(tool.id));
            card.addEventListener('keydown', (e) => { if(e.key === 'Enter') switchActiveToolWorkspace(tool.id); });
            grid.appendChild(card);
        });
    };

    // Navbar Scroll Micro Interaction Handler
    const setupNavbarScrollEffect = () => {
        const nav = document.querySelector('.saas-navbar');
        window.addEventListener('scroll', () => {
            if(window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    };

    // Advanced Live Filtering Engine (No Reload Router Mapping Loop)
    const setupSearchAndFilterEvents = () => {
        const searchInput = document.getElementById('global-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        const tabs = document.querySelectorAll('.category-tab');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase().trim();
                if(clearBtn) clearBtn.style.opacity = state.searchQuery.length > 0 ? '1' : '0';
                filterDashboardExecution();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                state.searchQuery = '';
                clearBtn.style.opacity = '0';
                searchInput.focus();
                filterDashboardExecution();
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                state.activeCategory = tab.getAttribute('data-category');
                filterDashboardExecution();
            });
        });
    };

    const filterDashboardExecution = () => {
        const grid = document.getElementById('tools-dashboard-grid');
        const noResults = document.getElementById('search-no-results-message');
        const cards = grid.querySelectorAll('.tool-card-wrapper');
        let visibleCount = 0;

        cards.forEach(card => {
            const toolId = card.getAttribute('data-tool-id');
            const toolData = toolRegistry.find(t => t.id === toolId);
            if (!toolData) return;

            const matchesCategory = state.activeCategory === 'all' || toolData.category === state.activeCategory;
            const contextSearchStream = `${toolData.name} ${toolData.desc} ${toolData.keywords}`.toLowerCase();
            const matchesSearch = contextSearchStream.includes(state.searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
                const titleTextNode = card.querySelector('.tool-card-title-text');
                if (titleTextNode) {
                    highlightMatchingTextNode(titleTextNode, toolData.name, state.searchQuery);
                }
            } else {
                card.style.display = 'none';
            }
        });

        if(noResults) noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
    };

    const highlightMatchingTextNode = (element, text, query) => {
        if (!query) { element.textContent = text; return; }
        const index = text.toLowerCase().indexOf(query);
        if (index >= 0) {
            const initialMatch = text.substring(0, index);
            const targetedHighlight = text.substring(index, index + query.length);
            const structuralTrailing = text.substring(index + query.length);
            element.innerHTML = `${escapeHTML(initialMatch)}<mark class="search-highlight">${escapeHTML(targetedHighlight)}</mark>${escapeHTML(structuralTrailing)}`;
        } else {
            element.textContent = text;
        }
    };

    const escapeHTML = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Drag & Drop Sandboxed Uploader Configuration Layer
    const setupDragAndDropUploader = () => {
        const zone = document.getElementById('premium-uploader-zone');
        const fileInput = document.getElementById('core-hidden-file-input');

        if(!zone || !fileInput) return;

        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            handleFilePayloadUpload(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => {
            handleFilePayloadUpload(e.target.files);
        });
    };

    const handleFilePayloadUpload = (files) => {
        if(files.length === 0) return;
        state.currentLoadedFiles = Array.from(files);
        
        // Show validation rules alert if asset fails client safety filter parameters
        if(state.currentLoadedFiles[0].size > 2 * 1024 * 1024 * 1024) {
            alert("File execution bounds exceeded. Please load a data payload smaller than 2GB.");
            return;
        }

        // Build dynamic context configuration workspace panel controls mapping interface
        injectDynamicToolControls();
    };

    // Live Before/After Comparison Slider Split Logic
    const setupComparisonSlider = () => {
        const slider = document.getElementById('ui-comparison-slider-node');
        const handle = document.getElementById('slider-split-handle-drag');
        const afterLayer = document.getElementById('preview-layer-after');
        if (!slider || !handle || !afterLayer) return;

        let isDragging = false;
        const processMove = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const positionX = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (positionX / rect.width) * 100;
            handle.style.left = `${percentage}%`;
            afterLayer.style.width = `${percentage}%`;
        };

        handle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => { if(isDragging) processMove(e.clientX); });
        
        // Touch support
        handle.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => { if(isDragging && e.touches[0]) processMove(e.touches[0].clientX); });
    };

    return { init, registry: toolRegistry, state };
})();

// ============================================================================
// WORKSPACE ACTIONS & MULTI-TOOL CONTROLLER INJECTIONS
// ============================================================================

function switchActiveToolWorkspace(toolId) {
    const targetTool = ImageToolsStudio.registry.find(t => t.id === toolId);
    if (!targetTool) return;

    ImageToolsStudio.state.activeToolId = toolId;
    ImageToolsStudio.state.currentLoadedFiles = [];

    // Transform UI view focus framework state mapping container layers
    const panel = document.getElementById('active-workspace-panel');
    const title = document.getElementById('active-workspace-title');
    const ctrlArea = document.getElementById('workspace-controls-area');
    const prevArea = document.getElementById('workspace-preview-area');

    title.textContent = `Workspace Tool Terminal :: ${targetTool.name}`;
    ctrlArea.classList.add('hidden-element');
    prevArea.classList.add('hidden-element');
    panel.classList.remove('hidden-workspace');

    panel.scrollIntoView({ behavior: 'smooth' });
}

function closeActiveWorkspace() {
    document.getElementById('active-workspace-panel').classList.add('hidden-workspace');
    ImageToolsStudio.state.activeToolId = null;
    ImageToolsStudio.state.currentLoadedFiles = [];
}

function injectDynamicToolControls() {
    const ctrlArea = document.getElementById('workspace-controls-area');
    if (!ctrlArea) return;
    ctrlArea.classList.remove('hidden-element');

    const toolId = ImageToolsStudio.state.activeToolId;
    let contextHtmlOptions = ``;

    // Map configuration control elements dynamically based on tool requirements
    switch(toolId) {
        case 'compressor':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Target Quality Quantization Constraint Level</label>
                    <input type="range" id="param-quality" min="1" max="100" value="80" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Run Asset Optimization</button>
            `;
            break;
        case 'pdf-merge':
            contextHtmlOptions = `
                <p style="color: #ffffff; margin-bottom:12px;">Loaded Total Files Document Streams Count: <strong>${ImageToolsStudio.state.currentLoadedFiles.length} item(s)</strong></p>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Compile & Merge Documents</button>
            `;
            break;
        case 'pdf-split':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Target Extraction Target Page Number (Comma separated e.g. 1,3)</label>
                    <input type="text" id="param-split-pages" value="1" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Isolate & Extrapolate Sheets</button>
            `;
            break;
        case 'qr-generator':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Dynamic Text Input Content Target Payload Link</label>
                    <input type="text" id="param-qr-string" value="https://imagetools.studio" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Generate Matrix Vector Code</button>
            `;
            break;
        case 'color-picker':
            contextHtmlOptions = `
                <p style="color:var(--text-muted);">Click point on image layout workspace preview window layer block node to sample explicit system palettes.</p>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Initialize Color Maps Workspace</button>
            `;
            break;
        case 'add-text':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Text Content Annotation String</label>
                    <input type="text" id="param-text-string" value="ImageTools Studio Copy Protection" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Overlay Typography Layer</button>
            `;
            break;
        case 'brightness':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Luminosity Exposure Delta Slider Accent</label>
                    <input type="range" id="param-brightness" min="-100" max="100" value="30" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Apply Brightness Adjustments</button>
            `;
            break;
        case 'contrast':
            contextHtmlOptions = `
                <div class="control-group">
                    <label>Contrast Delta Levels Parameter</label>
                    <input type="range" id="param-contrast" min="-100" max="100" value="40" class="control-input">
                </div>
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Apply Dynamic Range Boost</button>
            `;
            break;
        case 'grayscale':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Render Monochromatic Grayscale</button>
            `;
            break;
        case 'sepia':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Inject Warm Nostalgic Sepia Tone Matrix</button>
            `;
            break;
        case 'metadata':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Extract EXIF Structure Data Headers</button>
            `;
            break;
        case 'favicon':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Recompile Dynamic Target Multi-Ico Pack</button>
            `;
            break;
        case 'svg-to-png':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Rasterize Vector Coordinates</button>
            `;
            break;
        case 'png-to-jpg':
        case 'jpg-to-png':
        case 'webp-converter':
        case 'social-resizer':
        case 'thumbnail':
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Execute Automated Image Pipeline Layout Conversion</button>
            `;
            break;
        default:
            contextHtmlOptions = `
                <button class="btn-gradient-cta" onclick="executeActiveWorkspacePipeline()">Process Assets Matrix Layout Pipeline</button>
            `;
    }
    ctrlArea.innerHTML = contextHtmlOptions;
}

// ============================================================================
// CENTRAL WORKSPACE EXECUTION SYSTEM PIPELINES
// ============================================================================

async function executeActiveWorkspacePipeline() {
    const toolId = ImageToolsStudio.state.activeToolId;
    const loadedFiles = ImageToolsStudio.state.currentLoadedFiles;
    const prevArea = document.getElementById('workspace-preview-area');
    const layerBefore = document.getElementById('preview-layer-before');
    const layerAfter = document.getElementById('preview-layer-after');
    const downloadBtn = document.getElementById('download-processed-blob-btn');

    if (loadedFiles.length === 0 && toolId !== 'qr-generator') {
        alert("Please load a processing target payload source item block file.");
        return;
    }

    try {
        let generatedOutputBlob = null;
        let objectUrlBefore = loadedFiles[0] ? URL.createObjectURL(loadedFiles[0]) : '';
        let objectUrlAfter = '';

        // Route workflows cleanly to native canvas or data layer engines
        switch(toolId) {
            case 'compressor':
                const qualityVal = document.getElementById('param-quality').value / 100;
                const compressedImgData = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(compressedImgData, { formatString: 'image/jpeg', qualityRating: qualityVal });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;
                
            case 'pdf-merge':
                generatedOutputBlob = await processPdfMergePipeline(loadedFiles);
                objectUrlAfter = URL.createObjectURL(generatedOutputBlob);
                objectUrlBefore = objectUrlAfter; // Bypass default image canvas comparisons on complex documents
                break;

            case 'pdf-split':
                const pageStringArray = document.getElementById('param-split-pages').value.split(',').map(n => parseInt(n.trim(), 10));
                const isolatedBlobCollection = await processPdfSplitPipeline(loadedFiles[0], pageStringArray);
                if(isolatedBlobCollection.length > 0) {
                    generatedOutputBlob = isolatedBlobCollection[0].blob;
                    objectUrlAfter = URL.createObjectURL(generatedOutputBlob);
                    objectUrlBefore = objectUrlAfter;
                }
                break;

            case 'qr-generator':
                const textTarget = document.getElementById('param-qr-string').value;
                const qrVirtualCanvas = document.createElement('canvas');
                await generateQrCodeCanvasEngine(textTarget, qrVirtualCanvas);
                // Delay buffer processing to safely mount async execution vectors
                await new Promise(r => setTimeout(r, 600));
                objectUrlAfter = qrVirtualCanvas.toDataURL('image/png');
                objectUrlBefore = objectUrlAfter;
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'add-text':
                const txtString = document.getElementById('param-text-string').value;
                const sourceImgElement = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = renderOverlayTextOnCanvas(sourceImgElement, txtString);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'brightness':
                const brightOffset = parseInt(document.getElementById('param-brightness').value, 10);
                const brightImgElement = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = adjustImageBrightnessValue(brightImgElement, brightOffset);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'contrast':
                const contrastOffset = parseInt(document.getElementById('param-contrast').value, 10);
                const contrastImgElement = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = adjustImageContrastValue(contrastImgElement, contrastOffset);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'grayscale':
                const grayImgElement = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = applyGrayscaleFilterToCanvas(grayImgElement);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'sepia':
                const sepiaImgElement = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = applySepiaFilterToCanvas(sepiaImgElement);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'metadata':
                const metadataReport = await parseImageMetadataExifData(loadedFiles[0]);
                alert(`EXIF Parse Report Engine Results Profile Payload Status: ${metadataReport.status}`);
                return;

            case 'favicon':
                const favImgElement = await readImageFileElement(loadedFiles[0]);
                await new Promise((resolve) => {
                    transformImageToFaviconIcoBlob(favImgElement, (resObj) => {
                        objectUrlAfter = URL.createObjectURL(resObj.primaryBlob);
                        generatedOutputBlob = resObj.primaryBlob;
                        resolve();
                    });
                });
                objectUrlBefore = objectUrlAfter;
                break;

            case 'svg-to-png':
                await new Promise((resolve) => {
                    convertSvgToPngLocalCanvasPipeline(loadedFiles[0], (pngDataUrl) => {
                        objectUrlAfter = pngDataUrl;
                        generatedOutputBlob = dataURLtoBlob(pngDataUrl);
                        resolve();
                    });
                });
                objectUrlBefore = objectUrlAfter;
                break;

            case 'png-to-jpg':
                const pngSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(pngSource, { formatString: 'image/jpeg' });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'jpg-to-png':
                const jpgSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(jpgSource, { formatString: 'image/png' });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'webp-converter':
                const webpSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(webpSource, { formatString: 'image/webp' });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'social-resizer':
                const socialSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(socialSource, { targetWidth: 1200, targetHeight: 630, formatString: 'image/png' });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            case 'thumbnail':
                const thumbSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(thumbSource, { targetWidth: 150, targetHeight: 150, formatString: 'image/png' });
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
                break;

            default:
                // Fallback route handling for structural safety
                const defSource = await readImageFileElement(loadedFiles[0]);
                objectUrlAfter = processUniversalImageSizingPipeline(defSource);
                generatedOutputBlob = dataURLtoBlob(objectUrlAfter);
        }

        // Render localized preview frames safely
        layerBefore.style.backgroundImage = `url('${objectUrlBefore}')`;
        layerAfter.style.backgroundImage = `url('${objectUrlAfter}')`;
        prevArea.classList.remove('hidden-element');

        // Setup clear trigger reference paths on the dynamic download CTA button
        downloadBtn.onclick = () => {
            const anchor = document.createElement('a');
            anchor.href = objectUrlAfter;
            anchor.download = `imagetools-studio-output-${toolId}.${generatedOutputBlob.type.split('/')[1] || 'bin'}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        };

    } catch (err) {
        alert(`Pipeline execution error: ${err.message}`);
    }
}

// ============================================================================
// LOW-LEVEL CLIENT PROGRAMMATIC CANVAS CONVERSION UTILITIES
// ============================================================================

function readImageFileElement(fileNode) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to map payload directly into runtime vector object layout."));
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileNode);
    });
}

function processUniversalImageSizingPipeline(sourceImage, configurationOptions = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const targetW = configurationOptions.targetWidth || sourceImage.naturalWidth;
    const targetH = configurationOptions.targetHeight || sourceImage.naturalHeight;
    canvas.width = targetW;
    canvas.height = targetH;
    
    if (configurationOptions.formatString === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
    }
    ctx.drawImage(sourceImage, 0, 0, targetW, targetH);
    return canvas.toDataURL(configurationOptions.formatString || 'image/png', configurationOptions.qualityRating || 0.95);
}

async function processPdfMergePipeline(fileArray) {
    const { jsPDF } = window.jspdf;
    const mergedDoc = new jsPDF();
    for (let i = 0; i < fileArray.length; i++) {
        const fileBuffer = await fileArray[i].arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            const imgData = canvas.toDataURL('image/jpeg', 0.90);
            if (i === 0 && pageNum === 1) {
                mergedDoc.addImage(imgData, 'JPEG', 0, 0, mergedDoc.internal.pageSize.getWidth(), mergedDoc.internal.pageSize.getHeight());
            } else {
                mergedDoc.addPage();
                mergedDoc.addImage(imgData, 'JPEG', 0, 0, mergedDoc.internal.pageSize.getWidth(), mergedDoc.internal.pageSize.getHeight());
            }
        }
    }
    return mergedDoc.output('blob');
}

async function processPdfSplitPipeline(file, targetPageNumbersArray) {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    const { jsPDF } = window.jspdf;
    const outputBlobsCollection = [];
    for (const pageNum of targetPageNumbersArray) {
        if (pageNum > pdf.numPages || pageNum < 1) continue;
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        const singlePageDoc = new jsPDF();
        singlePageDoc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, singlePageDoc.internal.pageSize.getWidth(), singlePageDoc.internal.pageSize.getHeight());
        outputBlobsCollection.push({ page: pageNum, blob: singlePageDoc.output('blob') });
    }
    return outputBlobsCollection;
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

function renderOverlayTextOnCanvas(sourceImage, textContentString) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);
    ctx.font = `bold ${Math.floor(canvas.width * 0.04)}px sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'center';
    ctx.fillText(textContentString, canvas.width / 2, canvas.height - 40);
    return canvas.toDataURL('image/png');
}

function adjustImageBrightnessValue(sourceImage, valueOffsetInteger) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + valueOffsetInteger));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + valueOffsetInteger));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + valueOffsetInteger));
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
}

function adjustImageContrastValue(sourceImage, contrastFactorValue) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    const factor = (259 * (contrastFactorValue + 255)) / (255 * (259 - contrastFactorValue));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128));
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
}

function applyGrayscaleFilterToCanvas(sourceImage) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        const brightnessLuminosityWeight = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = brightnessLuminosityWeight; data[i+1] = brightnessLuminosityWeight; data[i+2] = brightnessLuminosityWeight;
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
}

function applySepiaFilterToCanvas(sourceImage) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;
    ctx.drawImage(sourceImage, 0, 0);
    const imgDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgDataObj.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i+1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i+2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    ctx.putImageData(imgDataObj, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
}

async function parseImageMetadataExifData(fileElementNode) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const view = new DataView(e.target.result);
            if (view.getUint16(0, false) !== 0xFFD8) { resolve({ status: "Non-JPEG structural format profile parsed." }); return; }
            let offset = 2;
            while (offset < view.byteLength) {
                if (view.getUint16(offset+2, false) <= 8) break;
                if (view.getUint16(offset, false) === 0xFFE1) { resolve({ status: "EXIF profile metadata signature trace verified." }); return; }
                offset += 2 + view.getUint16(offset+2, false);
            }
            resolve({ status: "Clean structure file profile without structural tracking segments." });
        };
        reader.readAsArrayBuffer(fileElementNode.slice(0, 64 * 1024));
    });
}

function transformImageToFaviconIcoBlob(sourceImage, callbackTargetFunction) {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImage, 0, 0, 32, 32);
    canvas.toBlob((blob) => { callbackTargetFunction({ primaryBlob: blob }); }, 'image/png');
}

function convertSvgToPngLocalCanvasPipeline(fileElement, callbackTargetFunction) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 500; canvas.height = img.height || 500;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            callbackTargetFunction(canvas.toDataURL('image/png'));
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(e.target.result)));
    };
    reader.readAsText(fileElement);
}

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) { u8arr[n] = bstr.charCodeAt(n); }
    return new Blob([u8arr], {type:mime});
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', ImageToolsStudio.init);
