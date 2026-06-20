document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspect = document.getElementById('maintainAspect');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const workspace = document.getElementById('workspace');

    let originalImg = new Image();
    let aspectRatio = 1;

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImg.onload = () => {
                aspectRatio = originalImg.width / originalImg.height;
                widthInput.value = originalImg.width;
                heightInput.value = originalImg.height;
                preview.src = e.target.result;
                workspace.style.display = 'block';
            };
            originalImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const resizeAndDownload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
        
        const link = document.createElement('a');
        link.download = `resized-image.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    widthInput.addEventListener('input', () => {
        if (maintainAspect.checked) {
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainAspect.checked) {
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    });

    downloadBtn.addEventListener('click', resizeAndDownload);
});
