const express = require('express');
const historialController = require('../controllers/historial.controller');

const router = express.Router();

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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', historialController.getAll);

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
router.get('/:id', historialController.getById);

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
router.post('/', historialController.create);

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
router.put('/:id', historialController.update);

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
router.delete('/:id', historialController.delete);

module.exports = router;