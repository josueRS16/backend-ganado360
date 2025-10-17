const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const axios = require('axios');
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
  console.log('Request received:', { correo: req.body.correo }); // Excluir contraseña y captchaToken
  const { correo, password, captchaToken } = req.body;
  if (!correo || !password || !captchaToken) {
    return res.status(400).json({ message: 'Correo, contraseña y CAPTCHA requeridos.' });
  }

  try {
    // Verificar el token de reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    if (!response.data.success || response.data.score < 0.5) {
      return res.status(400).json({ message: 'Fallo en la verificación de reCAPTCHA.' });
    }

    // Continuar con la lógica de inicio de sesión
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

exports.forgotPassword = async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ message: 'Correo es requerido.' });
  }

  try {
    const [user] = await pool.pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Correo no encontrado.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

    await pool.pool.query(
      'INSERT INTO PasswordReset (Email, Code, ExpiresAt) VALUES (?, ?, ?)',
      [correo, code, expiresAt]
    );

    // En lugar de enviar el correo, devolvemos el código directamente
    res.status(200).json({ message: 'Código de verificación generado.', code });
  } catch (err) {
    console.error('Error en forgotPassword:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.verifyCode = async (req, res) => {
  const { correo, code } = req.body;
  if (!correo || !code) {
    return res.status(400).json({ message: 'Correo y código son requeridos.' });
  }

  try {
    const [result] = await pool.pool.query(
      'SELECT * FROM PasswordReset WHERE Email = ? AND Code = ? AND ExpiresAt > NOW()',
      [correo, code]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: 'Código inválido o expirado.' });
    }

    res.status(200).json({ message: 'Código verificado correctamente.' });
  } catch (err) {
    console.error('Error en verifyCode:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { correo, code, newPassword } = req.body;
  if (!correo || !code || !newPassword) {
    return res.status(400).json({ message: 'Correo, código y nueva contraseña son requeridos.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const [result] = await pool.pool.query(
      'SELECT * FROM PasswordReset WHERE Email = ? AND Code = ? AND ExpiresAt > NOW()',
      [correo, code]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: 'Código inválido o expirado.' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.pool.query('UPDATE Usuario SET Contraseña = ? WHERE Correo = ?', [hashedPassword, correo]);
    await pool.pool.query('DELETE FROM PasswordReset WHERE Email = ?', [correo]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error('Error en resetPassword:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
