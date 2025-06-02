"""
DocToPPT - Utility Functions
Contains helper functions used by the main app
"""

import os
import logging
import subprocess
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_and_install_missing_packages():
    """Verifica se os pacotes necessários estão instalados e instala os ausentes"""
    try:
        import pkg_resources
        
        # Lista de pacotes necessários
        required_packages = {
            'PyPDF2': '3.0.0',
            'pdfplumber': '0.9.0',
            'pymupdf': '1.22.0',
            'Pillow': '10.0.0',
            'python-pptx': '0.6.21'
        }
        
        # Verificar quais pacotes estão faltando ou desatualizados
        missing = []
        for package, min_version in required_packages.items():
            try:
                pkg_resources.get_distribution(f"{package}>={min_version}")
            except pkg_resources.VersionConflict:
                missing.append(f"{package}>={min_version}")
            except pkg_resources.DistributionNotFound:
                missing.append(f"{package}>={min_version}")
        
        # Instalar pacotes faltando
        if missing:
            logger.warning(f"Pacotes necessários ausentes: {', '.join(missing)}")
            logger.info("Tentando instalar pacotes ausentes...")
            
            # Comando de instalação
            install_command = [sys.executable, "-m", "pip", "install"] + missing
            
            # Executar instalação
            result = subprocess.run(
                install_command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            if result.returncode == 0:
                logger.info("Pacotes instalados com sucesso!")
                return True
            else:
                logger.error(f"Erro ao instalar pacotes: {result.stderr}")
                return False
        else:
            logger.info("Todos os pacotes necessários estão instalados")
            return True
    except Exception as e:
        logger.error(f"Erro ao verificar pacotes: {e}")
        return False

def extract_pdf_images(pdf_path, output_dir):
    """
    Extrai imagens de um arquivo PDF
    
    Args:
        pdf_path: Caminho do arquivo PDF
        output_dir: Diretório onde as imagens serão salvas
        
    Returns:
        Lista de caminhos de imagens extraídas
    """
    try:
        import fitz  # PyMuPDF
        
        image_paths = []
        
        # Criar diretório para as imagens
        os.makedirs(output_dir, exist_ok=True)
        
        # Abrir o PDF com PyMuPDF (fitz)
        pdf = fitz.open(pdf_path)
        
        for page_index in range(len(pdf)):
            # Obter a página
            page = pdf[page_index]
            
            # Listar objetos de imagem
            image_list = page.get_images(full=True)
            
            for img_index, img in enumerate(image_list):
                # Obter dados da imagem
                xref = img[0]  # número de referência
                
                # Extrair imagem
                base_image = pdf.extract_image(xref)
                image_bytes = base_image["image"]
                
                # Determinar a extensão baseado no tipo de imagem
                image_ext = base_image["ext"]
                
                # Salvar a imagem
                image_name = f"image_p{page_index+1}_{img_index+1}.{image_ext}"
                image_path = os.path.join(output_dir, image_name)
                
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                    
                image_paths.append(image_path)
        
        return image_paths
    except Exception as e:
        logger.error(f"Erro ao extrair imagens do PDF: {e}")
        return []
