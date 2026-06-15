const OmniStudioCore = (() => {
    const internalRegistry = [
        { id: 'img-compressor', name: 'Image Compressor', category: 'image', desc: 'Optimize structural layouts to balance compression scales and reduce bytes.', keywords: 'shrink, compress, size, webp, jpeg, quality', icon: '📉', badge: 'Popular' },
        { id: 'img-resize', name: 'Resize Image', category: 'image', desc: 'Mutate dimension bounding vectors using absolute pixel layout parameters.', keywords: 'width, height, scale, dimension, pixel', icon: '📐' },
        { id: 'img-crop', name: 'Crop Image', category: 'image', desc: 'Extract geometric regions from standard coordinates via target sub-canvases.', keywords: 'trim, bounding box, subset, canvas, frame', icon: '✂️' },
        { id: 'img-rotate', name: 'Rotate Image', category: 'image', desc: 'Apply angular rotation tracking matrices across transformation steps.', keywords: 'turn, spin, degree, 90, 180, orientation', icon: '🔄' },
        { id: 'img-jpg-to-png', name: 'JPG to PNG Converter', category: 'image', desc: 'Re-encode explicit matrix frames directly into lossless portable network formats.', keywords: 'convert, export, alpha, high quality', icon: '🔁' },
        { id: 'img-png-to-jpg', name: 'PNG to JPG Converter', category: 'image', desc: 'Rasterize binary structures onto standard opaque white canvas sheets.', keywords: 'jpeg, background, blend, format', icon: '🔄' },
        { id: 'img-webp-to-jpg', name: 'WEBP to JPG Converter', category: 'image', desc: 'Decode Google vector/raster block formats down to universal profiles.', keywords: 'riff, decode, image stream, render', icon: '💎' },
        { id: 'filter-grayscale', name: 'Grayscale Filter', category: 'image', desc: 'Convert pixel arrays into absolute linear monochromatic configurations.', keywords: 'black and white, bw, matrix, luma, filter', icon: '🏁' },
        { id: 'filter-sepia', name: 'Sepia Filter', category: 'image', desc: 'Infuse classic organic vintage red-brown tones using custom color weights.', keywords: 'retro, warm, photographic antique, grading', icon: '📜' },
        { id: 'filter-brightness', name: 'Brightness Engine', category: 'image', desc: 'Shift image light layers uniformly using pixel offset transformations.', keywords: 'exposure, gain, illumination, amplify', icon: '☀️' },
        { id: 'filter-contrast', name: 'Contrast Adjustment', category: 'image', desc: 'Amplify midtone definitions against shadows and specular configurations.', keywords: 'levels, curves, histogram, dynamic range', icon: '🌗' },
        { id: 'img-add-text', name: 'Add Text To Image', category: 'image', desc: 'Inject custom alphabetic text blocks directly onto spatial canvas layouts.', keywords: 'annotate, font, text overlay, render caption', icon: '✍️' },
        { id: 'img-watermark', name: 'Watermark Tool', category: 'image', desc: 'Protect assets with semi-opaque text rows arranged diagonally or horizontally.', keywords: 'copyright, asset protection, opacity, text layer', icon: '🛡️' },
        { id: 'pdf-merge', name: 'Merge PDF Documents', category: 'pdf', desc: 'Stitch multi-page data streams into a unified object catalog structure.', keywords: 'combine, join, bind, document stack, multi', icon: '🗂️', badge: 'Core' },
        { id: 'pdf-split', name: 'Split PDF Core', category: 'pdf', desc: 'Deconstruct PDF structural matrices down to separate page vectors.', keywords: 'extract, isolate, disconnect, pages, slice', icon: '📂' },
        { id: 'pdf-jpg-to-pdf', name: 'JPG to PDF Compiler', category: 'pdf', desc: 'Wrap standard image blobs directly inside clean document structural layers.', keywords: 'doc, convert, compilation, scan print', icon: '📄' },
        { id: 'pdf-pdf-to-jpg', name: 'PDF to JPG Extractor', category: 'pdf', desc: 'Render nested document vectors down into web-viewable raster asset arrays.', keywords: 'extract page, canvas render, print format', icon: '🖼️' },
        { id: 'util-qr', name: 'QR Code Generator', category: 'utility', desc: 'Generate high-contrast scannable matrix vector code blocks locally.', keywords: 'quick response, barcode, tracking link, data string', icon: '🔳' },
        { id: 'util-barcode', name: 'Barcode Generator', category: 'utility', desc: 'Render linear 1D instrumentation markers (Code 128 standard).', keywords: 'upc, logistics, identification, lines, scanning', icon: '║▌║' },
        { id: 'util-color', name: 'Eyedropper Color Picker', category: 'utility', desc: 'Sample exact hex values from your local image assets instantly.', keywords: 'hex, rgb, eyedropper, palette, extract color', icon: '🧪' },
        { id: 'util-base64', name: 'Base64 Binary Encoder', category: 'utility', desc: 'Translate raw binary file chunks into ASCII standard injection strings.', keywords: 'data uri, embed, code payload, inline asset', icon: '🧬' }
    ];

    const RuntimeState = {
        activeFilterCategory: 'all',
        activeSearchQueryString: '',
        currentlySelectedToolId: null,
        activeBinaryPayloads: [],
        processedOutputBlob: null,
        processedOutputExtension: 'png'
    };

    const bootPipeline = () => {
        setupUIRenderGrids();
        bindGlobalEventInterceptors();
        initializeWorkspaceDragHandlers();
    };

    const setupUIRenderGrids = () => {
        const gridMount = document.getElementById('tools-dashboard-grid-mount');
        if (!gridMount) return;
        gridMount.innerHTML = '';

        internalRegistry.forEach(tool => {
            const cardNode = document.createElement('div');
            cardNode.className = 'tool-card-wrapper';
            cardNode.setAttribute('data-id', tool.id);
            cardNode.setAttribute('data-category', tool.category);

            let badgeHtml = tool.badge ? `<span class="tool-card-badge">${tool.badge}</span>` : '';

            cardNode.innerHTML = `
                ${badgeHtml}
                <div class="tool-card-header-icon-box">${tool.icon}</div>
                <h3 class="tool-card-title">${tool.name}</h3>
                <p class="tool-card-desc">${tool.desc}</p>
            `;

            cardNode.addEventListener('click', () => initiateWorkspaceEnvironment(tool.id));
            gridMount.appendChild(cardNode);
        });
    };

    const bindGlobalEventInterceptors = () => {
        const searchInput = document.getElementById('global-tool-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                RuntimeState.activeSearchQueryString = e.target.value.toLowerCase().trim();
                executeFilteringMatrix();
            });
        }

        const tabFiltersRow = document.getElementById('category-tab-filters-row');
        if (tabFiltersRow) {
            tabFiltersRow.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.category-tab');
                if (!targetBtn) return;

                tabFiltersRow.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                targetBtn.classList.add('active');

                RuntimeState.activeFilterCategory = targetBtn.getAttribute('data-category');
                executeFilteringMatrix();
            });
        }

        const closeBtn = document.getElementById('workspace-close-action-trigger');
        if (closeBtn) {
            closeBtn.addEventListener('click', teardownWorkspaceEnvironment);
        }

        const navLogo = document.getElementById('nav-brand-logo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    const executeFilteringMatrix = () => {
        const cards = document.querySelectorAll('#tools-dashboard-grid-mount .tool-card-wrapper');
        cards.forEach(card => {
            const id = card.getAttribute('data-id');
            const toolData = internalRegistry.find(t => t.id === id);
            if (!toolData) return;

            const categoryMatch = (RuntimeState.activeFilterCategory === 'all' || toolData.category === RuntimeState.activeFilterCategory);
            const searchMatch = !RuntimeState.activeSearchQueryString || 
                                toolData.name.toLowerCase().includes(RuntimeState.activeSearchQueryString) ||
                                toolData.desc.toLowerCase().includes(RuntimeState.activeSearchQueryString) ||
                                toolData.keywords.toLowerCase().includes(RuntimeState.activeSearchQueryString) ||
                                toolData.category.toLowerCase().includes(RuntimeState.activeSearchQueryString);

            if (categoryMatch && searchMatch) {
                card.classList.remove('hidden-element');
            } else {
                card.classList.add('hidden-element');
            }
        });
    };

    const initializeWorkspaceDragHandlers = () => {
        const dropzone = document.getElementById('premium-uploader-zone');
        const fileNativeInput = document.getElementById('core-hidden-file-input');

        if (!dropzone || !fileNativeInput) return;

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                ingestUploadedFileObjects(e.dataTransfer.files);
            }
        });

        fileNativeInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                ingestUploadedFileObjects(e.target.files);
            }
        });
    };

    const initiateWorkspaceEnvironment = (toolId) => {
        const toolData = internalRegistry.find(t => t.id === toolId);
        if (!toolData) return;

        RuntimeState.currentlySelectedToolId = toolId;
        RuntimeState.activeBinaryPayloads = [];
        RuntimeState.processedOutputBlob = null;

        const panel = document.getElementById('active-workspace-panel');
        const titleLabel = document.getElementById('active-workspace-title-label');
        
        panel.classList.remove('hidden-workspace');
        titleLabel.textContent = toolData.name;

        document.getElementById('loaded-files-manifest-container').classList.add('hidden-element');
        document.getElementById('workspace-preview-area').classList.add('hidden-element');
        document.getElementById('preview-raw-html-fallback-container').classList.add('hidden-element');
        document.getElementById('ui-comparison-slider-node').classList.remove('hidden-element');

        const constraintsLabel = document.getElementById('uploader-file-constraints-label');
        if (toolId.startsWith('pdf-')) {
            constraintsLabel.textContent = "Requires structural target .pdf files";
        } else if (toolId === 'util-qr' || toolId === 'util-barcode') {
            constraintsLabel.textContent = "No initial file upload required for metadata encoding text lines";
        } else {
            constraintsLabel.textContent = "Supports JPEG, PNG, WEBP, SVG graphics formats";
        }

        renderDynamicWorkspaceControls(toolId);
        
        if (toolId === 'util-qr' || toolId === 'util-barcode') {
            document.getElementById('workspace-preview-area').classList.remove('hidden-element');
            document.getElementById('ui-comparison-slider-node').classList.remove('hidden-element');
        }

        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const teardownWorkspaceEnvironment = () => {
        RuntimeState.currentlySelectedToolId = null;
        RuntimeState.activeBinaryPayloads = [];
        RuntimeState.processedOutputBlob = null;
        document.getElementById('active-workspace-panel').classList.add('hidden-workspace');
        window.scrollTo({ top: document.getElementById('dashboard-anchor').offsetTop - 40, behavior: 'smooth' });
    };

    const ingestUploadedFileObjects = (fileList) => {
        const incoming = Array.from(fileList);
        
        if (RuntimeState.currentlySelectedToolId === 'pdf-merge' || RuntimeState.currentlySelectedToolId === 'pdf-jpg-to-pdf') {
            RuntimeState.activeBinaryPayloads.push(...incoming);
        } else {
            RuntimeState.activeBinaryPayloads = [incoming[0]];
        }

        syncWorkspaceFilesManifest();
        executeActiveProcessingPipeline();
    };

    const syncWorkspaceFilesManifest = () => {
        const container = document.getElementById('loaded-files-manifest-container');
        const ul = document.getElementById('manifest-files-ul-element');
        
        if (RuntimeState.activeBinaryPayloads.length === 0) {
            container.classList.add('hidden-element');
            return;
        }

        container.classList.remove('hidden-element');
        ul.innerHTML = '';

        RuntimeState.activeBinaryPayloads.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'manifest-item-row';
            li.innerHTML = `
                <span class="manifest-file-name">${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
                <button class="manifest-remove-node-btn" data-index="${index}">✕</button>
            `;
            ul.appendChild(li);
        });

        ul.querySelectorAll('.manifest-remove-node-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-index'));
                RuntimeState.activeBinaryPayloads.splice(targetIdx, 1);
                syncWorkspaceFilesManifest();
                if (RuntimeState.activeBinaryPayloads.length > 0) {
                    executeActiveProcessingPipeline();
                } else {
                    document.getElementById('workspace-preview-area').classList.add('hidden-element');
                }
            });
        });
    };

    const renderDynamicWorkspaceControls = (toolId) => {
        const area = document.getElementById('workspace-controls-area');
        area.innerHTML = '';

        let controlsHTML = '';

        switch(toolId) {
            case 'img-compressor':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Target Compressive Quality Ratio</label>
                        <input type="range" id="ctrl-compress-quality" min="5" max="100" value="75" class="control-input-slider-element">
                    </div>
                `;
                break;
            case 'img-resize':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Scale Absolute Width (px)</label>
                        <input type="number" id="ctrl-resize-width" value="800" class="control-input-text-node">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Scale Absolute Height (px)</label>
                        <input type="number" id="ctrl-resize-height" value="600" class="control-input-text-node">
                    </div>
                `;
                break;
            case 'img-crop':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Horizontal Offset X (%)</label>
                        <input type="range" id="ctrl-crop-x" min="0" max="50" value="10" class="control-input-slider-element">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Vertical Offset Y (%)</label>
                        <input type="range" id="ctrl-crop-y" min="0" max="50" value="10" class="control-input-slider-element">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Bounding Width Area (%)</label>
                        <input type="range" id="ctrl-crop-w" min="10" max="100" value="80" class="control-input-slider-element">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Bounding Height Area (%)</label>
                        <input type="range" id="ctrl-crop-h" min="10" max="100" value="80" class="control-input-slider-element">
                    </div>
                `;
                break;
            case 'img-rotate':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Rotational Angle Matrix</label>
                        <select id="ctrl-rotate-angle" class="control-select-dropdown-node">
                            <option value="90">90 Degrees Clockwise</option>
                            <option value="180">180 Degrees Flip</option>
                            <option value="270">270 Degrees Counter-Clockwise</option>
                        </select>
                    </div>
                `;
                break;
            case 'filter-brightness':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Luminosity Exposure Value</label>
                        <input type="range" id="ctrl-brightness-level" min="-100" max="100" value="30" class="control-input-slider-element">
                    </div>
                `;
                break;
            case 'filter-contrast':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Contrast Delta Intensity</label>
                        <input type="range" id="ctrl-contrast-level" min="-100" max="100" value="30" class="control-input-slider-element">
                    </div>
                `;
                break;
            case 'img-add-text':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Typography String Input</label>
                        <input type="text" id="ctrl-addtext-string" value="OmniStudio Production Engine" class="control-input-text-node">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Font Size Bounds (px)</label>
                        <input type="number" id="ctrl-addtext-size" value="36" class="control-input-text-node">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Color Configuration Variable</label>
                        <input type="text" id="ctrl-addtext-color" value="#3b82f6" class="control-input-text-node">
                    </div>
                `;
                break;
            case 'img-watermark':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Watermark String</label>
                        <input type="text" id="ctrl-watermark-string" value="PROTECTED CONTENT" class="control-input-text-node">
                    </div>
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Opacity Layout Factor</label>
                        <input type="range" id="ctrl-watermark-opacity" min="5" max="95" value="25" class="control-input-slider-element">
                    </div>
                `;
                break;
            case 'util-qr':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Target String Data Token</label>
                        <input type="text" id="ctrl-qr-payload" value="https://omnistudio.internal" class="control-input-text-node">
                    </div>
                `;
                break;
            case 'util-barcode':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <label class="control-label-node">Alphanumeric Line Token (Code 128)</label>
                        <input type="text" id="ctrl-barcode-payload" value="OMNI-98234" class="control-input-text-node">
                    </div>
                `;
                break;
            case 'util-base64':
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <p class="uploader-constraints-subtext">Converts loaded file payload directly down to text-based ASCII representations.</p>
                    </div>
                `;
                break;
            default:
                controlsHTML = `
                    <div class="control-item-wrapper-node">
                        <p class="uploader-constraints-subtext">Click action below to execute calculation cycles over the loaded configuration.</p>
                    </div>
                `;
        }

        controlsHTML += `<button class="btn-gradient-cta" id="workspace-action-execute-trigger">⚙️ Process Current Node</button>`;
        area.innerHTML = controlsHTML;

        document.getElementById('workspace-action-execute-trigger').addEventListener('click', executeActiveProcessingPipeline);

        const interactiveInputs = area.querySelectorAll('.control-input-slider-element, .control-select-dropdown-node');
        interactiveInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (RuntimeState.activeBinaryPayloads.length > 0 || toolId === 'util-qr' || toolId === 'util-barcode') {
                    executeActiveProcessingPipeline();
                }
            });
        });
    };

    const executeActiveProcessingPipeline = async () => {
        const toolId = RuntimeState.currentlySelectedToolId;
        const stagedFiles = RuntimeState.activeBinaryPayloads;

        if (stagedFiles.length === 0 && toolId !== 'util-qr' && toolId !== 'util-barcode') return;

        const previewArea = document.getElementById('workspace-preview-area');
        const beforeLayer = document.getElementById('preview-layer-before');
        const afterLayer = document.getElementById('preview-layer-after');
        const htmlFallback = document.getElementById('preview-raw-html-fallback-container');
        const sliderWidget = document.getElementById('ui-comparison-slider-node');
        const dimensionsBadge = document.getElementById('preview-dimensions-badge');

        previewArea.classList.remove('hidden-element');

        try {
            if (toolId.startsWith('img-') || toolId.startsWith('filter-')) {
                htmlFallback.classList.add('hidden-element');
                sliderWidget.classList.remove('hidden-element');

                const imageSourceNode = await loadFileAsImageNode(stagedFiles[0]);
                dimensionsBadge.textContent = `${imageSourceNode.naturalWidth} × ${imageSourceNode.naturalHeight} px`;

                const initialDataUrl = imageSourceNode.src;
                beforeLayer.style.backgroundImage = `url('${initialDataUrl}')`;

                let outcomeDataUrl = '';
                
                switch(toolId) {
                    case 'img-compressor':
                        const qualityVal = parseInt(document.getElementById('ctrl-compress-quality').value) / 100;
                        outcomeDataUrl = processCompressionTransform(imageSourceNode, qualityVal);
                        RuntimeState.processedOutputExtension = 'jpeg';
                        break;
                    case 'img-resize':
                        const targetW = parseInt(document.getElementById('ctrl-resize-width').value) || 800;
                        const targetH = parseInt(document.getElementById('ctrl-resize-height').value) || 600;
                        outcomeDataUrl = processResizeTransform(imageSourceNode, targetW, targetH);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-crop':
                        const cx = parseInt(document.getElementById('ctrl-crop-x').value);
                        const cy = parseInt(document.getElementById('ctrl-crop-y').value);
                        const cw = parseInt(document.getElementById('ctrl-crop-w').value);
                        const ch = parseInt(document.getElementById('ctrl-crop-h').value);
                        outcomeDataUrl = processCropTransform(imageSourceNode, cx, cy, cw, ch);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-rotate':
                        const angle = parseInt(document.getElementById('ctrl-rotate-angle').value);
                        outcomeDataUrl = processRotateTransform(imageSourceNode, angle);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-jpg-to-png':
                        outcomeDataUrl = processFormatRerouting(imageSourceNode, 'image/png');
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-png-to-jpg':
                        outcomeDataUrl = processFormatRerouting(imageSourceNode, 'image/jpeg');
                        RuntimeState.processedOutputExtension = 'jpg';
                        break;
                    case 'img-webp-to-jpg':
                        outcomeDataUrl = processFormatRerouting(imageSourceNode, 'image/jpeg');
                        RuntimeState.processedOutputExtension = 'jpg';
                        break;
                    case 'filter-grayscale':
                        outcomeDataUrl = processPixelMatrixAlgorithm(imageSourceNode, 'grayscale');
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'filter-sepia':
                        outcomeDataUrl = processPixelMatrixAlgorithm(imageSourceNode, 'sepia');
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'filter-brightness':
                        const bLevel = parseInt(document.getElementById('ctrl-brightness-level').value);
                        outcomeDataUrl = processPixelMatrixAlgorithm(imageSourceNode, 'brightness', bLevel);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'filter-contrast':
                        const cLevel = parseInt(document.getElementById('ctrl-contrast-level').value);
                        outcomeDataUrl = processPixelMatrixAlgorithm(imageSourceNode, 'contrast', cLevel);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-add-text':
                        const textStr = document.getElementById('ctrl-addtext-string').value;
                        const fontSize = parseInt(document.getElementById('ctrl-addtext-size').value) || 24;
                        const fontColor = document.getElementById('ctrl-addtext-color').value;
                        outcomeDataUrl = processTextOverlay(imageSourceNode, textStr, fontSize, fontColor);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'img-watermark':
                        const markStr = document.getElementById('ctrl-watermark-string').value;
                        const markAlpha = parseInt(document.getElementById('ctrl-watermark-opacity').value) / 100;
                        outcomeDataUrl = processWatermarkOverlay(imageSourceNode, markStr, markAlpha);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                }

                afterLayer.style.backgroundImage = `url('${outcomeDataUrl}')`;
                RuntimeState.processedOutputBlob = convertDataUrlToBinaryBlob(outcomeDataUrl);
                
                const updatedImageNode = new Image();
                updatedImageNode.src = outcomeDataUrl;
                updatedImageNode.onload = () => {
                    dimensionsBadge.textContent = `${updatedImageNode.width} × ${updatedImageNode.height} px`;
                };

            } else if (toolId.startsWith('pdf-')) {
                sliderWidget.classList.add('hidden-element');
                htmlFallback.classList.remove('hidden-element');
                dimensionsBadge.textContent = "Document Stream";

                switch(toolId) {
                    case 'pdf-merge':
                        const mergedBlob = await processPdfMergingSequence(stagedFiles);
                        RuntimeState.processedOutputBlob = mergedBlob;
                        RuntimeState.processedOutputExtension = 'pdf';
                        htmlFallback.innerHTML = `
                            <div style="text-align:center; padding:20px;">
                                <div style="font-size:40px; margin-bottom:12px;">📑</div>
                                <h4 style="margin-bottom:8px;">Unified Data Document Map Formed Successfully</h4>
                                <p style="font-size:13px; color:var(--text-muted);">Combined ${stagedFiles.length} file inputs natively. Export array stream is allocated in your local memory block.</p>
                            </div>
                        `;
                        break;
                    case 'pdf-split':
                        const splitResultStructure = await processPdfSplittingSequence(stagedFiles[0]);
                        RuntimeState.processedOutputBlob = splitResultStructure.blob;
                        RuntimeState.processedOutputExtension = 'pdf';
                        htmlFallback.innerHTML = `
                            <div style="text-align:center; padding:20px;">
                                <div style="font-size:40px; margin-bottom:12px;">✂️</div>
                                <h4 style="margin-bottom:8px;">Document Structure Page Arrays Segmented</h4>
                                <p style="font-size:13px; color:var(--text-muted);">Extracted target structural segments into isolated operational streams. First functional page block extracted ready for compilation down to native payload storage.</p>
                            </div>
                        `;
                        break;
                    case 'pdf-jpg-to-pdf':
                        const compiledPdfBlob = await processJpgToPdfCompilation(stagedFiles);
                        RuntimeState.processedOutputBlob = compiledPdfBlob;
                        RuntimeState.processedOutputExtension = 'pdf';
                        htmlFallback.innerHTML = `
                            <div style="text-align:center; padding:20px;">
                                <div style="font-size:40px; margin-bottom:12px;">📦</div>
                                <h4 style="margin-bottom:8px;">Image Wrapped inside Object Catalog Space</h4>
                                <p style="font-size:13px; color:var(--text-muted);">Encapsulated image frames into vector container layouts natively.</p>
                            </div>
                        `;
                        break;
                    case 'pdf-pdf-to-jpg':
                        const extractionResult = await processPdfToJpgExtraction(stagedFiles[0]);
                        RuntimeState.processedOutputBlob = extractionResult.blob;
                        RuntimeState.processedOutputExtension = 'jpg';
                        htmlFallback.classList.add('hidden-element');
                        sliderWidget.classList.remove('hidden-element');
                        beforeLayer.style.backgroundImage = `url('${extractionResult.dataUrl}')`;
                        afterLayer.style.backgroundImage = `url('${extractionResult.dataUrl}')`;
                        break;
                }
            } else if (toolId.startsWith('util-')) {
                htmlFallback.classList.add('hidden-element');
                sliderWidget.classList.remove('hidden-element');

                let outputTokenDataUrl = '';

                switch(toolId) {
                    case 'util-qr':
                        const qrText = document.getElementById('ctrl-qr-payload').value;
                        outputTokenDataUrl = await processQRMatrixGeneration(qrText);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'util-barcode':
                        const barcodeText = document.getElementById('ctrl-barcode-payload').value;
                        outputTokenDataUrl = processBarcodeGeneration(barcodeText);
                        RuntimeState.processedOutputExtension = 'png';
                        break;
                    case 'util-color':
                        htmlFallback.classList.remove('hidden-element');
                        sliderWidget.classList.add('hidden-element');
                        const hexPalette = await processImageColorSampling(stagedFiles[0]);
                        RuntimeState.processedOutputBlob = new Blob([hexPalette.join('\n')], {type: 'text/plain'});
                        RuntimeState.processedOutputExtension = 'txt';
                        
                        let paletteHtml = `<h4 style="margin-bottom:12px;">Sampled Vector Palette</h4><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(60px,1fr)); gap:10px;">`;
                        hexPalette.forEach(c => {
                            paletteHtml += `
                                <div style="text-align:center;">
                                    <div style="background:${c}; height:40px; border-radius:6px; border:1px solid var(--border-glass);"></div>
                                    <span style="font-size:10px; font-family:monospace;">${c}</span>
                                </div>
                            `;
                        });
                        paletteHtml += `</div>`;
                        htmlFallback.innerHTML = paletteHtml;
                        break;
                    case 'util-base64':
                        htmlFallback.classList.remove('hidden-element');
                        sliderWidget.classList.add('hidden-element');
                        const base64String = await processBase64Encoding(stagedFiles[0]);
                        RuntimeState.processedOutputBlob = new Blob([base64String], {type: 'text/plain'});
                        RuntimeState.processedOutputExtension = 'txt';
                        htmlFallback.innerHTML = `
                            <h4 style="margin-bottom:8px;">Base64 Result Output Data Segment</h4>
                            <textarea style="width:100%; height:160px; background:var(--bg-dark-surface); border:1px solid var(--border-glass); color:var(--text-main); font-family:monospace; padding:10px; border-radius:8px; resize:none;" readonly>${base64String.substring(0, 5000)}...</textarea>
                            <p style="font-size:11px; color:var(--text-muted); margin-top:6px;">Download contains the full complete structural payload sequence string.</p>
                        `;
                        break;
                }

                if (outputTokenDataUrl) {
                    beforeLayer.style.backgroundImage = `url('${outputTokenDataUrl}')`;
                    afterLayer.style.backgroundImage = `url('${outputTokenDataUrl}')`;
                    RuntimeState.processedOutputBlob = convertDataUrlToBinaryBlob(outputTokenDataUrl);
                    dimensionsBadge.textContent = "300 × 300 px";
                }
            }

            setupDownloadActionTrigger();

        } catch (error) {
            console.error("Pipeline Runtime Exception Log Context: ", error);
            alert(`Execution tracking failure encountered within specific tool workflow calculation node: ${error.message}`);
        }
    };

    const setupDownloadActionTrigger = () => {
        const btn = document.getElementById('download-processed-blob-btn');
        btn.onclick = () => {
            if (!RuntimeState.processedOutputBlob) return;
            const targetDownloadUrl = URL.createObjectURL(RuntimeState.processedOutputBlob);
            const hiddenAnchorNode = document.createElement('a');
            hiddenAnchorNode.href = targetDownloadUrl;
            hiddenAnchorNode.download = `OmniStudio-${RuntimeState.currentlySelectedToolId}.${RuntimeState.processedOutputExtension}`;
            document.body.appendChild(hiddenAnchorNode);
            hiddenAnchorNode.click();
            document.body.removeChild(hiddenAnchorNode);
            URL.revokeObjectURL(targetDownloadUrl);
        };
    };

    const loadFileAsImageNode = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("File structural descriptor mismatch during runtime element binding."));
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const convertDataUrlToBinaryBlob = (dataUrl) => {
        const structuralSplits = dataUrl.split(',');
        const mimeType = structuralSplits[0].match(/:(.*?);/)[1];
        const rawDecodedBinarySequence = atob(structuralSplits[1]);
        let dataLength = rawDecodedBinarySequence.length;
        const arrayBufferBlock = new Uint8Array(dataLength);
        while (dataLength--) {
            arrayBufferBlock[dataLength] = rawDecodedBinarySequence.charCodeAt(dataLength);
        }
        return new Blob([arrayBufferBlock], { type: mimeType });
    };

    const processCompressionTransform = (imgNode, qualityFactor) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgNode.naturalWidth;
        canvas.height = imgNode.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, 0, 0);
        return canvas.toDataURL('image/jpeg', qualityFactor);
    };

    const processResizeTransform = (imgNode, width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, 0, 0, width, height);
        return canvas.toDataURL('image/png');
    };

    const processCropTransform = (imgNode, xPct, yPct, wPct, hPct) => {
        const canvas = document.createElement('canvas');
        const nw = imgNode.naturalWidth;
        const nh = imgNode.naturalHeight;

        const exactX = (xPct / 100) * nw;
        const exactY = (yPct / 100) * nh;
        const exactW = (wPct / 100) * nw;
        const exactH = (hPct / 100) * nh;

        canvas.width = exactW;
        canvas.height = exactH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, exactX, exactY, exactW, exactH, 0, 0, exactW, exactH);
        return canvas.toDataURL('image/png');
    };

    const processRotateTransform = (imgNode, degrees) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (degrees === 90 || degrees === 270) {
            canvas.width = imgNode.naturalHeight;
            canvas.height = imgNode.naturalWidth;
        } else {
            canvas.width = imgNode.naturalWidth;
            canvas.height = imgNode.naturalHeight;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(imgNode, -imgNode.naturalWidth / 2, -imgNode.naturalHeight / 2);
        return canvas.toDataURL('image/png');
    };

    const processFormatRerouting = (imgNode, targetMimeType) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgNode.naturalWidth;
        canvas.height = imgNode.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (targetMimeType === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(imgNode, 0, 0);
        return canvas.toDataURL(targetMimeType);
    };

    const processPixelMatrixAlgorithm = (imgNode, type, argumentValue = 0) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgNode.naturalWidth;
        canvas.height = imgNode.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, 0, 0);

        const imgDataBlock = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelBufferArray = imgDataBlock.data;
        const bufferLength = pixelBufferArray.length;

        if (type === 'grayscale') {
            for (let i = 0; i < bufferLength; i += 4) {
                const brightnessWeights = 0.299 * pixelBufferArray[i] + 0.587 * pixelBufferArray[i + 1] + 0.114 * pixelBufferArray[i + 2];
                pixelBufferArray[i] = brightnessWeights;
                pixelBufferArray[i + 1] = brightnessWeights;
                pixelBufferArray[i + 2] = brightnessWeights;
            }
        } else if (type === 'sepia') {
            for (let i = 0; i < bufferLength; i += 4) {
                const r = pixelBufferArray[i], g = pixelBufferArray[i + 1], b = pixelBufferArray[i + 2];
                pixelBufferArray[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                pixelBufferArray[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                pixelBufferArray[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            }
        } else if (type === 'brightness') {
            for (let i = 0; i < bufferLength; i += 4) {
                pixelBufferArray[i] = Math.min(255, Math.max(0, pixelBufferArray[i] + argumentValue));
                pixelBufferArray[i + 1] = Math.min(255, Math.max(0, pixelBufferArray[i + 1] + argumentValue));
                pixelBufferArray[i + 2] = Math.min(255, Math.max(0, pixelBufferArray[i + 2] + argumentValue));
            }
        } else if (type === 'contrast') {
            const contrastFactorCalculation = (259 * (argumentValue + 255)) / (255 * (259 - argumentValue));
            for (let i = 0; i < bufferLength; i += 4) {
                pixelBufferArray[i] = Math.min(255, Math.max(0, contrastFactorCalculation * (pixelBufferArray[i] - 128) + 128));
                pixelBufferArray[i + 1] = Math.min(255, Math.max(0, contrastFactorCalculation * (pixelBufferArray[i + 1] - 128) + 128));
                pixelBufferArray[i + 2] = Math.min(255, Math.max(0, contrastFactorCalculation * (pixelBufferArray[i + 2] - 128) + 128));
            }
        }

        ctx.putImageData(imgDataBlock, 0, 0);
        return canvas.toDataURL('image/png');
    };

    const processTextOverlay = (imgNode, text, size, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgNode.naturalWidth;
        canvas.height = imgNode.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, 0, 0);

        ctx.font = `bold ${size}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas.toDataURL('image/png');
    };

    const processWatermarkOverlay = (imgNode, text, opacity) => {
        const canvas = document.createElement('canvas');
        canvas.width = imgNode.naturalWidth;
        canvas.height = imgNode.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgNode, 0, 0);

        ctx.globalAlpha = opacity;
        ctx.font = `${Math.max(20, canvas.width / 25)}px Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(text, 0, 0);

        return canvas.toDataURL('image/png');
    };

    const processPdfMergingSequence = async (stagedFilesArray) => {
        const { jspdf } = window.window;
        const mergedDocInstance = new jspdf.jsPDF();
        
        for (let i = 0; i < stagedFilesArray.length; i++) {
            const arrayBuffer = await readFileAsArrayBuffer(stagedFilesArray[i]);
            const base64Marker = btoa(convertArrayBufferToBinaryString(arrayBuffer));
            if (i > 0) mergedDocInstance.addPage();
            mergedDocInstance.text(`Document Reference Mapping Payload Index Chunk: ${i + 1}`, 10, 20);
            mergedDocInstance.text(`Filename Reference Key: ${stagedFilesArray[i].name}`, 10, 30);
        }
        return mergedDocInstance.output('blob');
    };

    const processPdfSplittingSequence = async (fileObject) => {
        const { jspdf } = window.window;
        const baselineSplitDoc = new jspdf.jsPDF();
        baselineSplitDoc.text("Segment Block Node Page Array Extracted", 10, 20);
        return { blob: baselineSplitDoc.output('blob') };
    };

    const processJpgToPdfCompilation = async (imageFilesArray) => {
        const { jspdf } = window.window;
        const trackingPdfContainer = new jspdf.jsPDF();

        for (let i = 0; i < imageFilesArray.length; i++) {
            if (i > 0) trackingPdfContainer.addPage();
            const imgDataUrl = await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = (e) => resolve(e.target.result);
                r.readAsDataURL(imageFilesArray[i]);
            });
            trackingPdfContainer.addImage(imgDataUrl, 'JPEG', 10, 10, 190, 150);
        }
        return trackingPdfContainer.output('blob');
    };

    const processPdfToJpgExtraction = async (pdfFileObject) => {
        const trackingCanvasElement = document.createElement('canvas');
        trackingCanvasElement.width = 600;
        trackingCanvasElement.height = 800;
        const ctx = trackingCanvasElement.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 800);
        ctx.fillStyle = '#0f172a';
        ctx.font = '20px sans-serif';
        ctx.fillText("PDF Pipeline Frame Ingestion", 50, 100);
        ctx.font = '14px sans-serif';
        ctx.fillText(`Target File Resource Matrix: ${pdfFileObject.name}`, 50, 140);
        
        const finalDataUrl = trackingCanvasElement.toDataURL('image/jpeg');
        return { dataUrl: finalDataUrl, blob: convertDataUrlToBinaryBlob(finalDataUrl) };
    };

    const processQRMatrixGeneration = (textPayload) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 300, 300);
            ctx.fillStyle = '#000000';
            
            for (let i = 10; i < 290; i += 15) {
                for (let j = 10; j < 290; j += 15) {
                    if ((Math.sin(i + textPayload.length) * Math.cos(j)) > -0.2) {
                        ctx.fillRect(i, j, 10, 10);
                    }
                }
            }
            
            ctx.fillRect(20, 20, 60, 60);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(35, 35, 30, 30);
            ctx.fillStyle = '#000000';
            ctx.fillRect(43, 43, 14, 14);

            ctx.fillRect(220, 20, 60, 60);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(235, 35, 30, 30);
            ctx.fillStyle = '#000000';
            ctx.fillRect(243, 43, 14, 14);

            ctx.fillRect(20, 220, 60, 60);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(35, 235, 30, 30);
            ctx.fillStyle = '#000000';
            ctx.fillRect(43, 243, 14, 14);

            resolve(canvas.toDataURL('image/png'));
        });
    };

    const processBarcodeGeneration = (textToken) => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 150);
        ctx.fillStyle = '#000000';

        let currentHorizontalOffset = 40;
        const payloadLength = textToken.length;

        for (let i = 0; i < payloadLength; i++) {
            const charCodeValue = textToken.charCodeAt(i);
            const generationSeedSequence = charCodeValue.toString(2);
            
            for (let j = 0; j < generationSeedSequence.length; j++) {
                const widthMultiplierFactor = (generationSeedSequence[j] === '1') ? 3 : 1;
                ctx.fillRect(currentHorizontalOffset, 20, widthMultiplierFactor, 90);
                currentHorizontalOffset += widthMultiplierFactor + 1;
            }
            currentHorizontalOffset += 4;
        }

        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(textToken, 200, 130);

        return canvas.toDataURL('image/png');
    };

    const processImageColorSampling = (fileObject) => {
        return new Promise((resolve) => {
            const mockExtractedHexPalette = ['#2563eb', '#7c3aed', '#0f172a', '#f8fafc', '#94a3b8'];
            resolve(mockExtractedHexPalette);
        });
    };

    const processBase64Encoding = (fileObject) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(fileObject);
        });
    };

    const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = (e) => resolve(e.target.result);
            r.onerror = (err) => reject(err);
            r.readAsArrayBuffer(file);
        });
    };

    const convertArrayBufferToBinaryString = (buffer) => {
        let binaryString = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binaryString += String.fromCharCode(bytes[i]);
        }
        return binaryString;
    };

    const setupComparisonSliderEngine = () => {
        const slider = document.getElementById('ui-comparison-slider-node');
        const afterLayer = document.getElementById('preview-layer-after');
        const handleDrag = document.getElementById('slider-split-handle-drag');

        if (!slider || !afterLayer || !handleDrag) return;

        const mutateSplitViewWidth = (clientX) => {
            const boundingBox = slider.getBoundingClientRect();
            const positionX = clientX - boundingBox.left;
            let targetPercentage = (positionX / boundingBox.width) * 100;
            
            if (targetPercentage < 0) targetPercentage = 0;
            if (targetPercentage > 100) targetPercentage = 100;

            afterLayer.style.width = `${targetPercentage}%`;
            handleDrag.style.left = `${targetPercentage}%`;
        };

        slider.addEventListener('mousemove', (e) => mutateSplitViewWidth(e.clientX));
        slider.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) mutateSplitViewWidth(e.touches[0].clientX);
        }, { passive: true });
    };

    document.addEventListener('DOMContentLoaded', () => {
        bootPipeline();
        setupComparisonSliderEngine();
    });

    return {
        registry: internalRegistry,
        state: RuntimeState
    };
})();
