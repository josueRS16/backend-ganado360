const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Tu correo de Gmail
    pass: process.env.GMAIL_PASS, // Contraseña o App Password
  },
});

const sendVerificationCode = async (to, code) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`,
  };

  try {
    console.log('Enviando correo a:', to);
    console.log('Opciones del correo:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo. Verifica las credenciales y la configuración.');
  }
};

module.exports = { sendVerificationCode };