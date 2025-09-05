const recordatoriosRepository = require('../repositories/recordatorios.repo');

class RecordatoriosController {
  async getAll(req, res) {
    try {
      const filters = {
        ID_Animal: req.query.ID_Animal,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta
      };
      
      const recordatorios = await recordatoriosRepository.findAll(filters);
      res.json({ data: recordatorios, count: recordatorios.length });
    } catch (error) {
      console.error('Error en getAll recordatorios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const recordatorio = await recordatoriosRepository.findById(id);
      
      if (!recordatorio) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      
      res.json({ data: recordatorio });
    } catch (error) {
      console.error('Error en getById recordatorio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const recordatorio = await recordatoriosRepository.create(req.body);
      res.status(201).json({ data: recordatorio });
    } catch (error) {
      console.error('Error en create recordatorio:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const recordatorio = await recordatoriosRepository.update(id, req.body);
      
      if (!recordatorio) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      
      res.json({ data: recordatorio });
    } catch (error) {
      console.error('Error en update recordatorio:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await recordatoriosRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete recordatorio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByAnimalId(req, res) {
    try {
      const { id } = req.params;
      const recordatorios = await recordatoriosRepository.findByAnimalId(id);
      res.json({ data: recordatorios, count: recordatorios.length });
    } catch (error) {
      console.error('Error en getByAnimalId recordatorios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new RecordatoriosController();
