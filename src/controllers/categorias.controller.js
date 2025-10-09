const categoriasRepository = require('../repositories/categorias.repo');

class CategoriasController {
  async getAll(req, res) {
    try {
      // Check if pagination parameters are provided (both page AND limit must be provided)
      const hasPagination = req.query.page !== undefined && req.query.limit !== undefined;
      
      // Parse pagination parameters only if provided
      const page = hasPagination ? (parseInt(req.query.page) || 1) : 1;
      const limit = hasPagination ? (parseInt(req.query.limit) || 5) : null;
      const offset = hasPagination ? (page - 1) * limit : null;

      const filters = {
        Tipo: req.query.Tipo
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get categorias and total count
      const [categorias, totalCount] = await Promise.all([
        categoriasRepository.findAll(filters),
        categoriasRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: categorias, 
        count: categorias.length
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
