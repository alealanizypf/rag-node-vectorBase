import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RAG Node API',
      version: '1.0.0',
      description: 'API para ingestión y consulta de documentos PDF con RAG',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  explorer: true,
};
