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
      // Si se recibe ID_Estado = 12, filtrar por EstadoNombre = 'vivo' y también por ID_Estado = 12
      if (req.query.ID_Estado && String(req.query.ID_Estado) === '12') {
        filters.EstadoNombre = 'vivo';
        filters.ID_Estado = 12;
      }

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
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const animal = await animalsRepository.create(req.body);
      // Si es vaca preñada y tiene fecha de parto, crear recordatorio automático si no existe
      if (animal.Esta_Preniada && animal.Fecha_Estimada_Parto) {
        const recordatoriosRepo = require('../repositories/recordatorios.repo');
        // Buscar en toda la base de datos si ya existe un recordatorio de parto para este animal
        const todosExistentes = await recordatoriosRepo.findAll();
        const yaExiste = todosExistentes.some(r => r.ID_Animal === animal.ID_Animal && r.Titulo === 'Parto estimado');
        function formatDateDMY(dateStr) {
          const d = new Date(dateStr);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        }
        if (!yaExiste) {
          await recordatoriosRepo.create({
            ID_Animal: animal.ID_Animal,
            Titulo: 'Parto estimado',
            Descripcion: `La vaca "${animal.Nombre}" tiene parto estimado para el ${formatDateDMY(animal.Fecha_Estimada_Parto)}`,
            Fecha_Recordatorio: animal.Fecha_Estimada_Parto
          });
        }
      }
      res.status(201).json({ data: animal });
    } catch (error) {
      // Manejo detallado de errores de SQL
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'La categoría especificada no existe' });
      }
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un animal con un dato único duplicado (por ejemplo, nombre o identificador).', sqlMessage: error.sqlMessage });
      }
      // Otros errores de conflicto
      if (error.code) {
        return res.status(409).json({ error: 'Conflicto en la base de datos', code: error.code, sqlMessage: error.sqlMessage });
      }
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const animal = await animalsRepository.update(id, req.body);
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal no encontrado' });
      }
      // Si es vaca preñada y tiene fecha de parto, crear recordatorio automático si no existe
      if (animal.Esta_Preniada && animal.Fecha_Estimada_Parto) {
        const recordatoriosRepo = require('../repositories/recordatorios.repo');
        // Buscar en toda la base de datos si ya existe un recordatorio de parto para este animal
        const todosExistentes = await recordatoriosRepo.findAll();
        const yaExiste = todosExistentes.some(r => r.ID_Animal === animal.ID_Animal && r.Titulo === 'Parto estimado');
        function formatDateDMY(dateStr) {
          const d = new Date(dateStr);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        }
        if (!yaExiste) {
          await recordatoriosRepo.create({
            ID_Animal: animal.ID_Animal,
            Titulo: 'Parto estimado',
            Descripcion: `La vaca "${animal.Nombre}" tiene parto estimado para el ${formatDateDMY(animal.Fecha_Estimada_Parto)}`,
            Fecha_Recordatorio: animal.Fecha_Estimada_Parto
          });
        }
      }
      res.json({ data: animal });
    } catch (error) {
      
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
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el animal porque está siendo referenciado en otras tablas' });
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getWithDetails(req, res) {
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
          (req.query.Esta_Preniada === '1' || req.query.Esta_Preniada === 'true') : undefined,
        ID_Estado: req.query.ID_Estado,
        fechaVentaDesde: req.query.fechaVentaDesde,
        fechaVentaHasta: req.query.fechaVentaHasta,
        Tipo_Venta: req.query.Tipo_Venta
      };

      // Add pagination parameters only if pagination is requested
      if (hasPagination) {
        filters.limit = limit;
        filters.offset = offset;
      }
      
      // Get animals with details and total count
      const [animales, totalCount] = await Promise.all([
        animalsRepository.findWithDetails(filters),
        animalsRepository.countWithDetails(filters)
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
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new AnimalsController();
