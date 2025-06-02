import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
      # Upload settings
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'static/uploads')
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'pdf,docx,txt,md,pptx').split(','))
    
    # DeepSeek API settings
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
    DEEPSEEK_BASE_URL = os.getenv('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
    DEEPSEEK_MODEL = os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
    
    # AI generation settings
    AI_TEMPERATURE = float(os.getenv('AI_TEMPERATURE', 0.7))
    AI_MAX_TOKENS = int(os.getenv('AI_MAX_TOKENS', 2000))
    AI_TIMEOUT = int(os.getenv('AI_TIMEOUT', 30))
    
    # Application settings
    MAX_SLIDES = int(os.getenv('MAX_SLIDES', 20))
    DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'pt-BR')
    PROCESSING_TIMEOUT = int(os.getenv('PROCESSING_TIMEOUT', 300))
    
    @staticmethod
    def init_app(app):
        """Initialize the Flask app with this configuration"""
        pass

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    
class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
class DockerConfig(Config):
    """Docker configuration"""
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    @staticmethod
    def init_app(app):
        Config.init_app(app)
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER'])
        os.makedirs(upload_dir, exist_ok=True)

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'docker': DockerConfig,
    'default': DevelopmentConfig
}
