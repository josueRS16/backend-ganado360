
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
  const { nombre, correo, password } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }
  try {
  const [user] = await pool.pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
    if (user.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }
  await pool.pool.query('INSERT INTO Usuario (Nombre, Correo, Contraseña, RolID) VALUES (?, ?, ?, ?)', [nombre, correo, password, 2]);
    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
  }
  try {
  const [user] = await pool.pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    if (user[0].Contraseña !== password) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    const token = jwt.sign({ id: user[0].ID_Usuario, correo: user[0].Correo }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, nombre: user[0].Nombre, rol: user[0].RolID });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
