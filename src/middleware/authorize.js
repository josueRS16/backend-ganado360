// Middleware para autorización por roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado. Token requerido.' });
    }

    const userRole = req.user.rolID;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Acceso denegado. No tienes permisos para acceder a este recurso.' 
      });
    }

    next();
  };
};

module.exports = authorize;

