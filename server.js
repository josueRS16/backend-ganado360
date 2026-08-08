require('dotenv').config();
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./src/routes/index');
const swaggerSpecs = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation (CDN assets — evita fallos de estáticos en Vercel)
const swaggerCdn = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0';

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpecs);
});

app.get(['/api-docs', '/api-docs/'], (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Ganado360 API Documentation</title>
  <link rel="stylesheet" href="${swaggerCdn}/swagger-ui.min.css" />
  <style>
    body { margin: 0; background: #fafafa; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${swaggerCdn}/swagger-ui-bundle.min.js"></script>
  <script src="${swaggerCdn}/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        tryItOutEnabled: true,
        requestInterceptor: function (req) {
          if (req.url && req.url.indexOf('?') !== -1) {
            var parts = req.url.split('?');
            var baseUrl = parts[0];
            var params = new URLSearchParams(parts[1]);
            var cleanParams = new URLSearchParams();
            params.forEach(function (value, key) {
              var cleanValue = value;
              if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                cleanValue = value.slice(1, -1);
              }
              cleanParams.append(key, cleanValue);
            });
            req.url = baseUrl + '?' + cleanParams.toString();
          }
          return req;
        }
      });
    };
  </script>
</body>
</html>`);
});

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

// En Vercel se exporta la app (serverless); en local se escucha el puerto.
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
  });
}