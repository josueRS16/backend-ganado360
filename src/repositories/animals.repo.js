const { execute, executeNonQuery, getOne } = require('../db/pool');

class AnimalsRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT a.*, c.Tipo as CategoriaTipo 
      FROM Animal a 
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
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
    
    sql += ' ORDER BY a.Nombre';
    
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
      FROM Animal a 
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
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
      Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria
    } = animalData;
    
    const result = await executeNonQuery(`
      INSERT INTO Animal (Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
                         Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
        Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria]);
    
    return await this.findById(result.insertId);
  }

  async update(id, animalData) {
    const {
      Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza,
      Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria
    } = animalData;
    
    const result = await executeNonQuery(`
      UPDATE Animal SET Nombre = ?, Sexo = ?, Color = ?, Peso = ?, Fecha_Nacimiento = ?, 
                       Raza = ?, Esta_Preniada = ?, Fecha_Monta = ?, Fecha_Estimada_Parto = ?, 
                       Fecha_Ingreso = ?, ID_Categoria = ?
      WHERE ID_Animal = ?
    `, [Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, 
        Esta_Preniada, Fecha_Monta, Fecha_Estimada_Parto, Fecha_Ingreso, ID_Categoria, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Animal WHERE ID_Animal = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  async findWithDetails() {
    return await execute(`
      SELECT 
        a.*,
        c.Tipo as CategoriaTipo,
        ea.ID_Estado,
        e.Nombre as EstadoNombre,
        v.ID_Venta,
        v.Fecha_Venta,
        v.Precio
      FROM Animal a
      LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
      LEFT JOIN Estado_Animal ea ON a.ID_Animal = ea.ID_Animal
      LEFT JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      LEFT JOIN Venta v ON a.ID_Animal = v.ID_Animal
      ORDER BY a.Nombre
    `);
  }
}

module.exports = new AnimalsRepository();
