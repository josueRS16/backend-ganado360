
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    
    // Hash the password before storing
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    await pool.pool.query('INSERT INTO Usuario (Nombre, Correo, Contraseña, RolID) VALUES (?, ?, ?, ?)', [nombre, correo, hashedPassword, 2]);
    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error('Error en register:', err);
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
    
    // Check if password is hashed (bcrypt hashes start with $2b$, $2a$, or $2y$)
    const isHashedPassword = user[0].Contraseña.startsWith('$2b$') || 
                            user[0].Contraseña.startsWith('$2a$') || 
                            user[0].Contraseña.startsWith('$2y$');
    
    let isPasswordValid = false;
    
    if (isHashedPassword) {
      // Use bcrypt to compare with hashed password
      isPasswordValid = await bcrypt.compare(password, user[0].Contraseña);
    } else {
      // Legacy: compare with plain text password and then hash it
      if (password === user[0].Contraseña) {
        isPasswordValid = true;
        
        // Migrate the password to hashed version
        console.log(`Migrating password for user: ${correo}`);
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.pool.query('UPDATE Usuario SET Contraseña = ? WHERE ID_Usuario = ?', [hashedPassword, user[0].ID_Usuario]);
        console.log(`Password migrated successfully for user: ${correo}`);
      }
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    
    const token = jwt.sign({ id: user[0].ID_Usuario, correo: user[0].Correo }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, nombre: user[0].Nombre, rol: user[0].RolID });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
// NOTE: password-reset functionality was removed to restore previous behavior.
