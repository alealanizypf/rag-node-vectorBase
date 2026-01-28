
# RAG Node.js (Gratis) — Qdrant + BGE + Ollama

Implementación base de **RAG 100% gratuita** en Node.js:
- **Embeddings**: BGE (open‑source) vía [`@xenova/transformers`]
- **Vector DB**: Qdrant (Docker)
- **LLM local**: Ollama (por defecto `llama3`)
- **API**: Express

---
## Requisitos
- Node.js 18+
- Docker (para Qdrant)
- (Opcional) [Ollama](https://ollama.com) con un modelo local (por ejemplo `llama3`)

---
## Levantar infraestructura
1) **Qdrant**
```bash
docker run -p 6333:6333 qdrant/qdrant
```
Qdrant quedará en http://localhost:6333

2) **Ollama** (opcional, para respuestas con LLM)
```bash
# Instala Ollama desde https://ollama.com/download
ollama pull llama3
ollama serve  # (si no se inicia automáticamente)
```

---
## Configuración del proyecto
```bash
git clone <este-repo>
cd rag-node-base
cp .env.example .env
npm install
```

Variables clave en `.env`:
- `QDRANT_URL` (por defecto `http://localhost:6333`)
- `QDRANT_COLLECTION` (por defecto `documentos`)
- `EMBEDDING_MODEL` (por defecto `Xenova/bge-small-en-v1.5`)
- `OLLAMA_HOST` (por defecto `http://localhost:11434`)
- `OLLAMA_MODEL` (por defecto `llama3`)
- `CHUNK_SIZE` / `CHUNK_OVERLAP` para trocear texto

---
## Inicializar la colección en Qdrant
Este script calcula el tamaño del embedding y crea la colección con ese tamaño.
```bash
npm run init
```

---
## Ejecutar la API
```bash
npm run start
# o en desarrollo (con nodemon si lo instalas): npm run dev
```
API por defecto en: `http://localhost:3000`

### Endpoints
1. **POST** `/ingest` (multipart/form-data)
   - Campo `file`: un PDF
   - Opcional `docId`: identificador del documento
   ```bash
   curl -F "file=@/ruta/a/archivo.pdf" http://localhost:3000/ingest
   ```
2. **POST** `/query`
   - JSON: `{ "query": "tu pregunta", "topK": 5 }`
   ```bash
   curl -X POST http://localhost:3000/query              -H 'Content-Type: application/json'              -d '{"query":"¿Cuál es la política X?", "topK": 5}'
   ```

---
## Notas
- Si usas un modelo BGE distinto, el script `init` detecta la dimensión automáticamente.
- Transformers.js descargará el modelo la primera vez y lo cacheará en `~/.cache/transformers`.
- Si prefieres otra base vectorial, la interfaz de embeddings y chunking es independiente.

---
## Licencia
MIT
