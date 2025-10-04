const historialRepository = require('../repositories/historial.repo');


class HistorialController {
  async getAll(req, res) {
    try {
      // Paginación: page y limit por query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const [historial, total] = await Promise.all([
        historialRepository.findAll({ limit, offset }),
        historialRepository.count()
      ]);

      res.json({
        data: historial,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      // Log detallado para ayudar a diagnosticar errores de BD/SQL
      console.error('Error en getAll historial:', error && error.message ? error.message : error);
      if (process.env.NODE_ENV === 'development') {
        // In development show stack for debugging
        return res.status(500).json({ error: 'Error interno del servidor', details: error.stack || error });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const evento = await historialRepository.findById(id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      res.json({ data: evento });
    } catch (error) {
      console.error('Error en getById historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const evento = await historialRepository.create(req.body);
      // Si tiene Proxima_Fecha, crear recordatorio automático si no existe
      if (evento.Proxima_Fecha) {
        const recordatoriosRepo = require('../repositories/recordatorios.repo');
        // Buscar en toda la base de datos si ya existe un recordatorio para este animal, título y fecha
        const result = await recordatoriosRepo.findAll();
        const todosExistentes = Array.isArray(result) ? result : result.rows;
        const titulo = `Evento veterinario: ${evento.Tipo_Evento}`;
        const yaExiste = todosExistentes.some(r => r.ID_Animal === evento.ID_Animal && r.Titulo === titulo && String(r.Fecha_Recordatorio) === String(evento.Proxima_Fecha));
        if (!yaExiste) {
          // Formatear la fecha a DD-MM-YYYY
          const d = new Date(evento.Proxima_Fecha);
          const fechaEvento = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2, '0')}-${d.getFullYear()}`;
          const nuevoRecordatorio = {
            ID_Animal: evento.ID_Animal,
            Titulo: titulo,
            Descripcion: `Próximo evento para "${evento.AnimalNombre}": ${evento.Tipo_Evento} el ${fechaEvento}`,
            Fecha_Recordatorio: evento.Proxima_Fecha
          };
          await recordatoriosRepo.create(nuevoRecordatorio);
        }
      }
      res.status(201).json({ data: evento });
    } catch (error) {
      console.error('Error en create historial:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const evento = await historialRepository.update(id, req.body);
      if (!evento) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      // Si tiene Proxima_Fecha, actualizar o crear recordatorio automático
      if (evento.Proxima_Fecha) {
        const recordatoriosRepo = require('../repositories/recordatorios.repo');
        const existe = await recordatoriosRepo.findAll({
          ID_Animal: evento.ID_Animal,
          fechaDesde: evento.Proxima_Fecha,
          fechaHasta: evento.Proxima_Fecha
        });
        const titulo = `Evento veterinario: ${evento.Tipo_Evento}`;
        const d = new Date(evento.Proxima_Fecha);
        const fechaEvento = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2, '0')}-${d.getFullYear()}`;
        const descripcion = `Próximo evento para "${evento.AnimalNombre}": ${evento.Tipo_Evento} el ${fechaEvento}`;
        // Buscar recordatorio existente por título y animal
        const recordatorioExistente = existe.find(r => r.Titulo === titulo);
        if (recordatorioExistente) {
          // Actualizar el recordatorio existente
          await recordatoriosRepo.update(recordatorioExistente.ID_Recordatorio, {
            ID_Animal: evento.ID_Animal,
            Titulo: titulo,
            Descripcion: descripcion,
            Fecha_Recordatorio: evento.Proxima_Fecha,
            Estado: recordatorioExistente.Estado || 'pendiente',
          });
        } else {
          // Crear uno nuevo si no existe
          await recordatoriosRepo.create({
            ID_Animal: evento.ID_Animal,
            Titulo: titulo,
            Descripcion: descripcion,
            Fecha_Recordatorio: evento.Proxima_Fecha
          });
        }
      }
      res.json({ data: evento });
    } catch (error) {
      console.error('Error en update historial:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(409).json({ error: 'El animal o usuario especificado no existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      // Eliminar recordatorios asociados a este evento veterinario
      const recordatoriosRepo = require('../repositories/recordatorios.repo');
      await recordatoriosRepo.deleteByEventoId(id);
      const deleted = await historialRepository.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Evento del historial no encontrado' });
      }
      res.json({ deleted: true });
    } catch (error) {
      console.error('Error en delete historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getByAnimalId(req, res) {
    try {
      const { id } = req.params;
      const historial = await historialRepository.findByAnimalId(id);
      res.json({ data: historial, count: historial.length });
    } catch (error) {
      console.error('Error en getByAnimalId historial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new HistorialController();
