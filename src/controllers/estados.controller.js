const estadosRepository = require('../repositories/estados.repo');

class EstadosController {
  async getAll(req, res) {
    try {
      const estados = await estadosRepository.findAll();
      res.json({ data: estados, count: estados.length });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const estado = await estadosRepository.findById(id);
      
      if (!estado) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
      
      res.json({ data: estado });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const estado = await estadosRepository.create(req.body);
      res.status(201).json({ data: estado });
    } catch (error) {
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un estado con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const estado = await estadosRepository.update(id, req.body);
      
      if (!estado) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
      
      res.json({ data: estado });
    } catch (error) {
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un estado con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await estadosRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Estado no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el estado porque está siendo usado por animales' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new EstadosController();
