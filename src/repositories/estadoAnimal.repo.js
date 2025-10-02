const { execute, executeNonQuery, getOne } = require('../db/pool');

class EstadoAnimalRepository {
  async findAll(filters = {}) {
    let sql = `
      SELECT ea.*, a.Nombre as AnimalNombre, e.Nombre as EstadoNombre 
      FROM Estado_Animal ea 
      JOIN Animal a ON ea.ID_Animal = a.ID_Animal
      JOIN Estado e ON ea.ID_Estado = e.ID_Estado
    `;
    
    const params = [];
    const conditions = [];
    
    if (filters.ID_Animal) {
      conditions.push('ea.ID_Animal = ?');
      params.push(filters.ID_Animal);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY a.Nombre';
    
    return await execute(sql, params);
  }

  async findById(id) {
    return await getOne(`
      SELECT ea.*, a.Nombre as AnimalNombre, e.Nombre as EstadoNombre 
      FROM Estado_Animal ea 
      JOIN Animal a ON ea.ID_Animal = a.ID_Animal
      JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      WHERE ea.ID_Estado_Animal = ?
    `, [id]);
  }

  async findByAnimalId(animalId) {
    return await getOne(`
      SELECT ea.*, e.Nombre as EstadoNombre 
      FROM Estado_Animal ea 
      JOIN Estado e ON ea.ID_Estado = e.ID_Estado
      WHERE ea.ID_Animal = ?
    `, [animalId]);
  }

  async create(estadoAnimalData) {
    const { ID_Animal, ID_Estado, Fecha_Fallecimiento } = estadoAnimalData;
    
    // Verificar si ya existe un estado para este animal
    const existing = await this.findByAnimalId(ID_Animal);
    if (existing) {
      throw new Error('Ya existe un estado para este animal');
    }
    
    const result = await executeNonQuery(
      'INSERT INTO Estado_Animal (ID_Animal, ID_Estado, Fecha_Fallecimiento) VALUES (?, ?, ?)',
      [ID_Animal, ID_Estado, Fecha_Fallecimiento]
    );
    
    return await this.findById(result.insertId);
  }

  async update(id, estadoAnimalData) {
    let { ID_Estado, Fecha_Fallecimiento } = estadoAnimalData;
    // Validar que ID_Estado siempre tenga un valor válido
    if (typeof ID_Estado === 'undefined' || ID_Estado === null) {
      throw new Error("ID_Estado es obligatorio y no puede ser null");
    }
    const result = await executeNonQuery(
      'UPDATE Estado_Animal SET ID_Estado = ?, Fecha_Fallecimiento = ? WHERE ID_Estado_Animal = ?',
      [ID_Estado, Fecha_Fallecimiento, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async updateByAnimalId(animalId, nuevoEstado) {
    const result = await executeNonQuery(
      'UPDATE Estado_Animal SET ID_Estado = ? WHERE ID_Animal = ?',
      [nuevoEstado, animalId]
    );
    
    return result.affectedRows > 0;
  }

  async delete(id) {
    const result = await executeNonQuery(
      'DELETE FROM Estado_Animal WHERE ID_Estado_Animal = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new EstadoAnimalRepository();
