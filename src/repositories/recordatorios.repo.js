const { execute, executeNonQuery, getOne } = require('../db/pool');

class RecordatoriosRepository {
  async updateEstado(id, estado) {
    const result = await executeNonQuery(
      'UPDATE Recordatorio SET Estado = ? WHERE ID_Recordatorio = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  }
  // Elimina todos los recordatorios asociados a un evento veterinario
  async deleteByEventoId(eventoId) {
    // First get the historial event details to find related recordatorios
    const evento = await getOne(`
      SELECT hv.*, a.Nombre as AnimalNombre 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      WHERE hv.ID_Evento = ?
    `, [eventoId]);
    
    if (!evento) {
      return false;
    }
    
    // Delete recordatorios that match the event pattern
    // Recordatorios are created with title "Evento veterinario: {Tipo_Evento}"
    const titulo = `Evento veterinario: ${evento.Tipo_Evento}`;
    const result = await executeNonQuery(
      'DELETE FROM Recordatorio WHERE ID_Animal = ? AND Titulo = ? AND Fecha_Recordatorio = ?',
      [evento.ID_Animal, titulo, evento.Proxima_Fecha]
    );
    return result.affectedRows > 0;
  }
  // Recordatorios automáticos: vacas preñadas y eventos veterinarios próximos
  async findAll(filters = {}) {
    let sql = `
      SELECT r.*, a.Nombre as AnimalNombre 
      FROM Recordatorio r 
      JOIN Animal a ON r.ID_Animal = a.ID_Animal
    `;
    const params = [];
    const conditions = [];
    if (filters.ID_Animal) {
      conditions.push('r.ID_Animal = ?');
      params.push(filters.ID_Animal);
    }
    if (filters.fechaDesde) {
      conditions.push('r.Fecha_Recordatorio >= ?');
      params.push(filters.fechaDesde);
    }
    if (filters.fechaHasta) {
      conditions.push('r.Fecha_Recordatorio <= ?');
      params.push(filters.fechaHasta);
    }
    if (filters.Estado) {
      conditions.push('r.Estado = ?');
      params.push(filters.Estado);
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY r.Fecha_Recordatorio DESC';

    // Si no se solicita paginación, devolver solo el array
    if (!filters.page && !filters.limit) {
      return await execute(sql, params);
    }

    // Paginación
    const countSql = sql.replace(/SELECT r\.\*, a\.Nombre as AnimalNombre/i, 'SELECT COUNT(*) as total');
    const countRows = await execute(countSql, params);
    const totalCount = countRows[0]?.total || 0;
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    if (limit > 0) {
      const offset = (page - 1) * limit;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    const rows = await execute(sql, params);
    return { rows, totalCount };
  }

  async findById(id) {
    return await getOne(`
      SELECT r.*, a.Nombre as AnimalNombre 
      FROM Recordatorio r 
      JOIN Animal a ON r.ID_Animal = a.ID_Animal
      WHERE r.ID_Recordatorio = ?
    `, [id]);
  }

  async create(recordatorioData) {
    const { ID_Animal, Titulo, Descripcion, Fecha_Recordatorio } = recordatorioData;
    
    const result = await executeNonQuery(
      'INSERT INTO Recordatorio (ID_Animal, Titulo, Descripcion, Fecha_Recordatorio) VALUES (?, ?, ?, ?)',
      [ID_Animal, Titulo, Descripcion, Fecha_Recordatorio]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, recordatorioData) {
    const { ID_Animal, Titulo, Descripcion, Fecha_Recordatorio } = recordatorioData;
    
    const result = await executeNonQuery(
      'UPDATE Recordatorio SET ID_Animal = ?, Titulo = ?, Descripcion = ?, Fecha_Recordatorio = ? WHERE ID_Recordatorio = ?',
      [ID_Animal, Titulo, Descripcion, Fecha_Recordatorio, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Recordatorio WHERE ID_Recordatorio = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  async findByAnimalId(animalId) {
    return await execute(`
      SELECT * FROM Recordatorio 
      WHERE ID_Animal = ? 
      ORDER BY Fecha_Recordatorio DESC
    `, [animalId]);
  }
}

module.exports = new RecordatoriosRepository();
