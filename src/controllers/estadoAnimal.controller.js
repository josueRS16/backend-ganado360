const estadoAnimalRepository = require('../repositories/estadoAnimal.repo');

class EstadoAnimalController {
  async getAll(req, res) {
    try {
      const filters = {
        ID_Animal: req.query.ID_Animal
      };
      
      const estadosAnimal = await estadoAnimalRepository.findAll(filters);
      res.json({ data: estadosAnimal, count: estadosAnimal.length });
    } catch (error) {
      console.error('Error en getAll estadosAnimal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const estadoAnimal = await estadoAnimalRepository.findById(id);
      
      if (!estadoAnimal) {
        return res.status(404).json({ error: 'Estado del animal no encontrado' });
      }
      
      res.json({ data: estadoAnimal });
    } catch (error) {
      console.error('Error en getById estadoAnimal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const estadoAnimal = await estadoAnimalRepository.create(req.body);
      res.status(201).json({ data: estadoAnimal });
    } catch (error) {
      console.error('Error en create estadoAnimal:', error);
      
      if (error.message === 'Ya existe un estado para este animal') {
        return res.status(409).json({ error: error.message });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o estado especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const estadoAnimal = await estadoAnimalRepository.update(id, req.body);
      if (!estadoAnimal) {
        return res.status(404).json({ error: 'Estado del animal no encontrado' });
      }
      res.json({ data: estadoAnimal });
    } catch (error) {
      console.error('Error en update estadoAnimal:', error);
      if (error.message && error.message.includes('ID_Estado es obligatorio')) {
        return res.status(400).json({ error: 'ID_Estado es obligatorio y no puede ser null' });
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o estado especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await estadoAnimalRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Estado del animal no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete estadoAnimal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByAnimalId(req, res) {
    try {
      const { id } = req.params;
      const estadoAnimal = await estadoAnimalRepository.findByAnimalId(id);
      
      if (!estadoAnimal) {
        return res.status(404).json({ error: 'No se encontró estado para este animal' });
      }
      
      res.json({ data: estadoAnimal });
    } catch (error) {
      console.error('Error en getByAnimalId estadoAnimal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new EstadoAnimalController();
