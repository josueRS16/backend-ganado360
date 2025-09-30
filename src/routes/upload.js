const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Subir una imagen
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir (máximo 5MB)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 imageUrl:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 originalName:
 *                   type: string
 *                 size:
 *                   type: number
 *       400:
 *         description: No se recibió ningún archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.post('/image', uploadController.upload.single('image'), uploadController.uploadImage);

/**
 * @swagger
 * /upload/image/{filename}:
 *   delete:
 *     summary: Eliminar imagen y limpiar referencias en base de datos
 *     description: Elimina un archivo de imagen del servidor y actualiza todas las referencias en la base de datos estableciendo Imagen_URL = NULL
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo de imagen a eliminar (incluyendo extensión)
 *     responses:
 *       200:
 *         description: Imagen eliminada y referencias actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 affectedRecords:
 *                   type: number
 *       404:
 *         description: Archivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/image/:filename', uploadController.deleteImage);

module.exports = router;
