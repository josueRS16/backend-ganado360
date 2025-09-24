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
 *                   example: true
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/image-1234567890-123456789.jpg"
 *                 filename:
 *                   type: string
 *                   example: "image-1234567890-123456789.jpg"
 *                 originalName:
 *                   type: string
 *                   example: "mi-imagen.jpg"
 *                 size:
 *                   type: number
 *                   example: 1024000
 *       400:
 *         description: No se recibió ningún archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No se recibió ningún archivo"
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
 *         example: "image-1758572515607-359276024.JPG"
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Imagen eliminada exitosamente. 2 registro(s) actualizado(s) en la base de datos."
 *                 affectedRecords:
 *                   type: number
 *                   example: 2
 *       404:
 *         description: Archivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Archivo no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al eliminar la imagen y actualizar la base de datos"
 */
router.delete('/image/:filename', uploadController.deleteImage);

module.exports = router;
