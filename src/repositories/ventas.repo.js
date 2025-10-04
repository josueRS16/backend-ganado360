const { execute, executeNonQuery, getOne } = require('../db/pool');
const estadoAnimalRepo = require('./estadoAnimal.repo');

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
    
    if (filters.Tipo_Venta) {
      conditions.push('v.Tipo_Venta = ?');
      params.push(filters.Tipo_Venta);
    }
    
    if (filters.Comprador) {
      conditions.push('v.Comprador LIKE ?');
      params.push(`%${filters.Comprador}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY v.Fecha_Venta DESC';
    
    // Add pagination only if limit is provided
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    return await execute(sql, params);
  }

  async count(filters = {}) {
    let sql = `
      SELECT COUNT(*) as total
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
    
    if (filters.Tipo_Venta) {
      conditions.push('v.Tipo_Venta = ?');
      params.push(filters.Tipo_Venta);
    }
    
    if (filters.Comprador) {
      conditions.push('v.Comprador LIKE ?');
      params.push(`%${filters.Comprador}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
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
    
    // Verificar el estado actual del animal (debe ser estado 12 = "viva")
    const estadoAnimal = await estadoAnimalRepo.findByAnimalId(ID_Animal); 
    if (!estadoAnimal) {
      throw new Error('El animal no tiene un estado asignado');
    }
    
    if (estadoAnimal.ID_Estado !== 12) {
      throw new Error('Solo se pueden vender animales que estén en estado "viva"');
    }
    
    // Iniciar transacción para asegurar atomicidad
    const { pool } = require('../db/pool');
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Crear la venta
      const [result] = await connection.execute(
        'INSERT INTO Venta (ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones]
      );
      
      // Actualizar el estado del animal a "vendida" (ID: 9)
      const [updateResult] = await connection.execute(
        'UPDATE Estado_Animal SET ID_Estado = ? WHERE ID_Animal = ?',
        [9, ID_Animal]
      );
      
      if (updateResult.affectedRows === 0) {
        throw new Error('Error al actualizar el estado del animal a "vendida"');
      }
      
      await connection.commit();
      
      return await this.findById(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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
