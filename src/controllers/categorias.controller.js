const categoriasRepository = require('../repositories/categorias.repo');

class CategoriasController {
  async getAll(req, res) {
    try {
      const categorias = await categoriasRepository.findAll();
      res.json({ data: categorias, count: categorias.length });
    } catch (error) {
      console.error('Error en getAll categorias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriasRepository.findById(id);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json({ data: categoria });
    } catch (error) {
      console.error('Error en getById categoria:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const categoria = await categoriasRepository.create(req.body);
      res.status(201).json({ data: categoria });
    } catch (error) {
      console.error('Error en create categoria:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe una categoría con ese tipo' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriasRepository.update(id, req.body);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json({ data: categoria });
    } catch (error) {
      console.error('Error en update categoria:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe una categoría con ese tipo' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await categoriasRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete categoria:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo usada por animales' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new CategoriasController();
