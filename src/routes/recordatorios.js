
const express = require('express');
const recordatoriosController = require('../controllers/recordatorios.controller');
const router = express.Router();
// Cambiar estado de recordatorio (hecho/pendiente)
router.patch('/:id/estado', recordatoriosController.updateEstado);
// Recordatorios automáticos (no guardados en BD)
router.get('/auto', recordatoriosController.getAutomaticos);

/**
 * @swagger
 * tags:
 *   name: Recordatorios
 *   description: Gestión de recordatorios para animales
 */

/**
 * @swagger
 * /recordatorios:
 *   get:
 *     summary: Obtener todos los recordatorios
 *     tags: [Recordatorios]
 *     responses:
 *       200:
 *         description: Lista de recordatorios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recordatorio'
 *                 count:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', recordatoriosController.getAll);

/**
 * @swagger
 * /recordatorios/{id}:
 *   get:
 *     summary: Obtener un recordatorio por ID
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recordatorio
 *     responses:
 *       200:
 *         description: Recordatorio encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Recordatorio'
 *       404:
 *         description: Recordatorio no encontrado
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
router.get('/:id', recordatoriosController.getById);

/**
 * @swagger
 * /recordatorios:
 *   post:
 *     summary: Crear un nuevo recordatorio
 *     tags: [Recordatorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Animal
 *               - Titulo
 *               - Descripcion
 *               - Fecha_Recordatorio
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal
 *               Titulo:
 *                 type: string
 *                 description: Título del recordatorio
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del recordatorio
 *               Fecha_Recordatorio:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del recordatorio
 *     responses:
 *       201:
 *         description: Recordatorio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Recordatorio'
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
router.post('/', recordatoriosController.create);

/**
 * @swagger
 * /recordatorios/{id}:
 *   put:
 *     summary: Actualizar un recordatorio
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recordatorio
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
 *               Titulo:
 *                 type: string
 *                 description: Título del recordatorio
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del recordatorio
 *               Fecha_Recordatorio:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del recordatorio
 *     responses:
 *       200:
 *         description: Recordatorio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Recordatorio'
 *       404:
 *         description: Recordatorio no encontrado
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
router.put('/:id', recordatoriosController.update);

/**
 * @swagger
 * /recordatorios/{id}:
 *   delete:
 *     summary: Eliminar un recordatorio
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recordatorio
 *     responses:
 *       200:
 *         description: Recordatorio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Recordatorio no encontrado
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
router.delete('/:id', recordatoriosController.delete);

module.exports = router;