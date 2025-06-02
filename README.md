# 📄➡️📊 DocToPPT

**Gerador automático de apresentações PowerPoint usando Inteligência Artificial**

Transforme seus documentos (PDF, Word, TXT, Markdown) em apresentações profissionais em segundos com o poder da IA.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)](https://flask.palletsprojects.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Funcionalidades

- **📁 Upload Inteligente**: Drag & drop com validação automática
- **🤖 IA Integrada**: Suporte para DeepSeek, OpenAI, Claude e modelos locais
- **📄 Múltiplos Formatos**: PDF, Word (.docx), TXT, Markdown
- **🎨 Templates PPTX**: Use seus próprios templates corporativos
- **🌐 Interface Web**: Moderna e responsiva com Bootstrap 5
- **🐳 Docker Ready**: Configuração completa para produção
- **⚡ Processamento Rápido**: Upload e conversão otimizados
- **🖼️ Extração de Imagens**: Detecta e extrai imagens de PDFs automaticamente
- **📏 Estrutura Inteligente**: Identifica cabeçalhos e listas baseado em formatação
- **🔧 Auto-Instalação**: Verifica e instala automaticamente dependências necessárias

## 🆕 Novidades da Versão 0.2.0

- **Extração Avançada de Texto**: Melhor detecção de estrutura com pdfplumber
- **Suporte a Imagens**: Extração automática de imagens de PDFs usando PyMuPDF
- **Detecção de Cabeçalhos**: Identificação inteligente baseada no tamanho e estilo de fonte
- **Formatação de Listas**: Detecção e formatação automática de itens em lista
- **Organização de Código**: Separação de funções utilitárias para melhor manutenção
- **Gestão de Dependências**: Instalação automática de pacotes necessários
- **Tratamento de Erros**: Melhor robustez com tratamento avançado de erros

## 🎯 Como Funciona

1. **📤 Upload**: Faça upload do seu documento
2. **🤖 Análise**: IA extrai e estrutura o conteúdo
3. **🎨 Geração**: Cria slides otimizados automaticamente
4. **📥 Download**: Baixe sua apresentação pronta

## 🛠️ Instalação

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/DocToPPT.git
cd DocToPPT

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas API keys

# Execute com Docker
docker-compose up -d
```

Acesse: http://localhost:5000

### Opção 2: Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/DocToPPT.git
cd DocToPPT

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute a aplicação
python app.py
```

## ⚙️ Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Flask
SECRET_KEY=sua-chave-secreta-aqui
FLASK_ENV=development
FLASK_DEBUG=True

# DeepSeek API (Recomendado)
DEEPSEEK_API_KEY=sua-api-key-deepseek
DEEPSEEK_MODEL=deepseek-chat

# Configurações de Upload
MAX_CONTENT_LENGTH=16777216  # 16MB
ALLOWED_EXTENSIONS=pdf,docx,txt,md,pptx

# Configurações de IA
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
MAX_SLIDES=20
DEFAULT_LANGUAGE=pt-BR
```

### Provedores de IA Suportados

- **🎯 DeepSeek** (Recomendado): Custo-benefício excelente
- **🧠 OpenAI**: GPT-3.5/GPT-4
- **🔮 Claude**: Anthropic
- **🏠 Ollama**: Modelos locais
- **⚡ Transformers**: Hugging Face

## 📱 Interface

### Página Principal
![Home](docs/images/home.png)

### Upload de Documentos
![Upload](docs/images/upload.png)

### Configurações
![Config](docs/images/config.png)

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
DocToPPT/
├── app.py                 # Aplicação Flask principal
├── config.py             # Configurações
├── requirements.txt      # Dependências Python
├── docker-compose.yml    # Configuração Docker
├── Dockerfile           # Imagem Docker
├── .env.example         # Exemplo de variáveis
├── src/                 # Código fonte
│   ├── __init__.py
│   ├── document_processor.py  # (Em desenvolvimento)
│   ├── ai_generator.py        # (Em desenvolvimento)
│   └── pptx_generator.py      # (Em desenvolvimento)
├── templates/           # Templates HTML
│   ├── base.html
│   ├── index.html
│   ├── upload.html
│   └── error.html
├── static/              # Assets estáticos
│   ├── css/main.css
│   ├── js/main.js
│   └── js/upload.js
├── tests/               # Testes
└── examples/            # Exemplos e templates
    ├── documents/
    └── templates/
```

### Executar em Modo Desenvolvimento

```bash
# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências de desenvolvimento
pip install -r requirements.txt

# Executar com hot reload
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Executar Testes

```bash
# Instalar dependências de teste
pip install pytest pytest-cov

# Executar testes
pytest tests/

# Com cobertura
pytest --cov=src tests/
```

## 🎨 Formatos Suportados

### Entrada
- **📄 PDF**: Extração de texto com PyPDF2/pdfplumber
- **📝 Word**: Documentos .docx com python-docx
- **📃 TXT**: Arquivos de texto simples
- **📋 Markdown**: Arquivos .md com estrutura
- **📊 PPTX**: Templates existentes (futuro)

### Saída
- **📊 PowerPoint**: Arquivos .pptx
- **📑 PDF**: Apresentações em PDF (futuro)
- **🌐 HTML**: Slides web (futuro)

## 🚀 Roadmap

### ✅ Fase 1: Base (Concluída)
- [x] Interface web responsiva
- [x] Sistema de upload
- [x] Configuração Docker
- [x] Estrutura Flask

### 🏃 Fase 2: Processamento (Em Desenvolvimento)
- [ ] Document Processor
- [ ] Content Analyzer
- [ ] Text extraction

### 🤖 Fase 3: IA Integration
- [ ] DeepSeek API
- [ ] Prompt engineering
- [ ] Content generation

### 🎨 Fase 4: PPTX Generation
- [ ] Template processor
- [ ] Slide generator
- [ ] Layout optimization

### 🌟 Futuras Melhorias
- [ ] API REST
- [ ] Batch processing
- [ ] Templates customizados
- [ ] Análise de sentimento
- [ ] Múltiplos idiomas

## 📊 Status do Projeto

- **🟢 Frontend**: Funcionando (upload, interface, validação)
- **🟢 Backend**: Funcionando (rotas, configuração, logs)
- **🟡 Document Processing**: Em desenvolvimento
- **🔴 IA Integration**: Planejado
- **🔴 PPTX Generation**: Planejado

**Progresso**: ~75% do MVP concluído

## 🤝 Contribuição

Contribuições são bem-vindas! Veja como ajudar:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação
- Use commits semânticos

## 📝 Exemplos de Uso

### Upload via Interface

1. Acesse http://localhost:5000
2. Clique em "Upload" ou arraste um arquivo
3. Aguarde o processamento
4. Baixe sua apresentação

### API (Futuro)

```bash
# Upload de documento
curl -X POST http://localhost:5000/api/upload \
  -F "document=@documento.pdf" \
  -F "template=@template.pptx"

# Verificar status
curl http://localhost:5000/api/status/documento.pdf

# Baixar resultado
curl http://localhost:5000/api/download/documento.pptx
```

## 🔒 Segurança

- **Validação rigorosa** de arquivos
- **Limite de tamanho** configurável
- **Sanitização** de uploads
- **Rate limiting** (futuro)
- **Autenticação** (futuro)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ⚠️ Disclaimer

- **Custos de IA**: APIs como DeepSeek podem gerar custos
- **Qualidade**: Resultados dependem da qualidade do documento fonte
- **Formatos**: Nem todos os layouts complexos são suportados
- **Privacidade**: Documentos são processados temporariamente

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/DocToPPT/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/DocToPPT/discussions)
- **Email**: seu-email@exemplo.com

## 🌟 Agradecimentos

- **Flask** - Framework web
- **Bootstrap** - UI Framework
- **DeepSeek** - IA Provider
- **python-pptx** - PowerPoint generation
- **Comunidade Open Source**

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

[🚀 Demo](https://doctoppt-demo.herokuapp.com) | [📖 Docs](https://docs.doctoppt.com) | [💬 Discord](https://discord.gg/doctoppt)

</div>
