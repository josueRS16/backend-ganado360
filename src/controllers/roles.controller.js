const rolesRepository = require('../repositories/roles.repo');

class RolesController {
  async getAll(req, res) {
    try {
      const roles = await rolesRepository.findAll();
      res.json({ data: roles, count: roles.length });
    } catch (error) {
      console.error('Error en getAll roles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const rol = await rolesRepository.findById(id);
      
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ data: rol });
    } catch (error) {
      console.error('Error en getById rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const rol = await rolesRepository.create(req.body);
      res.status(201).json({ data: rol });
    } catch (error) {
      console.error('Error en create rol:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const rol = await rolesRepository.update(id, req.body);
      
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ data: rol });
    } catch (error) {
      console.error('Error en update rol:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await rolesRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete rol:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el rol porque está siendo usado por usuarios' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new RolesController();
