const express = require('express');
const historialController = require('../controllers/historial.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Veterinario puede: ver y gestionar historial veterinario
// Administrador puede: todo

/**
 * @swagger
 * tags:
 *   name: Historial
 *   description: Gestión del historial de eventos de animales
 */

/**
 * @swagger
 * /historial:
 *   get:
 *     summary: Obtener todo el historial
 *     tags: [Historial]
 *     parameters:
 *       - in: query
 *         name: ID_Animal
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del animal
 *       - in: query
 *         name: Tipo_Evento
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de evento (búsqueda parcial)
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de aplicación desde (formato YYYY-MM-DD HH:mm:ss)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de aplicación hasta (formato YYYY-MM-DD HH:mm:ss)
 *       - in: query
 *         name: Hecho_Por
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del usuario que realizó el evento
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página (requiere limit para activar paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de registros por página (requiere page para activar paginación, máximo 100)
 *     responses:
 *       200:
 *         description: Lista del historial obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Historial'
 *                 count:
 *                   type: integer
 *                   description: Número de registros en la página actual
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: Página actual
 *                     totalPages:
 *                       type: integer
 *                       description: Total de páginas
 *                     totalCount:
 *                       type: integer
 *                       description: Total de registros
 *                     limit:
 *                       type: integer
 *                       description: Registros por página
 *                     hasNextPage:
 *                       type: boolean
 *                       description: Si hay página siguiente
 *                     hasPrevPage:
 *                       type: boolean
 *                       description: Si hay página anterior
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                       description: Número de página siguiente
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *                       description: Número de página anterior
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Veterinario y Administrador pueden ver historial
router.get('/', authMiddleware, authorize(1, 2), historialController.getAll);

/**
 * @swagger
 * /historial/{id}:
 *   get:
 *     summary: Obtener un evento del historial por ID
 *     tags: [Historial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento del historial
 *     responses:
 *       200:
 *         description: Evento del historial encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Historial'
 *       404:
 *         description: Evento del historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Veterinario y Administrador pueden ver un evento del historial
router.get('/:id', authMiddleware, authorize(1, 2), historialController.getById);

/**
 * @swagger
 * /historial:
 *   post:
 *     summary: Crear un nuevo evento en el historial
 *     tags: [Historial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Animal
 *               - Tipo_Evento
 *               - Descripcion
 *               - Fecha_Aplicacion
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal
 *               Tipo_Evento:
 *                 type: string
 *                 description: Tipo de evento
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del evento
 *               Fecha_Aplicacion:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de aplicación del evento
 *               Proxima_Fecha:
 *                 type: string
 *                 format: date
 *                 description: Próxima fecha programada
 *               Hecho_Por:
 *                 type: integer
 *                 description: ID del usuario que realizó el evento
 *     responses:
 *       201:
 *         description: Evento del historial creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Historial'
 *       409:
 *         description: El animal especificado no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Veterinario y Administrador pueden crear eventos del historial
router.post('/', authMiddleware, authorize(1, 2), historialController.create);

/**
 * @swagger
 * /historial/{id}:
 *   put:
 *     summary: Actualizar un evento del historial
 *     tags: [Historial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento del historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal
 *               Tipo_Evento:
 *                 type: string
 *                 description: Tipo de evento
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del evento
 *               Fecha_Aplicacion:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de aplicación del evento
 *               Proxima_Fecha:
 *                 type: string
 *                 format: date
 *                 description: Próxima fecha programada
 *               Hecho_Por:
 *                 type: integer
 *                 description: ID del usuario que realizó el evento
 *     responses:
 *       200:
 *         description: Evento del historial actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Historial'
 *       404:
 *         description: Evento del historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El animal especificado no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Veterinario y Administrador pueden actualizar eventos del historial
router.put('/:id', authMiddleware, authorize(1, 2), historialController.update);

/**
 * @swagger
 * /historial/{id}:
 *   delete:
 *     summary: Eliminar un evento del historial
 *     tags: [Historial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento del historial
 *     responses:
 *       200:
 *         description: Evento del historial eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Evento del historial no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Veterinario y Administrador pueden eliminar eventos del historial
router.delete('/:id', authMiddleware, authorize(1, 2), historialController.delete);

module.exports = router;