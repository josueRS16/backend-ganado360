const { execute, executeNonQuery, getOne } = require('../db/pool');

class VentasRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT v.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Venta v 
      JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Animal) {
      conditions.push('v.ID_Animal = ?');
      params.push(filters.ID_Animal);
    }
    
    if (filters.fechaDesde) {
      conditions.push('v.Fecha_Venta >= ?');
      params.push(filters.fechaDesde);
    }
    
    if (filters.fechaHasta) {
      conditions.push('v.Fecha_Venta <= ?');
      params.push(filters.fechaHasta);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY v.Fecha_Venta DESC';
    
    return await execute(sql, params);
  }

  async findById(id) {
    return await getOne(`
      SELECT v.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Venta v 
      JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
      WHERE v.ID_Venta = ?
    `, [id]);
  }

  async create(ventaData) {
    const { ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones } = ventaData;
    
    // Verificar si ya existe una venta para este animal
    const existing = await execute('SELECT ID_Venta FROM Venta WHERE ID_Animal = ?', [ID_Animal]);
    if (existing.length > 0) {
      throw new Error('Ya existe una venta para este animal');
    }
    
    const result = await executeNonQuery(
      'INSERT INTO Venta (ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, ventaData) {
    const { ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones } = ventaData;
    
    const result = await executeNonQuery(
      'UPDATE Venta SET ID_Animal = ?, Fecha_Venta = ?, Tipo_Venta = ?, Comprador = ?, Precio = ?, Registrado_Por = ?, Observaciones = ? WHERE ID_Venta = ?',
      [ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Venta WHERE ID_Venta = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new VentasRepository();
