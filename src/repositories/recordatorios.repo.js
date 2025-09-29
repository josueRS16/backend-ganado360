const { execute, executeNonQuery, getOne } = require('../db/pool');

class RecordatoriosRepository {
  async updateEstado(id, estado) {
    const result = await executeNonQuery(
      'UPDATE Recordatorio SET Estado = ? WHERE ID_Recordatorio = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  }
  // Elimina todos los recordatorios asociados a un evento veterinario (ID_Evento)
  async deleteByEventoId(eventoId) {
    // Buscar todos los recordatorios cuyo evento veterinario sea el dado
    // Asumimos que la relación es: Recordatorio tiene un campo ID_Evento (si no, ajustar la lógica)
    // Si no existe el campo, buscar por lógica de negocio (por ejemplo, por fecha y animal)
    // Aquí se asume que Recordatorio tiene un campo ID_Evento
    const result = await executeNonQuery(
      'DELETE FROM Recordatorio WHERE ID_Evento = ?',
      [eventoId]
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
