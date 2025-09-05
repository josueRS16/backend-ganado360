const { execute, executeNonQuery, getOne } = require('../db/pool');

class RecordatoriosRepository {
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
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY r.Fecha_Recordatorio DESC';
    
    return await execute(sql, params);
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
