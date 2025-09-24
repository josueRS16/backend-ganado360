const express = require('express');
const router = express.Router();

// Importar todas las rutas
const rolesRoutes = require('./roles');
const usuariosRoutes = require('./usuarios');
const categoriasRoutes = require('./categorias');
const animalsRoutes = require('./animals');
const recordatoriosRoutes = require('./recordatorios');
const historialRoutes = require('./historial');
const estadosRoutes = require('./estados');
const estadoAnimalRoutes = require('./estadoAnimal');
const ventasRoutes = require('./ventas');
const uploadRoutes = require('./upload');

// Registrar rutas
router.use('/roles', rolesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/animales', animalsRoutes);
router.use('/recordatorios', recordatoriosRoutes);
router.use('/historial', historialRoutes);
router.use('/estados', estadosRoutes);
router.use('/estado-animal', estadoAnimalRoutes);
router.use('/ventas', ventasRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
