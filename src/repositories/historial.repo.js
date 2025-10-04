const { execute, executeNonQuery, getOne } = require('../db/pool');

class HistorialRepository {
  async count() {
    const result = await execute('SELECT COUNT(*) as total FROM Historial_Veterinario');
    return result[0]?.total || 0;
  }
  async findAll(options = {}) {
    let sql = `
      SELECT hv.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
      ORDER BY hv.Fecha_Aplicacion DESC
    `;
    
    const params = [];
    
    // Add pagination if limit and offset are provided
    if (options.limit && options.offset !== undefined) {
      // Some MySQL drivers do not accept placeholders for LIMIT/OFFSET.
      // Interpolate integers safely after coercion to Number to avoid SQL injection.
      const limit = Number(options.limit) || 0;
      const offset = Number(options.offset) || 0;
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
