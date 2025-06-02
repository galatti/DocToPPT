/**
 * DocToPPT - Upload Page JavaScript
 * Handles drag & drop, file validation, and upload functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
});

function initializeUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('document');
    const uploadForm = document.getElementById('uploadForm');
    const filePreview = document.getElementById('filePreview');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!dropZone || !fileInput || !uploadForm) {
        console.error('Upload elements not found');
        return;
    }
    
    // Drag and drop handlers
    setupDragAndDrop(dropZone, fileInput);
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Form submit handler
    uploadForm.addEventListener('submit', handleFormSubmit);
    
    // Remove file handler
    const removeBtn = document.getElementById('removeFile');
    if (removeBtn) {
        removeBtn.addEventListener('click', removeSelectedFile);
    }
    
    console.log('Upload page initialized');
}

/**
 * Setup drag and drop functionality
 */
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
    
    // Handle click to open file dialog
    dropZone.addEventListener('click', () => {
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
            handleFiles(files);
        }
    }
}

/**
 * Handle file selection (both drag & drop and click)
 */
function handleFiles(files) {
    const file = files[0]; // Only handle the first file
    
    if (!file) return;
    
    // Validate file
    const validation = DocToPPT.validateFile(file);
    if (!validation.valid) {
        DocToPPT.showToast(validation.error, 'error');
        return;
    }
    
    // Update file input
    const fileInput = document.getElementById('document');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // Show file preview
    showFilePreview(file);
    
    // Animate preview
    const preview = document.getElementById('filePreview');
    DocToPPT.animateIn(preview, 'slide-up');
    
    DocToPPT.showToast(`Arquivo "${file.name}" selecionado com sucesso!`, 'success');
}

/**
 * Handle file input change
 */
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        showFilePreview(files[0]);
    }
}

/**
 * Show file preview
 */
function showFilePreview(file) {
    const preview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const dropZone = document.getElementById('dropZone');
    
    if (!preview || !fileName || !fileSize) return;
    
    // Update preview content
    fileName.textContent = file.name;
    fileSize.textContent = DocToPPT.formatFileSize(file.size);
    
    // Update icon based on file type
    const extension = DocToPPT.getFileExtension(file.name);
    const iconClass = DocToPPT.getFileIconClass(extension);
    const icon = preview.querySelector('.bi-file-earmark');
    if (icon) {
        icon.className = `bi ${iconClass} me-3`;
        icon.style.fontSize = '2rem';
    }
    
    // Show preview and hide drop zone
    preview.classList.remove('d-none');
    dropZone.style.display = 'none';
    
    // Enable submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

/**
 * Remove selected file
 */
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
    }
    
    if (dropZone) {
        dropZone.style.display = 'block';
    }
    
    // Disable submit button
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    
    DocToPPT.showToast('Arquivo removido', 'info');
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submitBtn');
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    DocToPPT.showLoading(submitBtn, 'Processando...');
    
    // Submit form
    submitForm(form, formData)
        .then(response => {
            if (response.success) {
                // Redirect to processing page
                window.location.href = response.redirect || `/processing/${response.filename}`;
            } else {
                throw new Error(response.error || 'Erro no processamento');
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            DocToPPT.showToast(error.message || 'Erro ao enviar arquivo', 'error');
            DocToPPT.hideLoading(submitBtn, originalText);
        });
}

/**
 * Validate form before submission
 */
function validateForm(formData) {
    const document = formData.get('document');
    
    if (!document || !document.name) {
        DocToPPT.showToast('Selecione um documento para continuar', 'error');
        return false;
    }
    
    // Validate file again
    const validation = DocToPPT.validateFile(document);
    if (!validation.valid) {
        DocToPPT.showToast(validation.error, 'error');
        return false;
    }
    
    // Validate template if provided
    const template = formData.get('template');
    if (template && template.name) {
        const templateExtension = DocToPPT.getFileExtension(template.name);
        if (templateExtension !== 'pptx') {
            DocToPPT.showToast('Template deve ser um arquivo .pptx', 'error');
            return false;
        }
        
        if (template.size > 32 * 1024 * 1024) { // 32MB for templates
            DocToPPT.showToast('Template muito grande. Máximo: 32MB', 'error');
            return false;
        }
    }
    
    return true;
}

/**
 * Submit form via AJAX
 */
async function submitForm(form, formData) {
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });
        
        // Handle different response types
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        // If it's a redirect (HTML response), follow it
        if (response.redirected) {
            window.location.href = response.url;
            return { success: true };
        }
        
        // For other HTML responses, check if it's an error page
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // If we get here, it might be the processing page HTML
        // Let's redirect manually
        const filename = formData.get('document').name;
        return {
            success: true,
            redirect: `/processing/${encodeURIComponent(filename)}`
        };
        
    } catch (error) {
        console.error('Form submission error:', error);
        throw error;
    }
}

/**
 * Update upload progress (for future enhancement)
 */
function updateProgress(percent) {
    const progressContainer = document.querySelector('.progress');
    
    if (!progressContainer) {
        // Create progress bar if it doesn't exist
        const form = document.getElementById('uploadForm');
        const progressHtml = `
            <div class="progress mb-3">
                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style="width: ${percent}%" 
                     aria-valuenow="${percent}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                    ${percent}%
                </div>
            </div>
        `;
        form.insertAdjacentHTML('beforeend', progressHtml);
    } else {
        const progressBar = progressContainer.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.setAttribute('aria-valuenow', percent);
            progressBar.textContent = `${percent}%`;
        }
    }
}

/**
 * Handle paste events (for future enhancement)
 */
document.addEventListener('paste', function(event) {
    const items = event.clipboardData.items;
    
    for (let item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
                event.preventDefault();
                handleFiles([file]);
                DocToPPT.showToast('Arquivo colado da área de transferência', 'info');
                break;
            }
        }
    }
});

// Export for testing
window.UploadPage = {
    handleFiles,
    removeSelectedFile,
    validateForm,
    updateProgress
};
