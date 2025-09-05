const { execute, executeNonQuery, getOne } = require('../db/pool');

class EstadosRepository {
  async findAll() {
    return await execute('SELECT * FROM Estado ORDER BY Nombre');
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
