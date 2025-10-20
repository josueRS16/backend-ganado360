const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/verify-code', authCtrl.verifyCode);

// Rutas protegidas - requieren autenticación
router.get('/profile', authMiddleware, authCtrl.getProfile);
router.put('/profile', authMiddleware, authCtrl.updateProfile);

module.exports = router;
