const estadosRepository = require('../repositories/estados.repo');

class EstadosController {
  async getAll(req, res) {
    try {
      // Check if pagination parameters are provided (both page AND limit must be provided)
      const hasPagination = req.query.page !== undefined && req.query.limit !== undefined;
      
      // Parse pagination parameters only if provided
      const page = hasPagination ? (parseInt(req.query.page) || 1) : 1;
      const limit = hasPagination ? (parseInt(req.query.limit) || 5) : null;
      const offset = hasPagination ? (page - 1) * limit : null;

      const filters = {
        Nombre: req.query.Nombre
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get estados and total count
      const [estados, totalCount] = await Promise.all([
        estadosRepository.findAll(filters),
        estadosRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: estados, 
        count: estados.length
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
      console.error('Error en getAll estados:', error);
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
