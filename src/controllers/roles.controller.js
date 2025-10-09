const rolesRepository = require('../repositories/roles.repo');

class RolesController {
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
      
      // Get roles and total count
      const [roles, totalCount] = await Promise.all([
        rolesRepository.findAll(filters),
        rolesRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: roles, 
        count: roles.length
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
      console.error('Error en getAll roles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const rol = await rolesRepository.findById(id);
      
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ data: rol });
    } catch (error) {
      console.error('Error en getById rol:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const rol = await rolesRepository.create(req.body);
      res.status(201).json({ data: rol });
    } catch (error) {
      console.error('Error en create rol:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const rol = await rolesRepository.update(id, req.body);
      
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ data: rol });
    } catch (error) {
      console.error('Error en update rol:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un rol con ese nombre' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await rolesRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete rol:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el rol porque está siendo usado por usuarios' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new RolesController();
