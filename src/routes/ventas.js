const express = require('express');
const ventasController = require('../controllers/ventas.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Solo Administrador puede gestionar ventas

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
// Solo Administrador puede ver ventas
router.get('/', authMiddleware, authorize(2), ventasController.getAll);

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
// Solo Administrador puede ver una venta
router.get('/:id', authMiddleware, authorize(2), ventasController.getById);

/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Crear una nueva venta/factura
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
 *               - Vendedor
 *               - Precio_Unitario
 *             properties:
 *               ID_Animal:
 *                 type: integer
 *                 description: ID del animal vendido
 *                 example: 5
 *               Fecha_Venta:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la venta
 *                 example: "2025-01-10"
 *               Tipo_Venta:
 *                 type: string
 *                 description: Tipo de venta
 *                 example: "Directa"
 *               Comprador:
 *                 type: string
 *                 description: Nombre del comprador
 *                 example: "Juan Pérez García"
 *               Vendedor:
 *                 type: string
 *                 description: Nombre del vendedor/rancho
 *                 example: "Rancho El Paraíso"
 *               Metodo_Pago:
 *                 type: string
 *                 enum: [Efectivo, Sinpe Móvil, Transferencia, Cheque, Tarjeta]
 *                 description: Método de pago utilizado
 *                 example: "Transferencia"
 *               Precio_Unitario:
 *                 type: number
 *                 format: float
 *                 description: Precio por animal
 *                 example: 50000.00
 *               Cantidad:
 *                 type: integer
 *                 description: Cantidad de animales (default 1)
 *                 default: 1
 *                 example: 1
 *               Subtotal:
 *                 type: number
 *                 format: float
 *                 description: Precio sin IVA (se calcula automáticamente si no se proporciona)
 *                 example: 50000.00
 *               IVA_Porcentaje:
 *                 type: number
 *                 format: float
 *                 description: Porcentaje de IVA (default 12%)
 *                 default: 12.00
 *                 example: 12.00
 *               Registrado_Por:
 *                 type: integer
 *                 description: ID del usuario que registró la venta
 *                 example: 1
 *               Observaciones:
 *                 type: string
 *                 description: Observaciones de la venta
 *                 example: "Pago completo en efectivo"
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
// Solo Administrador puede crear ventas
router.post('/', authMiddleware, authorize(2), ventasController.create);

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
// Solo Administrador puede actualizar ventas
router.put('/:id', authMiddleware, authorize(2), ventasController.update);

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
// Solo Administrador puede eliminar ventas
router.delete('/:id', authMiddleware, authorize(2), ventasController.delete);

/**
 * @swagger
 * /ventas/factura/numero/{numero}:
 *   get:
 *     summary: Obtener venta por número de factura
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de factura (ej FAC-2025-00001)
 *     responses:
 *       200:
 *         description: Venta encontrada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
// Solo Administrador puede buscar factura por número
router.get('/factura/numero/:numero', authMiddleware, authorize(2), ventasController.getByNumeroFactura);

/**
 * @swagger
 * /ventas/{id}/factura-pdf:
 *   get:
 *     summary: Obtener datos completos para generar PDF de factura
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
 *         description: Datos de factura obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     ID_Venta:
 *                       type: integer
 *                     Numero_Factura:
 *                       type: string
 *                     Fecha_Venta:
 *                       type: string
 *                       format: date
 *                     Comprador:
 *                       type: string
 *                     Vendedor:
 *                       type: string
 *                     Metodo_Pago:
 *                       type: string
 *                     Cantidad:
 *                       type: integer
 *                     Precio_Unitario:
 *                       type: number
 *                     Subtotal:
 *                       type: number
 *                     IVA_Porcentaje:
 *                       type: number
 *                     IVA_Monto:
 *                       type: number
 *                     Total:
 *                       type: number
 *                     Animal_Nombre:
 *                       type: string
 *                     Animal_Raza:
 *                       type: string
 *                     Animal_Sexo:
 *                       type: string
 *                     Animal_Peso:
 *                       type: string
 *       404:
 *         description: Factura no encontrada
 */
// Solo Administrador puede obtener datos para PDF de factura
router.get('/:id/factura-pdf', authMiddleware, authorize(2), ventasController.getFacturaParaPDF);

/**
 * @swagger
 * /ventas/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de ventas
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_ventas:
 *                       type: integer
 *                     monto_total:
 *                       type: number
 *                     subtotal_total:
 *                       type: number
 *                     iva_total:
 *                       type: number
 *                     promedio_venta:
 *                       type: number
 *                     venta_minima:
 *                       type: number
 *                     venta_maxima:
 *                       type: number
 */
// Solo Administrador puede ver estadísticas de ventas
router.get('/estadisticas', authMiddleware, authorize(2), ventasController.getEstadisticas);

module.exports = router;