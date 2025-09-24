require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const apiRoutes = require('./src/routes/index');
const swaggerSpecs = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ganado360 API Documentation',
  swaggerOptions: {
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      // Limpiar parámetros de query removiendo comillas
      if (req.url && req.url.includes('?')) {
        const [baseUrl, queryString] = req.url.split('?');
        const params = new URLSearchParams(queryString);
        const cleanParams = new URLSearchParams();
        
        for (const [key, value] of params) {
          // Remover comillas dobles del valor si las tiene
          let cleanValue = value;
          if (value.startsWith('"') && value.endsWith('"')) {
            cleanValue = value.slice(1, -1);
          }
          cleanParams.append(key, cleanValue);
        }
        
        req.url = baseUrl + '?' + cleanParams.toString();
      }
      return req;
    }
  }
}));

// Servir archivos estáticos del directorio uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', apiRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check del servidor
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
