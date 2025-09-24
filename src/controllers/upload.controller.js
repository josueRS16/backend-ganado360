const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { executeNonQuery } = require('../db/pool');

class UploadController {
  constructor() {
    // Configuración de multer
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
      }
    });

    this.upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
      },
      fileFilter: function (req, file, cb) {
        // Verificar que sea una imagen
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      }
    });
  }

  uploadImage = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se recibió ningún archivo'
        });
      }

      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir la imagen'
      });
    }
  };

  deleteImage = async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join('uploads', filename);

      // Construir las posibles URLs que podrían estar en la base de datos
      const possibleUrls = [
        `uploads/${filename}`,
        `/uploads/${filename}`,
        `http://localhost:3000/uploads/${filename}`,
        `https://localhost:3000/uploads/${filename}`
      ];

      let affectedRecords = 0;

      // Actualizar la base de datos para todos los animales que tengan esta imagen
      for (const imageUrl of possibleUrls) {
        const result = await executeNonQuery(
          'UPDATE Animal SET Imagen_URL = NULL WHERE Imagen_URL = ?',
          [imageUrl]
        );
        affectedRecords += result.affectedRows;
      }

      // Eliminar el archivo físico
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        
        res.json({ 
          success: true, 
          message: `Imagen eliminada exitosamente. ${affectedRecords} registro(s) actualizado(s) en la base de datos.`,
          affectedRecords: affectedRecords
        });
      } else {
        // Si el archivo no existe físicamente, pero se actualizó la BD, informar
        if (affectedRecords > 0) {
          res.json({
            success: true,
            message: `Archivo físico no encontrado, pero ${affectedRecords} registro(s) actualizado(s) en la base de datos.`,
            affectedRecords: affectedRecords
          });
        } else {
          res.status(404).json({ 
            success: false, 
            message: 'Archivo no encontrado y no hay registros para actualizar' 
          });
        }
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la imagen y actualizar la base de datos'
      });
    }
  };
}

module.exports = new UploadController();
