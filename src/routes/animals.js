const express = require('express');
const animalsController = require('../controllers/animals.controller');
const recordatoriosController = require('../controllers/recordatorios.controller');
const historialController = require('../controllers/historial.controller');
const estadoAnimalController = require('../controllers/estadoAnimal.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Veterinario puede: ver animales, ver detalle, ver recordatorios, ver historial
// Administrador puede: todo

/**
 * @swagger
 * tags:
 *   name: Animales
 *   description: Gestión de animales del ganado
 */

/**
 * @swagger
 * /animales:
 *   get:
 *     summary: Obtener todos los animales
 *     tags: [Animales]
 *     parameters:
 *       - in: query
 *         name: ID_Categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: Sexo
 *         schema:
 *           type: string
 *           enum: [M, H]
 *         description: Filtrar por sexo
 *       - in: query
 *         name: fechaIngresoDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de ingreso desde (formato YYYY-MM-DD)
 *       - in: query
 *         name: fechaIngresoHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de ingreso hasta (formato YYYY-MM-DD)
 *       - in: query
 *         name: Esta_Preniada
 *         schema:
 *           type: string
 *           enum: ["0", "1", "true", "false"]
 *         description: Filtrar por estado de preñez (1=true, 0=false)
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
 *         description: Lista de animales obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Animal'
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
// Veterinario y Administrador pueden ver animales
router.get('/', authMiddleware, authorize(1, 2), animalsController.getAll);

/**
 * @swagger
 * /animales/con-detalle:
 *   get:
 *     summary: Obtener animales con detalles completos (incluye estado y ventas)
 *     tags: [Animales]
 *     parameters:
 *       - in: query
 *         name: ID_Categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: Sexo
 *         schema:
 *           type: string
 *           enum: [M, H]
 *         description: Filtrar por sexo
 *       - in: query
 *         name: fechaIngresoDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de ingreso desde (formato YYYY-MM-DD)
 *       - in: query
 *         name: fechaIngresoHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de ingreso hasta (formato YYYY-MM-DD)
 *       - in: query
 *         name: Esta_Preniada
 *         schema:
 *           type: string
 *           enum: ["0", "1", "true", "false"]
 *         description: Filtrar por estado de preñez (1=true, 0=false)
 *       - in: query
 *         name: ID_Estado
 *         schema:
 *           type: integer
 *         description: Filtrar por estado del animal
 *       - in: query
 *         name: fechaVentaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de venta desde (formato YYYY-MM-DD)
 *       - in: query
 *         name: fechaVentaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de venta hasta (formato YYYY-MM-DD)
 *       - in: query
 *         name: Tipo_Venta
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de venta
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
 *         description: Lista de animales con detalles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AnimalWithDetails'
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
// Veterinario y Administrador pueden ver animales con detalle
router.get('/con-detalle', authMiddleware, authorize(1, 2), animalsController.getWithDetails);

/**
 * @swagger
 * /animales/{id}:
 *   get:
 *     summary: Obtener un animal por ID
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     responses:
 *       200:
 *         description: Animal encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Animal'
 *       404:
 *         description: Animal no encontrado
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
// Veterinario y Administrador pueden ver detalle de un animal
router.get('/:id', authMiddleware, authorize(1, 2), animalsController.getById);

/**
 * @swagger
 * /animales:
 *   post:
 *     summary: Crear un nuevo animal
 *     tags: [Animales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Sexo
 *               - Color
 *               - Peso
 *               - Fecha_Nacimiento
 *               - Raza
 *               - Esta_Preniada
 *               - Fecha_Ingreso
 *               - ID_Categoria
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del animal
 *               Sexo:
 *                 type: string
 *                 enum: [M, H]
 *                 description: Sexo del animal
 *               Color:
 *                 type: string
 *                 description: Color del animal
 *               Peso:
 *                 type: number
 *                 format: float
 *                 description: Peso en kg
 *               Fecha_Nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento
 *               Raza:
 *                 type: string
 *                 description: Raza del animal
 *               Esta_Preniada:
 *                 type: boolean
 *                 description: Si el animal está preñado
 *               Fecha_Monta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de monta
 *               Fecha_Estimada_Parto:
 *                 type: string
 *                 format: date
 *                 description: Fecha estimada de parto
 *               Fecha_Ingreso:
 *                 type: string
 *                 format: date
 *                 description: Fecha de ingreso al sistema
 *               ID_Categoria:
 *                 type: integer
 *                 description: ID de la categoría
 *     responses:
 *       201:
 *         description: Animal creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Animal'
 *       409:
 *         description: La categoría especificada no existe
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
// Solo Administrador puede crear animales
router.post('/', authMiddleware, authorize(1,2), animalsController.create);

/**
 * @swagger
 * /animales/{id}:
 *   put:
 *     summary: Actualizar un animal
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del animal
 *               Sexo:
 *                 type: string
 *                 enum: [M, H]
 *                 description: Sexo del animal
 *               Color:
 *                 type: string
 *                 description: Color del animal
 *               Peso:
 *                 type: number
 *                 format: float
 *                 description: Peso en kg
 *               Fecha_Nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento
 *               Raza:
 *                 type: string
 *                 description: Raza del animal
 *               Esta_Preniada:
 *                 type: boolean
 *                 description: Si el animal está preñado
 *               Fecha_Monta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de monta
 *               Fecha_Estimada_Parto:
 *                 type: string
 *                 format: date
 *                 description: Fecha estimada de parto
 *               Fecha_Ingreso:
 *                 type: string
 *                 format: date
 *                 description: Fecha de ingreso al sistema
 *               ID_Categoria:
 *                 type: integer
 *                 description: ID de la categoría
 *     responses:
 *       200:
 *         description: Animal actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Animal'
 *       404:
 *         description: Animal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: La categoría especificada no existe
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
// Solo Administrador puede actualizar animales
router.put('/:id', authMiddleware, authorize(1,2), animalsController.update);

/**
 * @swagger
 * /animales/{id}:
 *   delete:
 *     summary: Eliminar un animal
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     responses:
 *       200:
 *         description: Animal eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Animal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: No se puede eliminar el animal porque está siendo referenciado
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
// Solo Administrador puede eliminar animales
router.delete('/:id', authMiddleware, authorize(2), animalsController.delete);

/**
 * @swagger
 * /animales/{id}/estado:
 *   get:
 *     summary: Obtener estado actual de un animal
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     responses:
 *       200:
 *         description: Estado del animal obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EstadoAnimal'
 *       404:
 *         description: Animal no encontrado
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
// Veterinario y Administrador pueden ver estado del animal
router.get('/:id/estado', authMiddleware, authorize(1, 2), estadoAnimalController.getByAnimalId);

/**
 * @swagger
 * /animales/{id}/historial:
 *   get:
 *     summary: Obtener historial de un animal
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     responses:
 *       200:
 *         description: Historial del animal obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Historial'
 *       404:
 *         description: Animal no encontrado
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
// Veterinario y Administrador pueden ver historial del animal
router.get('/:id/historial', authMiddleware, authorize(1, 2), historialController.getByAnimalId);

/**
 * @swagger
 * /animales/{id}/recordatorios:
 *   get:
 *     summary: Obtener recordatorios de un animal
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del animal
 *     responses:
 *       200:
 *         description: Recordatorios del animal obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recordatorio'
 *       404:
 *         description: Animal no encontrado
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
// Veterinario y Administrador pueden ver recordatorios del animal
router.get('/:id/recordatorios', authMiddleware, authorize(1, 2), recordatoriosController.getByAnimalId);

module.exports = router;