
# RAG Node.js (Gratis) — Qdrant + BGE + Ollama

Implementación base de **RAG 100% gratuita** en Node.js:
- **Embeddings**: BGE (open‑source) vía [`@xenova/transformers`]
- **Vector DB**: Qdrant (Docker)
- **LLM local**: Ollama (por defecto `llama3`)
- **API**: Express

---
## Requisitos
- Node.js 18+
- Docker y Docker Compose

---
## Levantar infraestructura
Usa Docker Compose para levantar Qdrant y Ollama automáticamente:

```bash
docker-compose up -d
```

Esto iniciará:
- **Qdrant**: http://localhost:6333
- **Ollama**: http://localhost:11434

### Descargar modelo en Ollama
Una vez que el contenedor esté corriendo, descarga el modelo `llama3`:

```bash
docker exec ollama-llm ollama pull llama3
```

(Reemplaza `ollama-llm` con el nombre del contenedor si es distinto)

---
## Configuración del proyecto
```bash
git clone <este-repo>
cd rag-node-base
cp .env.example .env
npm install
```

Variables clave en `.env` (se usan las URLs internas de Docker Compose):
- `QDRANT_URL` (por defecto `http://qdrant:6333` o `http://localhost:6333`)
- `QDRANT_COLLECTION` (por defecto `documentos`)
- `EMBEDDING_MODEL` (por defecto `Xenova/bge-small-en-v1.5`)
- `OLLAMA_HOST` (por defecto `http://ollama:11434` o `http://localhost:11434`)
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

### Documentación Swagger
La API incluye documentación interactiva con Swagger UI:
- **URL**: `http://localhost:3000/api-docs`
- Permite probar los endpoints directamente desde el navegador
- Incluye esquemas detallados de request/response

### Endpoints
1. **POST** `/ingest` (multipart/form-data)
   - Campo `file`: un PDF
   - Opcional `docId`: identificador del documento
   ```bash
   curl.exe -X POST -F "file=@C:\Users\user1\Downloads\archivo.pdf" http://localhost:3000/ingest
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
