const mysql = require('mysql2');

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '09082001',
  database: process.env.MYSQL_DATABASE || 'GanadoDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  connectTimeout: 60000
});

// Obtener pool con promesas
const promisePool = pool.promise();

// Helper para ejecutar queries
const execute = async (sql, params = []) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error en query:', sql, params, error);
    throw error;
  }
};

// Helper para queries que no devuelven datos
const executeNonQuery = async (sql, params = []) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Error en query:', sql, params, error);
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
