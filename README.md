# 🐄 Backend Sistema de Ganado

Backend completo para sistema de gestión de ganado construido con **Express.js** y **MySQL**.

## 🚀 Características

- **API REST** completa para gestión de ganado
- **Base de datos MySQL** con esquema normalizado
- **SQL parametrizado** para prevenir inyecciones
- **Manejo de errores** robusto con códigos HTTP apropiados
- **Sin autenticación** (para desarrollo y testing)
- **Estructura modular** con separación de responsabilidades

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **MySQL** 8.0+
- **npm** o **yarn**

## 🗄️ Esquema de Base de Datos

El sistema incluye las siguientes entidades:

- **Rol** - Roles de usuario del sistema
- **Usuario** - Usuarios del sistema
- **Categoria** - Categorías de animales
- **Animal** - Información de los animales
- **Recordatorio** - Recordatorios para cada animal
- **Historial_Veterinario** - Historial médico de los animales
- **Estado** - Estados posibles de los animales
- **Estado_Animal** - Estado actual de cada animal
- **Venta** - Registro de ventas de animales

## ⚙️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ganado-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus credenciales de MySQL:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=GanadoDB
   MYSQL_USER=root
   MYSQL_PASSWORD=tuContraseña
   PORT=3000
   ```

4. **Crear la base de datos**
   ```sql
   CREATE DATABASE GanadoDB;
   ```

5. **Ejecutar el script de seed (opcional)**
   ```bash
   npm run seed
   ```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### Base URL: `/api`

#### Roles
- `GET /roles` - Listar todos los roles
- `GET /roles/:id` - Obtener rol por ID
- `POST /roles` - Crear nuevo rol
- `PUT /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

#### Usuarios
- `GET /usuarios` - Listar todos los usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear nuevo usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

#### Categorías
- `GET /categorias` - Listar todas las categorías
- `GET /categorias/:id` - Obtener categoría por ID
- `POST /categorias` - Crear nueva categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

#### Animales
- `GET /animales` - Listar todos los animales (con filtros opcionales)
- `GET /animales/:id` - Obtener animal por ID
- `POST /animales` - Crear nuevo animal
- `PUT /animales/:id` - Actualizar animal
- `DELETE /animales/:id` - Eliminar animal
- `GET /animales-con-detalle` - Listar animales con información completa
- `GET /animales/:id/estado` - Obtener estado de un animal
- `GET /animales/:id/historial` - Obtener historial médico de un animal
- `GET /animales/:id/recordatorios` - Obtener recordatorios de un animal

#### Recordatorios
- `GET /recordatorios` - Listar todos los recordatorios (con filtros opcionales)
- `GET /recordatorios/:id` - Obtener recordatorio por ID
- `POST /recordatorios` - Crear nuevo recordatorio
- `PUT /recordatorios/:id` - Actualizar recordatorio
- `DELETE /recordatorios/:id` - Eliminar recordatorio

#### Historial Veterinario
- `GET /historial` - Listar todo el historial médico
- `GET /historial/:id` - Obtener evento del historial por ID
- `POST /historial` - Crear nuevo evento en el historial
- `PUT /historial/:id` - Actualizar evento del historial
- `DELETE /historial/:id` - Eliminar evento del historial

#### Estados
- `GET /estados` - Listar todos los estados
- `GET /estados/:id` - Obtener estado por ID
- `POST /estados` - Crear nuevo estado
- `PUT /estados/:id` - Actualizar estado
- `DELETE /estados/:id` - Eliminar estado

#### Estado Animal
- `GET /estado-animal` - Listar estados de animales (con filtros opcionales)
- `GET /estado-animal/:id` - Obtener estado de animal por ID
- `POST /estado-animal` - Crear nuevo estado de animal
- `PUT /estado-animal/:id` - Actualizar estado de animal
- `DELETE /estado-animal/:id` - Eliminar estado de animal

#### Ventas
- `GET /ventas` - Listar todas las ventas (con filtros opcionales)
- `GET /ventas/:id` - Obtener venta por ID
- `POST /ventas` - Crear nueva venta
- `PUT /ventas/:id` - Actualizar venta
- `DELETE /ventas/:id` - Eliminar venta

## 🔧 Filtros Disponibles

### Animales
- `ID_Categoria` - Filtrar por categoría
- `Sexo` - Filtrar por sexo
- `fechaIngresoDesde` - Fecha de ingreso desde
- `fechaIngresoHasta` - Fecha de ingreso hasta

### Recordatorios
- `ID_Animal` - Filtrar por animal
- `fechaDesde` - Fecha desde
- `fechaHasta` - Fecha hasta

### Historial
- `ID_Animal` - Filtrar por animal

### Estado Animal
- `ID_Animal` - Filtrar por animal

### Ventas
- `ID_Animal` - Filtrar por animal
- `fechaDesde` - Fecha de venta desde
- `fechaHasta` - Fecha de venta hasta

## 📊 Estructura de Respuestas

### Listados
```json
{
  "data": [...],
  "count": 10
}
```

### Detalle/Creación/Edición
```json
{
  "data": { ... }
}
```

### Eliminación
```json
{
  "deleted": true
}
```

### Errores
```json
{
  "error": "Mensaje de error"
}
```

## 🚨 Códigos de Estado HTTP

- **200** - OK (Operación exitosa)
- **201** - Created (Recurso creado)
- **404** - Not Found (Recurso no encontrado)
- **409** - Conflict (Violación de restricciones)
- **500** - Internal Server Error (Error del servidor)

## 📁 Estructura del Proyecto

```
ganado-backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/         # Definición de rutas
│   └── db/            # Configuración de base de datos
├── scripts/            # Scripts de utilidad
├── docs/              # Documentación
├── server.js          # Punto de entrada
├── package.json       # Dependencias
└── env.example        # Variables de entorno
```

## 🧪 Testing de la API

### Health Check
```bash
curl http://localhost:3000/health
```

### Ejemplo de creación de rol
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"Nombre": "Nuevo Rol"}'
```

## 📝 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm run seed` - Cargar datos iniciales

## 🔒 Consideraciones de Seguridad

- **SQL parametrizado** para prevenir inyecciones
- **Validación de restricciones** de base de datos
- **Manejo de errores** sin exponer información sensible

## 🚧 Limitaciones Actuales

- Sin autenticación/autorización
- Sin validaciones de entrada avanzadas
- Sin rate limiting
- Sin logging estructurado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, por favor abrir un issue en el repositorio.

---

**Desarrollado con ❤️ para la gestión eficiente de ganado**
