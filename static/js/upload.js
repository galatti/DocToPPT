/**
 * DocToPPT - Upload Page JavaScript
 * Fixed version with proper file preview handling
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Upload page loaded');
    initializeUpload();
});

function initializeUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('document');
    const uploadForm = document.getElementById('uploadForm');
    
    if (!dropZone || !fileInput || !uploadForm) {
        console.error('Upload elements not found');
        return;
    }
    
    // Disable submit button initially
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    
    // Setup drag and drop
    setupDragAndDrop(dropZone, fileInput);
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Form submit handler with improved feedback
    uploadForm.addEventListener('submit', function(event) {
        const formData = new FormData(uploadForm);
        if (!validateForm(formData)) {
            event.preventDefault();
            return;
        }
        
        // Show loading feedback before submission
        showUploadProgress();
        console.log('Form submitting with file:', formData.get('document').name);
        
        // Let form submit normally after showing feedback
    });
    
    // Remove file handler
    const removeBtn = document.getElementById('removeFile');
    if (removeBtn) {
        removeBtn.addEventListener('click', removeSelectedFile);
    }
    
    console.log('Upload functionality initialized');
}

function setupDragAndDrop(dropZone, fileInput) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle click to open file dialog - FIXED VERSION
    dropZone.addEventListener('click', function(event) {
        // Prevent click if already uploading
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn && submitBtn.disabled && submitBtn.innerHTML.includes('spinner')) {
            return;
        }
        
        // Don't trigger if clicking on the label or button (they handle it natively)
        // This prevents the double file dialog issue
        if (event.target.tagName === 'LABEL' || 
            event.target.closest('label') || 
            event.target.tagName === 'BUTTON') {
            return;
        }
        
        console.log('Drop zone clicked, opening file dialog');
        fileInput.click();
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('dragover');
    }
    
    function unhighlight() {
        dropZone.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            console.log('File dropped:', files[0].name);
            
            // Validate file before setting
            const file = files[0];
            const validation = validateFile(file);
            
            if (!validation.valid) {
                if (window.DocToPPT && DocToPPT.showToast) {
                    DocToPPT.showToast(validation.error, 'error');
                } else {
                    alert(validation.error);
                }
                return;
            }
            
            fileInput.files = files;
            handleFileSelect({ target: { files: files } });
        }
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        console.log('File selected:', file.name);
        
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            if (window.DocToPPT && DocToPPT.showToast) {
                DocToPPT.showToast(validation.error, 'error');
            } else {
                alert(validation.error);
            }
            
            // Clear the input
            event.target.value = '';
            return;
        }
        
        showFilePreview(file);
    }
}

function showFilePreview(file) {
    const preview = document.getElementById('filePreview');
    const dropZone = document.getElementById('dropZone');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!preview) {
        console.error('Preview element not found');
        return;
    }
    
    // Show preview first
    preview.classList.remove('d-none');
    
    // Now find the child elements (they should be accessible after parent is visible)
    const fileName = preview.querySelector('#fileName');
    const fileSize = preview.querySelector('#fileSize');
    
    if (!fileName || !fileSize) {
        console.error('File name or size elements not found in preview');
        return;
    }
    
    // Update preview content
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Show file type icon
    const extension = getFileExtension(file.name);
    const fileIcon = preview.querySelector('i');
    if (fileIcon) {
        fileIcon.className = getFileIconClass(extension);
    }
    
    // Hide drop zone
    if (dropZone) {
        dropZone.style.display = 'none';
    }
    
    // Enable submit button
    if (submitBtn) {
        submitBtn.disabled = false;
    }
    
    console.log('File preview shown for:', file.name);
}

function removeSelectedFile() {
    const fileInput = document.getElementById('document');
    const preview = document.getElementById('filePreview');
    const dropZone = document.getElementById('dropZone');
    const submitBtn = document.getElementById('submitBtn');
    
    // Clear file input
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Hide preview and show drop zone
    if (preview) {
        preview.classList.add('d-none');
        
        // Remove any upload status elements
        const uploadStatus = preview.querySelector('#uploadStatus');
        if (uploadStatus) {
            uploadStatus.remove();
        }
    }
    
    if (dropZone) {
        dropZone.style.display = 'block';
    }
    
    // Reset submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.getAttribute('data-original-text');
        if (originalText) {
            submitBtn.innerHTML = originalText;
        }
    }
    
    console.log('File removed');
}

function validateForm(formData) {
    const document = formData.get('document');
    
    if (!document || !document.name) {
        if (window.DocToPPT && DocToPPT.showToast) {
            DocToPPT.showToast('Selecione um documento para continuar', 'error');
        } else {
            alert('Selecione um documento para continuar');
        }
        return false;
    }
    
    // Use improved validation function
    const validation = validateFile(document);
    if (!validation.valid) {
        if (window.DocToPPT && DocToPPT.showToast) {
            DocToPPT.showToast(validation.error, 'error');
        } else {
            alert(validation.error);
        }
        return false;
    }
    
    return true;
}

function validateFile(file) {
    const allowedTypes = ['pdf', 'docx', 'txt', 'md'];
    const extension = getFileExtension(file.name);
    
    console.log(`Validando arquivo: ${file.name}, extensão: ${extension}, tipo: ${file.type}`);
    
    // Check file type
    if (!allowedTypes.includes(extension)) {
        console.error(`Tipo de arquivo não suportado: .${extension}`);
        return {
            valid: false,
            error: `Tipo de arquivo não suportado: .${extension}. Use: PDF, DOCX, TXT ou MD`
        };
    }
    
    // Check file size (16MB)
    const maxSize = 16 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: ${formatFileSize(maxSize)}`
        };
    }
    
    // Check if file is empty
    if (file.size === 0) {
        return {
            valid: false,
            error: 'Arquivo está vazio'
        };
    }
    
    return { valid: true };
}

function showUploadProgress() {
    const submitBtn = document.getElementById('submitBtn');
    const filePreview = document.getElementById('filePreview');
    
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando arquivo...';
        submitBtn.disabled = true;
        
        // Store original text for potential recovery
        submitBtn.setAttribute('data-original-text', originalText);
    }
    
    // Show upload feedback in file preview
    if (filePreview && !filePreview.classList.contains('d-none')) {
        // Remove existing status if any
        const existingStatus = filePreview.querySelector('#uploadStatus');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        const uploadStatus = document.createElement('div');
        uploadStatus.id = 'uploadStatus';
        uploadStatus.className = 'alert alert-info mt-2 mb-0';
        uploadStatus.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="spinner-border spinner-border-sm me-2"></span>
                <span>Enviando arquivo para processamento...</span>
            </div>
        `;
        filePreview.appendChild(uploadStatus);
    }
    
    // Show toast notification if available
    if (window.DocToPPT && DocToPPT.showToast) {
        DocToPPT.showToast('Enviando arquivo...', 'info');
    }
    
    console.log('Upload progress feedback shown');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getFileIconClass(extension) {
    const icons = {
        'pdf': 'bi-filetype-pdf file-pdf',
        'docx': 'bi-file-earmark-word file-docx',
        'txt': 'bi-file-earmark-text file-txt',
        'md': 'bi-markdown file-md'
    };
    
    return icons[extension] || 'bi-file-earmark';
}
