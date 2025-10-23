const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Roles: 1 = Veterinario, 2 = Administrador
// Solo Administrador puede gestionar usuarios

// Endpoint para login (público, no requiere autenticación)
router.post('/login', usuariosController.login);

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios con filtros y paginación opcional
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: Nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del usuario (búsqueda parcial)
 *       - in: query
 *         name: Correo
 *         schema:
 *           type: string
 *         description: Filtrar por correo del usuario (búsqueda parcial)
 *       - in: query
 *         name: RolNombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del rol asociado (búsqueda parcial)
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
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
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
// Solo Administrador puede ver usuarios
router.get('/', authMiddleware, authorize(1,2), usuariosController.getAll);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
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
// Solo Administrador puede ver un usuario
router.get('/:id', authMiddleware, authorize(2), usuariosController.getById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo
 *               - Contraseña
 *               - RolID
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *               Correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               Contraseña:
 *                 type: string
 *                 description: Contraseña del usuario
 *               RolID:
 *                 type: integer
 *                 description: ID del rol del usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       409:
 *         description: El rol especificado no existe
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
// Eliminar el middleware de autenticación para permitir el registro sin token
router.post('/', usuariosController.create);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre del usuario
 *               Correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               Contraseña:
 *                 type: string
 *                 description: Contraseña del usuario
 *               RolID:
 *                 type: integer
 *                 description: ID del rol del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El rol especificado no existe
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
// Solo Administrador puede actualizar usuarios
router.put('/:id', authMiddleware, authorize(2), usuariosController.update);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: No se puede eliminar el usuario porque está siendo referenciado
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
// Solo Administrador puede eliminar usuarios
router.delete('/:id', authMiddleware, authorize(2), usuariosController.delete);

module.exports = router;