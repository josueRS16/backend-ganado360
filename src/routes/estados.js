const express = require('express');
const estadosController = require('../controllers/estados.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Solo Administrador puede gestionar estados

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: Gestión de estados de animales
 */

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Obtener todos los estados con filtros y paginación opcional
 *     tags: [Estados]
 *     parameters:
 *       - in: query
 *         name: Nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del estado (búsqueda parcial)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página (requiere limit)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Elementos por página (requiere page)
 *     responses:
 *       200:
 *         description: Lista de estados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estado'
 *                 count:
 *                   type: integer
 *                   description: Número de elementos en la página actual
 *                 pagination:
 *                   type: object
 *                   description: Metadatos de paginación (solo si se proporcionan page y limit)
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                     nextPage:
 *                       type: integer
 *                       nullable: true
 *                     prevPage:
 *                       type: integer
 *                       nullable: true
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Solo Administrador puede ver estados
router.get('/', authMiddleware, authorize(1,2), estadosController.getAll);

/**
 * @swagger
 * /estados/{id}:
 *   get:
 *     summary: Obtener un estado por ID
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Estado'
 *       404:
 *         description: Estado no encontrado
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
// Solo Administrador puede ver un estado
router.get('/:id', authMiddleware, authorize(2), estadosController.getById);

/**
 * @swagger
 * /estados:
 *   post:
 *     summary: Crear un nuevo estado
 *     tags: [Estados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del estado
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del estado
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Estado'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Solo Administrador puede crear estados
router.post('/', authMiddleware, authorize(2), estadosController.create);

/**
 * @swagger
 * /estados/{id}:
 *   put:
 *     summary: Actualizar un estado
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del estado
 *               Descripcion:
 *                 type: string
 *                 description: Descripción del estado
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Estado'
 *       404:
 *         description: Estado no encontrado
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
// Solo Administrador puede actualizar estados
router.put('/:id', authMiddleware, authorize(2), estadosController.update);

/**
 * @swagger
 * /estados/{id}:
 *   delete:
 *     summary: Eliminar un estado
 *     tags: [Estados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Estado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: No se puede eliminar el estado porque está siendo referenciado
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
// Solo Administrador puede eliminar estados
router.delete('/:id', authMiddleware, authorize(2), estadosController.delete);

module.exports = router;