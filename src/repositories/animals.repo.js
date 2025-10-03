const { execute, executeNonQuery, getOne } = require('../db/pool');
const estadoAnimalRepo = require('./estadoAnimal.repo');

class AnimalsRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT a.*, c.Tipo as CategoriaTipo, e.Nombre as EstadoNombre, ea.ID_Estado_Animal
      FROM Animal a
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Estado_Animal ea ON a.ID_Animal = ea.ID_Animal
      LEFT JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      WHERE ea.ID_Estado_Animal = (
        SELECT MAX(ea2.ID_Estado_Animal)
        FROM Estado_Animal ea2
        WHERE ea2.ID_Animal = a.ID_Animal
      )
    `;
    
    const params = [];
    const conditions = [];
    if (filters.ID_Categoria) {
      conditions.push('a.ID_Categoria = ?');
      params.push(filters.ID_Categoria);
    }
    if (filters.Sexo) {
      conditions.push('a.Sexo = ?');
      params.push(filters.Sexo);
    }
    if (filters.fechaIngresoDesde) {
      conditions.push('a.Fecha_Ingreso >= ?');
      params.push(filters.fechaIngresoDesde);
    }
    if (filters.fechaIngresoHasta) {
      conditions.push('a.Fecha_Ingreso <= ?');
      params.push(filters.fechaIngresoHasta);
    }
    if (filters.Esta_Preniada !== undefined) {
      conditions.push('a.Esta_Preniada = ?');
      params.push(filters.Esta_Preniada);
    }
    if (filters.EstadoNombre) {
      conditions.push('e.Nombre = ?');
      params.push(filters.EstadoNombre);
    }
    if (filters.ID_Estado) {
      conditions.push('ea.ID_Estado = ?');
      params.push(filters.ID_Estado);
    }
    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY a.Nombre';
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    return await execute(sql, params);
  }

  async count(filters = {}) {
    let sql = `
      SELECT COUNT(DISTINCT a.ID_Animal) as total
      FROM Animal a 
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Estado_Animal ea ON a.ID_Animal = ea.ID_Animal
      LEFT JOIN Estado e ON ea.ID_Estado = e.ID_Estado
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Categoria) {
      conditions.push('a.ID_Categoria = ?');
      params.push(filters.ID_Categoria);
    }
    
    if (filters.Sexo) {
      conditions.push('a.Sexo = ?');
      params.push(filters.Sexo);
    }
    
    if (filters.fechaIngresoDesde) {
      conditions.push('a.Fecha_Ingreso >= ?');
      params.push(filters.fechaIngresoDesde);
    }
    
    if (filters.fechaIngresoHasta) {
      conditions.push('a.Fecha_Ingreso <= ?');
      params.push(filters.fechaIngresoHasta);
    }
    
    if (filters.Esta_Preniada !== undefined) {
      conditions.push('a.Esta_Preniada = ?');
      params.push(filters.Esta_Preniada);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }

  async findById(id) {
    return await getOne(`
      SELECT a.*, c.Tipo as CategoriaTipo 
      FROM Animal a 
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      WHERE a.ID_Animal = ?
    `, [id]);
  }

  async create(animalData) {
    const {
      Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza,
      Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria,
      Imagen_URL
    } = animalData;
    
    // Iniciar transacción para asegurar atomicidad
    const { pool } = require('../db/pool');
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Crear el animal
      const [result] = await connection.execute(`
        INSERT INTO Animal (Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
                           Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria, Imagen_URL)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
          Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria, Imagen_URL]);
      
      const animalId = result.insertId;
      
      // Crear estado del animal por defecto (ID: 12 = "viva")
      const [estadoResult] = await connection.execute(
        'INSERT INTO Estado_Animal (ID_Animal, ID_Estado, Fecha_Fallecimiento) VALUES (?, ?, ?)',
        [animalId, 12, null]
      );
      
      if (estadoResult.affectedRows === 0) {
        throw new Error('Error al crear el estado inicial del animal');
      }
      
      await connection.commit();
      
      return await this.findById(animalId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id, animalData) {
    const {
      Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza,
      Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria,
      Imagen_URL
    } = animalData;
    
    const result = await executeNonQuery(`
      UPDATE Animal SET Nombre = ?, Sexo = ?, Color = ?, Peso = ?, Fecha_Nacimiento = ?, 
                    Raza = ?, Esta_Preniada = ?, Fecha_Monta = ?, Fecha_Estimada_Parto = ?, 
                    Fecha_Ingreso = ?, ID_Categoria = ?, Imagen_URL = ?
      WHERE ID_Animal = ?
    `, [Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
        Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria, Imagen_URL, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }


  async delete(id) {
    // Obtener los datos del animal antes de eliminarlo para limpiar la imagen
    const animal = await this.findById(id);
    
    const result = await executeNonQuery(
      'DELETE FROM Animal WHERE ID_Animal = ?',
      [id]
    );
    
    // Si la eliminación fue exitosa y el animal tenía imagen, limpiarla
    if (result.affectedRows > 0 && animal && animal.Imagen_URL) {
      await this.handleImageCleanup(animal.Imagen_URL);
    }
    
    return result.affectedRows > 0;
  }

  async findWithDetails(filters = {}) {
    let sql = `
      SELECT 
        a.*,
        ea.ID_Estado_Animal,
        a.ID_Animal,
        ea.ID_Estado,
        ea.Fecha_Fallecimiento,
        a.Nombre as AnimalNombre,
        e.Nombre as EstadoNombre,
        c.Tipo as CategoriaTipo,
        v.ID_Venta,
        v.Fecha_Venta,
        v.Precio,
        v.Comprador,
        v.Tipo_Venta,
        v.Registrado_Por,
        v.Observaciones,
        u.Nombre as UsuarioNombre
      FROM Animal a
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Estado_Animal ea ON a.ID_Animal = ea.ID_Animal
      LEFT JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      LEFT JOIN Venta v ON a.ID_Animal = v.ID_Animal
      LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Categoria) {
      conditions.push('a.ID_Categoria = ?');
      params.push(filters.ID_Categoria);
    }
    
    if (filters.Sexo) {
      conditions.push('a.Sexo = ?');
      params.push(filters.Sexo);
    }
    
    if (filters.fechaIngresoDesde) {
      conditions.push('a.Fecha_Ingreso >= ?');
      params.push(filters.fechaIngresoDesde);
    }
    
    if (filters.fechaIngresoHasta) {
      conditions.push('a.Fecha_Ingreso <= ?');
      params.push(filters.fechaIngresoHasta);
    }
    
    if (filters.Esta_Preniada !== undefined) {
      conditions.push('a.Esta_Preniada = ?');
      params.push(filters.Esta_Preniada);
    }
    
    if (filters.ID_Estado) {
      conditions.push('ea.ID_Estado = ?');
      params.push(filters.ID_Estado);
    }
    
    if (filters.fechaVentaDesde) {
      conditions.push('v.Fecha_Venta >= ?');
      params.push(filters.fechaVentaDesde);
    }
    
    if (filters.fechaVentaHasta) {
      conditions.push('v.Fecha_Venta <= ?');
      params.push(filters.fechaVentaHasta);
    }
    
    if (filters.Tipo_Venta) {
      conditions.push('v.Tipo_Venta = ?');
      params.push(filters.Tipo_Venta);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY a.Nombre';
    
    // Add pagination only if limit is provided
    if (filters.limit !== null && filters.limit !== undefined) {
      const limit = filters.limit;
      const offset = filters.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    return await execute(sql, params);
  }

  async countWithDetails(filters = {}) {
    let sql = `
      SELECT COUNT(DISTINCT a.ID_Animal) as total
      FROM Animal a
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Estado_Animal ea ON a.ID_Animal = ea.ID_Animal
      LEFT JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      LEFT JOIN Venta v ON a.ID_Animal = v.ID_Animal
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Categoria) {
      conditions.push('a.ID_Categoria = ?');
      params.push(filters.ID_Categoria);
    }
    
    if (filters.Sexo) {
      conditions.push('a.Sexo = ?');
      params.push(filters.Sexo);
    }
    
    if (filters.fechaIngresoDesde) {
      conditions.push('a.Fecha_Ingreso >= ?');
      params.push(filters.fechaIngresoDesde);
    }
    
    if (filters.fechaIngresoHasta) {
      conditions.push('a.Fecha_Ingreso <= ?');
      params.push(filters.fechaIngresoHasta);
    }
    
    if (filters.Esta_Preniada !== undefined) {
      conditions.push('a.Esta_Preniada = ?');
      params.push(filters.Esta_Preniada);
    }
    
    if (filters.ID_Estado) {
      conditions.push('ea.ID_Estado = ?');
      params.push(filters.ID_Estado);
    }
    
    if (filters.fechaVentaDesde) {
      conditions.push('v.Fecha_Venta >= ?');
      params.push(filters.fechaVentaDesde);
    }
    
    if (filters.fechaVentaHasta) {
      conditions.push('v.Fecha_Venta <= ?');
      params.push(filters.fechaVentaHasta);
    }
    
    if (filters.Tipo_Venta) {
      conditions.push('v.Tipo_Venta = ?');
      params.push(filters.Tipo_Venta);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await execute(sql, params);
    return parseInt(result[0].total);
  }
}

module.exports = new AnimalsRepository();