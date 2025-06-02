"""
DocToPPT - Aplicação Flask Principal
Gerador de Apresentações PowerPoint com IA
"""

import os
import logging
from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join(app.instance_path, app.config['UPLOAD_FOLDER'])
    os.makedirs(upload_dir, exist_ok=True)
    
    # Error handlers
    @app.errorhandler(RequestEntityTooLarge)
    def handle_file_too_large(e):
        flash('Arquivo muito grande. Tamanho máximo: 16MB', 'error')
        return redirect(url_for('index')), 413
    
    @app.errorhandler(404)
    def not_found(e):
        return render_template('error.html', error="Página não encontrada"), 404
    
    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"Server error: {e}")
        return render_template('error.html', error="Erro interno do servidor"), 500
    
    # Utility functions
    def allowed_file(filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
    
    # Routes
    @app.route('/')
    def index():
        """Home page"""
        return render_template('index.html')
    
    @app.route('/upload', methods=['GET', 'POST'])
    def upload():
        """Upload page and file handling"""
        if request.method == 'GET':
            return render_template('upload.html')
        
        if 'document' not in request.files:
            flash('Nenhum arquivo selecionado', 'error')
            return redirect(request.url)
        
        file = request.files['document']
        
        if file.filename == '':
            flash('Nenhum arquivo selecionado', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            logger.info(f"File uploaded: {filename}")
            flash(f'Arquivo {filename} enviado com sucesso!', 'success')
            
            # TODO: Process the file
            return redirect(url_for('processing', filename=filename))
        else:
            flash('Tipo de arquivo não permitido', 'error')
            return redirect(request.url)
    
    @app.route('/processing/<filename>')
    def processing(filename):
        """Processing status page"""
        return render_template('processing.html', filename=filename)
    
    @app.route('/config')
    def config_page():
        """Configuration page"""
        current_config = {
            'deepseek_configured': bool(app.config.get('DEEPSEEK_API_KEY')),
            'max_slides': app.config['MAX_SLIDES'],
            'language': app.config['DEFAULT_LANGUAGE'],
            'ai_temperature': app.config['AI_TEMPERATURE']
        }
        return render_template('config.html', config=current_config)
    
    @app.route('/result/<filename>')
    def result(filename):
        """Result page"""
        return render_template('result.html', filename=filename)
    
    @app.route('/health')
    def health():
        """Health check endpoint for Docker"""
        return jsonify({
            'status': 'healthy',
            'version': '0.1.0',
            'deepseek_configured': bool(app.config.get('DEEPSEEK_API_KEY'))
        })
    
    @app.route('/api/status/<filename>')
    def api_status(filename):
        """API endpoint for processing status"""
        # TODO: Implement actual status checking
        return jsonify({
            'status': 'processing',
            'progress': 50,
            'message': 'Processando documento...'
        })
    
    return app

# Create the application
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    logger.info(f"Starting DocToPPT application on {host}:{port}")
    logger.info(f"Configuration: {app.config.get('FLASK_ENV', 'default')}")
    logger.info(f"Debug mode: {app.config.get('DEBUG', False)}")
    
    app.run(
        host=host,
        port=port,
        debug=app.config.get('DEBUG', False)
    )
