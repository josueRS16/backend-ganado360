# Sistema de Autenticación y Autorización por Roles

## 📋 Descripción General

Se ha implementado un sistema completo de autenticación y autorización por roles en el backend de Ganado360.

## 🔐 Roles del Sistema

### RolID 1: Veterinario
**Permisos:**
- ✅ Ver animales (GET `/api/animales`)
- ✅ Ver animales con detalle (GET `/api/animales/con-detalle`)
- ✅ Ver detalle de un animal (GET `/api/animales/:id`)
- ✅ Ver estado de un animal (GET `/api/animales/:id/estado`)
- ✅ Ver historial de un animal (GET `/api/animales/:id/historial`)
- ✅ Ver recordatorios de un animal (GET `/api/animales/:id/recordatorios`)
- ✅ Gestionar recordatorios (CRUD completo en `/api/recordatorios`)
- ✅ Gestionar historial veterinario (CRUD completo en `/api/historial`)
- ✅ Ver y editar su propio perfil (GET/PUT `/api/auth/profile`)

**Restricciones:**
- ❌ No puede crear, editar o eliminar animales
- ❌ No puede gestionar usuarios
- ❌ No puede gestionar roles
- ❌ No puede gestionar categorías
- ❌ No puede gestionar estados
- ❌ No puede gestionar ventas
- ❌ No puede subir o eliminar imágenes

### RolID 2: Administrador
**Permisos:**
- ✅ **Acceso completo a todos los endpoints**
- ✅ Gestión completa de animales (CRUD)
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión completa de roles (CRUD)
- ✅ Gestión completa de categorías (CRUD)
- ✅ Gestión completa de estados (CRUD)
- ✅ Gestión completa de estado de animales (CRUD)
- ✅ Gestión completa de ventas (CRUD)
- ✅ Gestión completa de recordatorios (CRUD)
- ✅ Gestión completa de historial veterinario (CRUD)
- ✅ Subir y eliminar imágenes
- ✅ Ver y editar su propio perfil

## 🔑 Endpoints de Autenticación

### 1. Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "password": "password123"
}
```

### 2. Inicio de Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "password123",
  "captchaToken": "token_recaptcha"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nombre": "Juan Pérez",
  "rol": 2
}
```

### 3. Obtener Perfil del Usuario Autenticado
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "data": {
    "ID_Usuario": 1,
    "Nombre": "Juan Pérez",
    "Correo": "juan@example.com",
    "RolID": 2,
    "RolNombre": "Administrador"
  }
}
```

### 4. Actualizar Perfil del Usuario Autenticado
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "Nombre": "Juan Pérez García",
  "Correo": "juan.perez@example.com",
  "Contraseña": "newpassword123"  // Opcional
}
```

**Nota:** La contraseña es opcional. Si no se proporciona, no se actualiza.

## 🛡️ Uso de la Autorización

### Para Desarrolladores Frontend

1. **Guardar el token después del login:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo, password, captchaToken })
});

const { token, nombre, rol } = await response.json();

// Guardar en localStorage o sessionStorage
localStorage.setItem('token', token);
localStorage.setItem('rol', rol);
localStorage.setItem('nombre', nombre);
```

2. **Incluir el token en cada petición:**
```javascript
const response = await fetch('/api/animales', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

3. **Controlar la UI según el rol:**
```javascript
const rol = parseInt(localStorage.getItem('rol'));

// Mostrar/ocultar elementos según el rol
if (rol === 1) {
  // Veterinario: ocultar botones de crear/editar/eliminar animales
  document.getElementById('btnCrearAnimal').style.display = 'none';
} else if (rol === 2) {
  // Administrador: mostrar todo
  document.getElementById('btnCrearAnimal').style.display = 'block';
}
```

## 📝 Códigos de Respuesta

### Éxito
- `200 OK` - Petición exitosa
- `201 Created` - Recurso creado exitosamente

### Errores de Autenticación
- `401 Unauthorized` - Token no proporcionado o inválido
  ```json
  {
    "message": "Token requerido."
  }
  ```
  ```json
  {
    "message": "Token inválido o expirado."
  }
  ```

### Errores de Autorización
- `403 Forbidden` - Usuario no tiene permisos para acceder al recurso
  ```json
  {
    "message": "Acceso denegado. No tienes permisos para acceder a este recurso."
  }
  ```

### Otros Errores
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: correo ya existe)
- `500 Internal Server Error` - Error del servidor

## 🔄 Flujo de Trabajo Típico

### Para Veterinario:
1. Iniciar sesión → Recibe token con `rolID: 1`
2. Ver lista de animales
3. Ver detalle de un animal específico
4. Crear/editar recordatorios para ese animal
5. Registrar eventos en el historial veterinario
6. Ver y editar su propio perfil

### Para Administrador:
1. Iniciar sesión → Recibe token con `rolID: 2`
2. Acceso completo a todas las funcionalidades
3. Gestionar usuarios, roles, categorías, estados
4. Crear, editar y eliminar animales
5. Registrar ventas
6. Subir imágenes
7. Ver estadísticas

## 🔧 Implementación Técnica

### Middleware de Autenticación (`src/middleware/auth.js`)
Verifica que el token JWT sea válido y extrae la información del usuario.

### Middleware de Autorización (`src/middleware/authorize.js`)
Verifica que el usuario tenga el rol adecuado para acceder al recurso.

**Uso en rutas:**
```javascript
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Solo Administrador
router.post('/animales', authMiddleware, authorize(2), animalsController.create);

// Veterinario y Administrador
router.get('/animales', authMiddleware, authorize(1, 2), animalsController.getAll);
```

### Token JWT
El token incluye:
```javascript
{
  id: ID_Usuario,
  correo: Correo,
  rolID: RolID
}
```

**Expiración:** 1 hora

## 📊 Resumen de Rutas Protegidas

| Ruta Base | Veterinario | Administrador |
|-----------|-------------|---------------|
| `/api/auth/profile` | ✅ | ✅ |
| `/api/animales` (GET) | ✅ | ✅ |
| `/api/animales` (POST/PUT/DELETE) | ❌ | ✅ |
| `/api/recordatorios` | ✅ | ✅ |
| `/api/historial` | ✅ | ✅ |
| `/api/usuarios` | ❌ | ✅ |
| `/api/roles` | ❌ | ✅ |
| `/api/categorias` | ❌ | ✅ |
| `/api/estados` | ❌ | ✅ |
| `/api/estado-animal` | ❌ | ✅ |
| `/api/ventas` | ❌ | ✅ |
| `/api/upload` | ❌ | ✅ |

## 🚀 Pruebas

Ver archivo `docs/PRUEBAS-AUTORIZACION.md` para ejemplos de pruebas con diferentes roles.

## 📌 Notas Importantes

1. **Seguridad:** Todos los endpoints (excepto login, register y recuperación de contraseña) requieren autenticación.

2. **Token Expirado:** Si el token expira, el usuario debe iniciar sesión nuevamente.

3. **Actualización de Perfil:** Los usuarios solo pueden editar su propio perfil, no el de otros usuarios.

4. **Contraseñas:** Las contraseñas se hashean con bcrypt (12 rounds) antes de almacenarse.

5. **Validaciones:** El backend valida que los datos sean correctos antes de procesarlos.

## 🐛 Solución de Problemas

### Error 401: "Token requerido"
- Asegúrate de incluir el header `Authorization: Bearer {token}`

### Error 403: "Acceso denegado"
- El usuario no tiene permisos para ese recurso
- Verifica que el rol del usuario sea el correcto

### Error 401: "Token inválido o expirado"
- El token ha expirado (1 hora)
- El usuario debe iniciar sesión nuevamente

---

**Fecha de implementación:** Octubre 2025  
**Versión:** 1.0

