const { execute, executeNonQuery, getOne } = require('../db/pool');

class HistorialRepository {
  async count(filters = {}) {
    let sql = `
      SELECT COUNT(*) as total 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Animal) {
      conditions.push('hv.ID_Animal = ?');
      params.push(filters.ID_Animal);
    }
    
    if (filters.Tipo_Evento) {
      conditions.push('hv.Tipo_Evento LIKE ?');
      params.push(`%${filters.Tipo_Evento}%`);
    }
    
    if (filters.fechaDesde) {
      conditions.push('hv.Fecha_Aplicacion >= ?');
      params.push(filters.fechaDesde);
    }
    
    if (filters.fechaHasta) {
      conditions.push('hv.Fecha_Aplicacion <= ?');
      params.push(filters.fechaHasta);
    }
    
    if (filters.Hecho_Por) {
      conditions.push('hv.Hecho_Por = ?');
      params.push(filters.Hecho_Por);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findAll(filters = {}) {
    let sql = `
      SELECT hv.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Animal) {
      conditions.push('hv.ID_Animal = ?');
      params.push(filters.ID_Animal);
    }
    
    if (filters.Tipo_Evento) {
      conditions.push('hv.Tipo_Evento LIKE ?');
      params.push(`%${filters.Tipo_Evento}%`);
    }
    
    if (filters.fechaDesde) {
      conditions.push('hv.Fecha_Aplicacion >= ?');
      params.push(filters.fechaDesde);
    }
    
    if (filters.fechaHasta) {
      conditions.push('hv.Fecha_Aplicacion <= ?');
      params.push(filters.fechaHasta);
    }
    
    if (filters.Hecho_Por) {
      conditions.push('hv.Hecho_Por = ?');
      params.push(filters.Hecho_Por);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY hv.Fecha_Aplicacion DESC';
    
    // Add pagination only if limit is provided
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    return await execute(sql, params);
  }

  async findById(id) {
    return await getOne(`
      SELECT hv.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
      WHERE hv.ID_Evento = ?
    `, [id]);
  }

  async create(historialData) {
    const { ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por } = historialData;
    
    const result = await executeNonQuery(
      'INSERT INTO Historial_Veterinario (ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por) VALUES (?, ?, ?, ?, ?, ?)',
      [ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, historialData) {
    const { ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por } = historialData;
    
    const result = await executeNonQuery(
      'UPDATE Historial_Veterinario SET ID_Animal = ?, Tipo_Evento = ?, Descripcion = ?, Fecha_Aplicacion = ?, Proxima_Fecha = ?, Hecho_Por = ? WHERE ID_Evento = ?',
      [ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Historial_Veterinario WHERE ID_Evento = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  async findByAnimalId(animalId) {
    return await execute(`
      SELECT hv.*, u.Nombre as UsuarioNombre 
      FROM Historial_Veterinario hv 
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
      WHERE hv.ID_Animal = ? 
      ORDER BY hv.Fecha_Aplicacion DESC
    `, [animalId]);
  }
}

module.exports = new HistorialRepository();
