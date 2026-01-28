
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ingestRouter from './routes/ingest.js';
import queryRouter from './routes/query.js';

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/ingest', ingestRouter);
app.use('/query', queryRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
