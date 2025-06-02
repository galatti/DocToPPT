/**
 * DocToPPT - Main JavaScript
 * Common functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DocToPPT initialized');
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize alerts auto-dismiss
    initializeAlerts();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize health check
    initializeHealthCheck();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize alert auto-dismiss
 */
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Auto-dismiss success alerts after 5 seconds
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
        
        // Auto-dismiss info alerts after 7 seconds
        if (alert.classList.contains('alert-info')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 7000);
        }
    });
}

/**
 * Initialize theme handling
 */
function initializeTheme() {
    // Future enhancement: dark mode toggle
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('theme-dark');
    }
}

/**
 * Initialize health check
 */
function initializeHealthCheck() {
    // Check application health periodically
    setInterval(checkHealth, 30000); // Every 30 seconds
}

/**
 * Check application health
 */
async function checkHealth() {
    try {
        const response = await fetch('/health');
        if (!response.ok) {
            console.warn('Health check failed:', response.status);
            showHealthWarning();
        }
    } catch (error) {
        console.error('Health check error:', error);
        showHealthWarning();
    }
}

/**
 * Show health warning
 */
function showHealthWarning() {
    const existingWarning = document.querySelector('.health-warning');
    if (existingWarning) return; // Don't show multiple warnings
    
    const alertHtml = `
        <div class="alert alert-warning alert-dismissible fade show health-warning" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Conexão com o servidor instável. Algumas funcionalidades podem estar limitadas.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterbegin', alertHtml);
    }
}

/**
 * Utility function to format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Utility function to get file extension
 */
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

/**
 * Utility function to get file icon class based on extension
 */
function getFileIconClass(extension) {
    const icons = {
        'pdf': 'bi-filetype-pdf file-pdf',
        'docx': 'bi-file-earmark-word file-docx',
        'txt': 'bi-file-earmark-text file-txt',
        'md': 'bi-markdown file-md',
        'pptx': 'bi-file-earmark-ppt file-pptx'
    };
    
    return icons[extension] || 'bi-file-earmark';
}

/**
 * Show loading spinner
 */
function showLoading(element, text = 'Carregando...') {
    const spinner = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${text}
    `;
    
    if (element) {
        element.innerHTML = spinner;
        element.disabled = true;
    }
}

/**
 * Hide loading spinner
 */
function hideLoading(element, originalText) {
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="bi bi-${getToastIcon(type)} text-${type} me-2"></i>
                <strong class="me-auto">DocToPPT</strong>
                <small class="text-muted">agora</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Get or create toast container
 */
function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }
    
    return container;
}

/**
 * Get toast icon based on type
 */
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    return icons[type] || 'info-circle';
}

/**
 * Animate element entrance
 */
function animateIn(element, animation = 'fade-in') {
    if (element) {
        element.classList.add(animation);
    }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Texto copiado para a área de transferência!', 'success');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast('Erro ao copiar texto', 'error');
    }
}

/**
 * Debounce function for search/input
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Validate file before upload
 */
function validateFile(file, maxSize = 16 * 1024 * 1024) { // 16MB default
    const allowedTypes = ['pdf', 'docx', 'txt', 'md', 'pptx'];
    const extension = getFileExtension(file.name);
    
    // Check file type
    if (!allowedTypes.includes(extension)) {
        return {
            valid: false,
            error: `Tipo de arquivo não suportado: .${extension}`
        };
    }
    
    // Check file size
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Arquivo muito grande. Máximo: ${formatFileSize(maxSize)}`
        };
    }
    
    return { valid: true };
}

/**
 * Generic AJAX function
 */
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
});

/**
 * Global unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('Erro no processamento. Verifique sua conexão.', 'error');
});

// Export functions for use in other scripts
window.DocToPPT = {
    formatFileSize,
    getFileExtension,
    getFileIconClass,
    showLoading,
    hideLoading,
    showToast,
    animateIn,
    copyToClipboard,
    debounce,
    validateFile,
    makeRequest
};
