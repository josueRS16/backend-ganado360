const mysql = require('mysql2');

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // mysql2 warns about some connection options depending on version; keep connectTimeout
  connectTimeout: 60000
});

// Obtener pool con promesas
const promisePool = pool.promise();

console.log('MYSQL CONFIG:', {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE
});

// Helper para ejecutar queries
const execute = async (sql, params = []) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Helper para queries que no devuelven datos
const executeNonQuery = async (sql, params = []) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Helper para obtener una sola fila
const getOne = async (sql, params = []) => {
  const rows = await execute(sql, params);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  pool: promisePool,
  execute,
  executeNonQuery,
  getOne
};
