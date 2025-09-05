const { execute, executeNonQuery, getOne } = require('../db/pool');

class RolesRepository {
  async findAll() {
    return await execute('SELECT * FROM Rol ORDER BY Nombre');
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
