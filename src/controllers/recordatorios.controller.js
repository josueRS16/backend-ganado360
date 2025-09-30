const recordatoriosRepository = require('../repositories/recordatorios.repo');


class RecordatoriosController {
  // Cambiar estado de recordatorio (hecho/pendiente)
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      if (!['pendiente', 'hecho'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }
      const updated = await recordatoriosRepository.updateEstado(id, estado);
      if (!updated) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      res.json({ updated: true });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Recordatorios automáticos: se insertan en la BD si no existen, pero solo se muestran los de la BD
  async getAutomaticos(req, res) {
    try {
      // Solo devolver los recordatorios existentes en la base de datos, sin crear nuevos
      const todos = await recordatoriosRepository.findAll();
      res.json({ data: todos, count: todos.length });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getAll(req, res) {
    try {
      // Paginación y filtros
      const filters = {
        ID_Animal: req.query.ID_Animal,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta,
        Estado: req.query.Estado,
        page: req.query.page,
        limit: req.query.limit
      };
      // Obtener datos y total
      const result = await recordatoriosRepository.findAll({ ...filters });
      // Si es paginado, result es {rows, totalCount}, si no es paginado es array
      const rows = Array.isArray(result) ? result : result.rows;
      const totalCount = Array.isArray(result) ? result.length : result.totalCount;
      // Formatear la fecha en la descripción si es de parto estimado
      function formatDateDMY(dateStr) {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
      const data = rows.map(r => {
        if (r.Fecha_Recordatorio && /para el .+$/.test(r.Descripcion)) {
          return {
            ...r,
            Descripcion: r.Descripcion.replace(/para el .+$/, `para el ${formatDateDMY(r.Fecha_Recordatorio)}`)
          };
        }
        return r;
      });
      // Calcular metadatos de paginación
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const totalPages = Math.ceil(totalCount / limit);
      res.json({
        data,
        count: totalCount,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const recordatorio = await recordatoriosRepository.findById(id);
      if (!recordatorio) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      res.json({ data: recordatorio });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const recordatorio = await recordatoriosRepository.create(req.body);
      res.status(201).json({ data: recordatorio });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const recordatorio = await recordatoriosRepository.update(id, req.body);
      if (!recordatorio) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      res.json({ data: recordatorio });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await recordatoriosRepository.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }
      res.json({ deleted: true });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByAnimalId(req, res) {
    try {
      const { id } = req.params;
      const recordatorios = await recordatoriosRepository.findByAnimalId(id);
      res.json({ data: recordatorios, count: recordatorios.length });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new RecordatoriosController();
