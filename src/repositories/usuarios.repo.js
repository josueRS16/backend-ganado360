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
  async count(filters = {}) {
    let sql = `
      SELECT COUNT(*) as total 
      FROM Usuario u 
      JOIN Rol r ON u.RolID = r.RolID
    `;
    const params = [];
    const conditions = [];
    
    if (filters.Nombre) {
      conditions.push('u.Nombre LIKE ?');
      params.push(`%${filters.Nombre}%`);
    }
    
    if (filters.Correo) {
      conditions.push('u.Correo LIKE ?');
      params.push(`%${filters.Correo}%`);
    }
    
    if (filters.RolNombre) {
      conditions.push('r.Nombre LIKE ?');
      params.push(`%${filters.RolNombre}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findAll(filters = {}) {
    let sql = `
      SELECT u.*, r.Nombre as RolNombre 
      FROM Usuario u 
      JOIN Rol r ON u.RolID = r.RolID
    `;
    const params = [];
    const conditions = [];
    
    if (filters.Nombre) {
      conditions.push('u.Nombre LIKE ?');
      params.push(`%${filters.Nombre}%`);
    }
    
    if (filters.Correo) {
      conditions.push('u.Correo LIKE ?');
      params.push(`%${filters.Correo}%`);
    }
    
    if (filters.RolNombre) {
      conditions.push('r.Nombre LIKE ?');
      params.push(`%${filters.RolNombre}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY u.Nombre';
    
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
