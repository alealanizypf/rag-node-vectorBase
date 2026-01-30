
# RAG Node.js (Gratis) — Qdrant + BGE + Groq

Implementación base de **RAG 100% gratuita** en Node.js:
- **Embeddings**: BGE (open‑source) vía [`@xenova/transformers`]
- **Vector DB**: Qdrant (Docker)
- **LLM**: Groq API con modelo Llama
- **API**: Express

---
## Requisitos
- Node.js 18+
- Docker y Docker Compose

---
## Levantar infraestructura
Usa Docker Compose para levantar Qdrant:

```bash
docker-compose up -d
```

Esto iniciará:
- **Qdrant**: http://localhost:6333

---
## Configuración del proyecto
```bash
git clone <este-repo>
cd rag-node-base
cp .env.example .env
npm install
```

Variables clave en `.env`:
- `QDRANT_URL` (por defecto `http://qdrant:6333` o `http://localhost:6333`)
- `QDRANT_COLLECTION` (por defecto `documentos`)
- `EMBEDDING_MODEL` (por defecto `Xenova/bge-small-en-v1.5`)
- `GROQ_API_KEY` (requerida, obtén en https://console.groq.com/)
- `GROQ_MODEL` (por defecto `llama3-8b-8192`)
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
- Groq ofrece uso gratuito con límites de velocidad. Obtén tu API key en https://console.groq.com/
- Si prefieres otra base vectorial, la interfaz de embeddings y chunking es independiente.

---
## Licencia
MIT
