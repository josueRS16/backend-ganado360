const express = require('express');
const estadoAnimalController = require('../controllers/estadoAnimal.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Solo Administrador puede gestionar estado de animales

/**
 * @swagger
 * tags:
 *   name: Estado Animal
 *   description: Gestión de estados de animales
 */

/**
 * @swagger
 * /estado-animal:
 *   get:
 *     summary: Obtener todos los estados de animales
 *     tags: [Estado Animal]
 *     responses:
 *       200:
 *         description: Lista de estados de animales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EstadoAnimal'
 *                 count:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Solo Administrador puede ver estados de animales
router.get('/', authMiddleware, authorize(2), estadoAnimalController.getAll);

/**
 * @swagger
 * /estado-animal/{id}:
 *   get:
 *     summary: Obtener un estado de animal por ID
 *     tags: [Estado Animal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado del animal
 *     responses:
 *       200:
 *         description: Estado del animal encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EstadoAnimal'
 *       404:
 *         description: Estado del animal no encontrado
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
// Solo Administrador puede ver un estado de animal
router.get('/:id', authMiddleware, authorize(2), estadoAnimalController.getById);

/**
 * @swagger
 * /estado-animal:
 *   post:
 *     summary: Crear un nuevo estado para un animal
 *     tags: [Estado Animal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Animal
 *               - ID_Estado
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal
 *               ID_Estado:
 *                 type: integer
 *                 description: ID del estado
 *               Fecha_Fallecimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fallecimiento del animal
 *     responses:
 *       201:
 *         description: Estado del animal creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EstadoAnimal'
 *       409:
 *         description: El animal o estado especificado no existe
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
// Solo Administrador puede crear estados de animales
router.post('/', authMiddleware, authorize(2), estadoAnimalController.create);

/**
 * @swagger
 * /estado-animal/{id}:
 *   put:
 *     summary: Actualizar un estado de animal
 *     tags: [Estado Animal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado del animal
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
 *               ID_Estado:
 *                 type: integer
 *                 description: ID del estado
 *               Fecha_Fallecimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fallecimiento del animal
 *     responses:
 *       200:
 *         description: Estado del animal actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EstadoAnimal'
 *       404:
 *         description: Estado del animal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El animal o estado especificado no existe
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
// Solo Administrador puede actualizar estados de animales
router.put('/:id', authMiddleware, authorize(2), estadoAnimalController.update);

/**
 * @swagger
 * /estado-animal/{id}:
 *   delete:
 *     summary: Eliminar un estado de animal
 *     tags: [Estado Animal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estado del animal
 *     responses:
 *       200:
 *         description: Estado del animal eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Estado del animal no encontrado
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
// Solo Administrador puede eliminar estados de animales
router.delete('/:id', authMiddleware, authorize(2), estadoAnimalController.delete);

module.exports = router;