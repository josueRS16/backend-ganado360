const historialRepository = require('../repositories/historial.repo');

class HistorialController {
  async getAll(req, res) {
    try {
      const historial = await historialRepository.findAll();
      res.json({ data: historial, count: historial.length });
    } catch (error) {
      console.error('Error en getAll historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const evento = await historialRepository.findById(id);
      
      if (!evento) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      
      res.json({ data: evento });
    } catch (error) {
      console.error('Error en getById historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const evento = await historialRepository.create(req.body);
      res.status(201).json({ data: evento });
    } catch (error) {
      console.error('Error en create historial:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const evento = await historialRepository.update(id, req.body);
      
      if (!evento) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      
      res.json({ data: evento });
    } catch (error) {
      console.error('Error en update historial:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await historialRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByAnimalId(req, res) {
    try {
      const { id } = req.params;
      const historial = await historialRepository.findByAnimalId(id);
      res.json({ data: historial, count: historial.length });
    } catch (error) {
      console.error('Error en getByAnimalId historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new HistorialController();
