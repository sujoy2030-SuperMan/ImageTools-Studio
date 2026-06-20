document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const workspace = document.getElementById('workspace');

    let originalFile = null;

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) return;
        originalFile = file;
        originalSize.textContent = formatBytes(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            compressImage(e.target.result, qualitySlider.value / 100);
            workspace.style.display = 'block';
        };
        reader.readAsDataURL(file);
    };

    const compressImage = (base64, quality) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            compressedPreview.src = compressedBase64;
            
            // Calculate approximate size
            const strLength = compressedBase64.split(',')[1].length;
            const sizeInBytes = Math.floor(strLength * (3/4));
            compressedSize.textContent = formatBytes(sizeInBytes);
            
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = `compressed-${originalFile.name.split('.')[0]}.jpg`;
                link.href = compressedBase64;
                link.click();
            };
        };
        img.src = base64;
    };

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalPreview.src) {
            compressImage(originalPreview.src, e.target.value / 100);
        }
    });
});
