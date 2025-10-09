const { execute, executeNonQuery, getOne } = require('../db/pool');

class CategoriasRepository {
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM Categoria';
    const params = [];
    const conditions = [];
    
    if (filters.Tipo) {
      conditions.push('Tipo LIKE ?');
      params.push(`%${filters.Tipo}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM Categoria';
    const params = [];
    const conditions = [];
    
    if (filters.Tipo) {
      conditions.push('Tipo LIKE ?');
      params.push(`%${filters.Tipo}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY Tipo';
    
    // Add pagination only if limit is provided
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    return await execute(sql, params);
  }

  async findById(id) {
    return await getOne('SELECT * FROM Categoria WHERE ID_Categoria = ?', [id]);
  }

  async create(categoriaData) {
    const { Tipo } = categoriaData;
    const result = await executeNonQuery(
      'INSERT INTO Categoria (Tipo) VALUES (?)',
      [Tipo]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, categoriaData) {
    const { Tipo } = categoriaData;
    const result = await executeNonQuery(
      'UPDATE Categoria SET Tipo = ? WHERE ID_Categoria = ?',
      [Tipo, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Categoria WHERE ID_Categoria = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new CategoriasRepository();
