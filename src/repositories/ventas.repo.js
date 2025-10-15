const { execute, executeNonQuery, getOne } = require('../db/pool');
const estadoAnimalRepo = require('./estadoAnimal.repo');

class VentasRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT 
        v.*,
        a.Nombre as AnimalNombre,
        a.Raza as AnimalRaza,
        a.Sexo as AnimalSexo,
        a.Peso as AnimalPeso,
        c.Tipo as CategoriaTipo,
        u.Nombre as UsuarioNombre 
      FROM Venta v 
      JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
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
    
    if (filters.Numero_Factura) {
      conditions.push('v.Numero_Factura LIKE ?');
      params.push(`%${filters.Numero_Factura}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY v.Fecha_Venta DESC, v.ID_Venta DESC';
    
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
    
    if (filters.Numero_Factura) {
      conditions.push('v.Numero_Factura LIKE ?');
      params.push(`%${filters.Numero_Factura}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findById(id) {
    return await getOne(`
      SELECT 
        v.*,
        a.Nombre as AnimalNombre,
        a.Raza as AnimalRaza,
        a.Sexo as AnimalSexo,
        a.Peso as AnimalPeso,
        a.Color as AnimalColor,
        a.Imagen_URL as AnimalImagen,
        c.Tipo as CategoriaTipo,
        u.Nombre as UsuarioNombre 
      FROM Venta v 
      JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
      WHERE v.ID_Venta = ?
    `, [id]);
  }

  async findByNumeroFactura(numeroFactura) {
    return await getOne(`
      SELECT 
        v.*,
        a.Nombre as AnimalNombre,
        a.Raza as AnimalRaza,
        a.Sexo as AnimalSexo,
        a.Peso as AnimalPeso,
        a.Color as AnimalColor,
        c.Tipo as CategoriaTipo,
        u.Nombre as UsuarioNombre 
      FROM Venta v 
      JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
      WHERE v.Numero_Factura = ?
    `, [numeroFactura]);
  }

  async create(ventaData) {
    const { 
      ID_Animal, 
      Fecha_Venta, 
      Tipo_Venta, 
      Comprador, 
      Vendedor,
      Metodo_Pago,
      Precio_Unitario,
      Cantidad = 1,
      Subtotal,
      IVA_Porcentaje = 12.00,
      Registrado_Por, 
      Observaciones 
    } = ventaData;
    
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
      
      // Crear la venta (los triggers calcularán IVA y Total automáticamente)
      const [result] = await connection.execute(
        `INSERT INTO Venta (
          ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Vendedor, Metodo_Pago,
          Precio_Unitario, Cantidad, Subtotal, IVA_Porcentaje, 
          Registrado_Por, Observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Vendedor, Metodo_Pago,
          Precio_Unitario, Cantidad, Subtotal, IVA_Porcentaje,
          Registrado_Por, Observaciones
        ]
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
    const { 
      ID_Animal, 
      Fecha_Venta, 
      Tipo_Venta, 
      Comprador, 
      Vendedor,
      Metodo_Pago,
      Precio_Unitario,
      Cantidad,
      Subtotal,
      IVA_Porcentaje,
      Registrado_Por, 
      Observaciones 
    } = ventaData;
    
    // Los triggers recalcularán automáticamente IVA y Total
    const result = await executeNonQuery(
      `UPDATE Venta SET 
        ID_Animal = ?, 
        Fecha_Venta = ?, 
        Tipo_Venta = ?, 
        Comprador = ?, 
        Vendedor = ?,
        Metodo_Pago = ?,
        Precio_Unitario = ?,
        Cantidad = ?,
        Subtotal = ?,
        IVA_Porcentaje = ?,
        Registrado_Por = ?, 
        Observaciones = ? 
      WHERE ID_Venta = ?`,
      [
        ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Vendedor, Metodo_Pago,
        Precio_Unitario, Cantidad, Subtotal, IVA_Porcentaje,
        Registrado_Por, Observaciones, id
      ]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    // Obtener el ID_Animal de la venta antes de eliminarla
    const venta = await this.findById(id);
    if (!venta) {
      return false; // La venta no existe
    }
    
    const ID_Animal = venta.ID_Animal;
    
    // Iniciar transacción para asegurar atomicidad
    const { pool } = require('../db/pool');
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Eliminar la venta
      const [deleteResult] = await connection.execute(
        'DELETE FROM Venta WHERE ID_Venta = ?',
        [id]
      );
      
      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        return false;
      }
      
      // Actualizar el estado del animal a "viva" (ID: 12)
      const [updateResult] = await connection.execute(
        'UPDATE Estado_Animal SET ID_Estado = ? WHERE ID_Animal = ?',
        [12, ID_Animal]
      );
      
      if (updateResult.affectedRows === 0) {
        throw new Error('Error al actualizar el estado del animal a "viva"');
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Método para obtener datos completos para generar PDF
  async getFacturaParaPDF(id) {
    const sql = `
      SELECT 
        v.ID_Venta,
        v.Numero_Factura,
        v.Fecha_Venta,
        v.Tipo_Venta,
        v.Comprador,
        v.Vendedor,
        v.Metodo_Pago,
        v.Cantidad,
        v.Precio_Unitario,
        v.Subtotal,
        v.IVA_Porcentaje,
        v.IVA_Monto,
        v.Total,
        v.Observaciones,
        a.ID_Animal,
        a.Nombre AS Animal_Nombre,
        a.Raza AS Animal_Raza,
        a.Sexo AS Animal_Sexo,
        a.Peso AS Animal_Peso,
        a.Color AS Animal_Color,
        c.Tipo AS Animal_Categoria,
        u.Nombre AS Registrado_Por_Nombre
      FROM Venta v
      INNER JOIN Animal a ON v.ID_Animal = a.ID_Animal
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
      WHERE v.ID_Venta = ?
    `;
    
    return await getOne(sql, [id]);
  }

  // Estadísticas de ventas
  async getEstadisticas(filters = {}) {
    let sql = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(Total) as monto_total,
        SUM(Subtotal) as subtotal_total,
        SUM(IVA_Monto) as iva_total,
        AVG(Total) as promedio_venta,
        MIN(Total) as venta_minima,
        MAX(Total) as venta_maxima
      FROM Venta
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.fechaDesde) {
      sql += ' AND Fecha_Venta >= ?';
      params.push(filters.fechaDesde);
    }
    
    if (filters.fechaHasta) {
      sql += ' AND Fecha_Venta <= ?';
      params.push(filters.fechaHasta);
    }
    
    const result = await execute(sql, params);
    return result[0];
  }
}

module.exports = new VentasRepository();
