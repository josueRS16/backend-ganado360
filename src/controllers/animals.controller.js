const animalsRepository = require('../repositories/animals.repo');

class AnimalsController {
  async getAll(req, res) {
    try {
      // Check if pagination parameters are provided (both page AND limit must be provided)
      const hasPagination = req.query.page !== undefined && req.query.limit !== undefined;
      
      // Parse pagination parameters only if provided
      const page = hasPagination ? (parseInt(req.query.page) || 1) : 1;
      const limit = hasPagination ? (parseInt(req.query.limit) || 5) : null;
      const offset = hasPagination ? (page - 1) * limit : null;

      const filters = {
        ID_Categoria: req.query.ID_Categoria,
        Sexo: req.query.Sexo,
        fechaIngresoDesde: req.query.fechaIngresoDesde,
        fechaIngresoHasta: req.query.fechaIngresoHasta,
        Esta_Preniada: req.query.Esta_Preniada !== undefined ? 
          (req.query.Esta_Preniada === '1' || req.query.Esta_Preniada === 'true') : undefined
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get animals and total count
      const [animales, totalCount] = await Promise.all([
        animalsRepository.findAll(filters),
        animalsRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: animales, 
        count: animales.length
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
      console.error('Error en getAll animales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const animal = await animalsRepository.findById(id);
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }
      
      res.json({ data: animal });
    } catch (error) {
      console.error('Error en getById animal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const animal = await animalsRepository.create(req.body);
      res.status(201).json({ data: animal });
    } catch (error) {
      console.error('Error en create animal:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'La categoría especificada no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const animal = await animalsRepository.update(id, req.body);
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }
      
      res.json({ data: animal });
    } catch (error) {
      console.error('Error en update animal:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'La categoría especificada no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await animalsRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete animal:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el animal porque está siendo referenciado en otras tablas' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getWithDetails(req, res) {
    try {
      const animales = await animalsRepository.findWithDetails();
      res.json({ data: animales, count: animales.length });
    } catch (error) {
      console.error('Error en getWithDetails animales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new AnimalsController();
