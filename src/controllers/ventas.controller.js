const ventasRepository = require('../repositories/ventas.repo');

class VentasController {
  async getAll(req, res) {
    try {
      const filters = {
        ID_Animal: req.query.ID_Animal,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta
      };
      
      const ventas = await ventasRepository.findAll(filters);
      res.json({ data: ventas, count: ventas.length });
    } catch (error) {
      console.error('Error en getAll ventas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventasRepository.findById(id);
      
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      
      res.json({ data: venta });
    } catch (error) {
      console.error('Error en getById venta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const venta = await ventasRepository.create(req.body);
      res.status(201).json({ data: venta });
    } catch (error) {
      console.error('Error en create venta:', error);
      
      if (error.message === 'Ya existe una venta para este animal') {
        return res.status(409).json({ error: error.message });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventasRepository.update(id, req.body);
      
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      
      res.json({ data: venta });
    } catch (error) {
      console.error('Error en update venta:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ventasRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete venta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new VentasController();
