const { execute, executeNonQuery, getOne } = require('../db/pool');

class RolesRepository {
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM Rol';
    const params = [];
    const conditions = [];
    
    if (filters.Nombre) {
      conditions.push('Nombre LIKE ?');
      params.push(`%${filters.Nombre}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM Rol';
    const params = [];
    const conditions = [];
    
    if (filters.Nombre) {
      conditions.push('Nombre LIKE ?');
      params.push(`%${filters.Nombre}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY Nombre';
    
    // Add pagination only if limit is provided
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    return await execute(sql, params);
  }

  async findById(id) {
    return await getOne('SELECT * FROM Rol WHERE RolID = ?', [id]);
  }

  async create(rolData) {
    const { Nombre } = rolData;
    const result = await executeNonQuery(
      'INSERT INTO Rol (Nombre) VALUES (?)',
      [Nombre]
    );
    
    // Retornar el rol creado
    return await this.findById(result.insertId);
  }

  async update(id, rolData) {
    const { Nombre } = rolData;
    const result = await executeNonQuery(
      'UPDATE Rol SET Nombre = ? WHERE RolID = ?',
      [Nombre, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Rol WHERE RolID = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new RolesRepository();
