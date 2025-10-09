const { execute, executeNonQuery, getOne } = require('../db/pool');

class EstadosRepository {
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM Estado';
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
    let sql = 'SELECT * FROM Estado';
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
    return await getOne('SELECT * FROM Estado WHERE ID_Estado = ?', [id]);
  }

  async create(estadoData) {
    const { Nombre } = estadoData;
    const result = await executeNonQuery(
      'INSERT INTO Estado (Nombre) VALUES (?)',
      [Nombre]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, estadoData) {
    const { Nombre } = estadoData;
    const result = await executeNonQuery(
      'UPDATE Estado SET Nombre = ? WHERE ID_Estado = ?',
      [Nombre, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Estado WHERE ID_Estado = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new EstadosRepository();
