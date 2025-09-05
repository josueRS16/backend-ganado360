const { execute, executeNonQuery, getOne } = require('../db/pool');

class CategoriasRepository {
  async findAll() {
    return await execute('SELECT * FROM Categoria ORDER BY Tipo');
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
