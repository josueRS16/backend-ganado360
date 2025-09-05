const usuariosRepository = require('../repositories/usuarios.repo');

class UsuariosController {
  async getAll(req, res) {
    try {
      const usuarios = await usuariosRepository.findAll();
      res.json({ data: usuarios, count: usuarios.length });
    } catch (error) {
      console.error('Error en getAll usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuariosRepository.findById(id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ data: usuario });
    } catch (error) {
      console.error('Error en getById usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const usuario = await usuariosRepository.create(req.body);
      res.status(201).json({ data: usuario });
    } catch (error) {
      console.error('Error en create usuario:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El rol especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuariosRepository.update(id, req.body);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ data: usuario });
    } catch (error) {
      console.error('Error en update usuario:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El rol especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await usuariosRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete usuario:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el usuario porque está siendo referenciado en otras tablas' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new UsuariosController();
