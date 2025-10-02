const { execute, executeNonQuery, getOne } = require('../db/pool');

class UsuariosRepository {
  async findByCorreo(correo) {
    return await getOne('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
  }

  async findByNombre(nombre) {
    return await getOne('SELECT * FROM Usuario WHERE Nombre = ?', [nombre]);
  }

  async login({ Correo, Contraseña }) {
    return await getOne('SELECT * FROM Usuario WHERE Correo = ? AND Contraseña = ?', [Correo, Contraseña]);
  }
  async findAll() {
    return await execute(`
      SELECT u.*, r.Nombre as RolNombre 
      FROM Usuario u 
      JOIN Rol r ON u.RolID = r.RolID 
      ORDER BY u.Nombre
    `);
  }

  async findById(id) {
    return await getOne(`
      SELECT u.*, r.Nombre as RolNombre 
      FROM Usuario u 
      JOIN Rol r ON u.RolID = r.RolID 
      WHERE u.ID_Usuario = ?
    `, [id]);
  }

  async create(usuarioData) {
    const { Nombre, Correo, Contraseña, RolID } = usuarioData;
    const result = await executeNonQuery(
      'INSERT INTO Usuario (Nombre, Correo, Contraseña, RolID) VALUES (?, ?, ?, ?)',
      [Nombre, Correo, Contraseña, RolID]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, usuarioData) {
    const { Nombre, Correo, Contraseña, RolID } = usuarioData;
    const result = await executeNonQuery(
      'UPDATE Usuario SET Nombre = ?, Correo = ?, Contraseña = ?, RolID = ? WHERE ID_Usuario = ?',
      [Nombre, Correo, Contraseña, RolID, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Usuario WHERE ID_Usuario = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new UsuariosRepository();
