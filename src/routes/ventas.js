const express = require('express');
const ventasController = require('../controllers/ventas.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Gestión de ventas de animales
 */

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: ID_Animal
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del animal
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de venta desde (formato YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
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
 *         name: Comprador
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del comprador (búsqueda parcial)
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
 *         description: Lista de ventas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venta'
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
router.get('/', ventasController.getAll);

/**
 * @swagger
 * /ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
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
router.get('/:id', ventasController.getById);

/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_Animal
 *               - Fecha_Venta
 *               - Tipo_Venta
 *               - Comprador
 *               - Precio
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal vendido
 *               Fecha_Venta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la venta
 *               Tipo_Venta:
 *                 type: string
 *                 description: Tipo de venta
 *               Comprador:
 *                 type: string
 *                 description: Nombre del comprador
 *               Precio:
 *                 type: number
 *                 format: float
 *                 description: Precio de venta
 *               Registrado_Por:
 *                 type: integer
 *                 description: ID del usuario que registró la venta
 *               Observaciones:
 *                 type: string
 *                 description: Observaciones de la venta
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
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
router.post('/', ventasController.create);

/**
 * @swagger
 * /ventas/{id}:
 *   put:
 *     summary: Actualizar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal vendido
 *               Fecha_Venta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la venta
 *               Tipo_Venta:
 *                 type: string
 *                 description: Tipo de venta
 *               Comprador:
 *                 type: string
 *                 description: Nombre del comprador
 *               Precio:
 *                 type: number
 *                 format: float
 *                 description: Precio de venta
 *               Registrado_Por:
 *                 type: integer
 *                 description: ID del usuario que registró la venta
 *               Observaciones:
 *                 type: string
 *                 description: Observaciones de la venta
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
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
router.put('/:id', ventasController.update);

/**
 * @swagger
 * /ventas/{id}:
 *   delete:
 *     summary: Eliminar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Venta no encontrada
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
router.delete('/:id', ventasController.delete);

module.exports = router;