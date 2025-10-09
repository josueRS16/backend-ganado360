const usuariosRepository = require('../repositories/usuarios.repo');

class UsuariosController {
  async getAll(req, res) {
    try {
      // Check if pagination parameters are provided (both page AND limit must be provided)
      const hasPagination = req.query.page !== undefined && req.query.limit !== undefined;
      
      // Parse pagination parameters only if provided
      const page = hasPagination ? (parseInt(req.query.page) || 1) : 1;
      const limit = hasPagination ? (parseInt(req.query.limit) || 5) : null;
      const offset = hasPagination ? (page - 1) * limit : null;

      const filters = {
        Nombre: req.query.Nombre,
        Correo: req.query.Correo,
        RolNombre: req.query.RolNombre
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get usuarios and total count
      const [usuarios, totalCount] = await Promise.all([
        usuariosRepository.findAll(filters),
        usuariosRepository.count(filters)
      ]);

      // Prepare response
      const response = { 
        data: usuarios, 
        count: usuarios.length
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
      console.error('Error en getAll usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuariosRepository.findById(id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ data: usuario });
    } catch (error) {
      console.error('Error en getById usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const { Nombre, Correo, Contraseña, RolID } = req.body;
      if (!Nombre || !Correo || !Contraseña || !RolID) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
      if (Contraseña.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      const existeCorreo = await usuariosRepository.findByCorreo(Correo);
      if (existeCorreo) {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      const existeNombre = await usuariosRepository.findByNombre(Nombre);
      if (existeNombre) {
        return res.status(409).json({ error: 'Ya existe un usuario con ese nombre' });
      }
      const usuario = await usuariosRepository.create({ Nombre, Correo, Contraseña, RolID });
      res.status(201).json({ data: usuario });
    } catch (error) {
      console.error('Error en create usuario:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El rol especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async login(req, res) {
    try {
      const { Correo, Contraseña } = req.body;
      if (!Correo || !Contraseña) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
      }
      const usuario = await usuariosRepository.login({ Correo, Contraseña });
      if (!usuario) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }
      res.json({ data: usuario });
    } catch (error) {
      console.error('Error en login usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuariosRepository.update(id, req.body);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ data: usuario });
    } catch (error) {
      console.error('Error en update usuario:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El rol especificado no existe' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await usuariosRepository.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete usuario:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el usuario porque está siendo referenciado en otras tablas' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new UsuariosController();
