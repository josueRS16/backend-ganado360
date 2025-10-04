
const ventasRepository = require('../repositories/ventas.repo');

class VentasController {
  async getAll(req, res) {
    try {
      // Check if pagination parameters are provided (both page AND limit must be provided)
      const hasPagination = req.query.page !== undefined && req.query.limit !== undefined;
      
      // Parse pagination parameters only if provided
      const page = hasPagination ? (parseInt(req.query.page) || 1) : 1;
      const limit = hasPagination ? (parseInt(req.query.limit) || 5) : null;
      const offset = hasPagination ? (page - 1) * limit : null;

      const filters = {
        ID_Animal: req.query.ID_Animal,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta,
        Tipo_Venta: req.query.Tipo_Venta,
        Comprador: req.query.Comprador
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get ventas and total count
      const [ventas, totalCount] = await Promise.all([
        ventasRepository.findAll(filters),
        ventasRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: ventas, 
        count: ventas.length
      };

      // Add pagination metadata only if pagination was requested
      if (hasPagination) {
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        response.pagination = {
          currentPage: page,
          totalPages: totalPages,
          totalCount: totalCount,
          limit: limit,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        };
      }

      res.json(response);
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
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      res.json({ data: venta });
    } catch (error) {
      console.error('Error en getById venta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const venta = await ventasRepository.create(req.body);
      res.status(201).json({ data: venta });
    } catch (error) {
      console.error('Error en create venta:', error);
      if (error.message === 'Ya existe una venta para este animal') {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === 'Solo se pueden vender animales que estén en estado "viva"') {
        return res.status(400).json({ message: error.message });
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ message: 'El animal o usuario especificado no existe' });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const venta = await ventasRepository.update(id, req.body);
      if (!venta) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      res.json({ data: venta });
    } catch (error) {
      console.error('Error en update venta:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ message: 'El animal o usuario especificado no existe' });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ventasRepository.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete venta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

module.exports = new VentasController();
