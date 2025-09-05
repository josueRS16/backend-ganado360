# 🎯 Prompt para Frontend - Sistema de Ganado

## 📋 Descripción del Proyecto

Construir un **Frontend completo** para el sistema de gestión de ganado que se conecte con el backend implementado. El frontend debe ser una aplicación web moderna, responsiva y funcional.

## 🏗️ Stack Tecnológico Requerido

- **React 18+** con **TypeScript**
- **Vite** como bundler
- **React Router v6** para navegación
- **React Query (TanStack Query)** para manejo de estado del servidor
- **Tailwind CSS** para estilos
- **Axios** o **fetch** para llamadas HTTP

## 🚀 Instrucciones de Scaffolding

### 1. Crear proyecto Vite + TypeScript
```bash
npm create vite@latest ganado-frontend -- --template react-ts
cd ganado-frontend
npm install
```

### 2. Instalar dependencias
```bash
npm install react-router-dom @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
```

### 3. Configurar Tailwind
```bash
npx tailwindcss init -p
```

## 📁 Estructura de Carpetas Sugerida

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base
│   ├── forms/          # Formularios
│   └── layout/         # Componentes de layout
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
├── api/                # Servicios de API
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
└── context/            # Contextos de React
```

## 🌐 Variables de Entorno

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 Endpoints Implementados en el Backend

### Base URL: `http://localhost:3000/api`

### 🔐 Roles
- **GET** `/roles` - Listar todos los roles
- **GET** `/roles/:id` - Obtener rol por ID
- **POST** `/roles` - Crear nuevo rol
- **PUT** `/roles/:id` - Actualizar rol
- **DELETE** `/roles/:id` - Eliminar rol

**Request Body (POST/PUT):**
```json
{
  "Nombre": "string"
}
```

**Response:**
```json
{
  "data": {
    "RolID": 1,
    "Nombre": "Administrador"
  }
}
```

### 👥 Usuarios
- **GET** `/usuarios` - Listar todos los usuarios
- **GET** `/usuarios/:id` - Obtener usuario por ID
- **POST** `/usuarios` - Crear nuevo usuario
- **PUT** `/usuarios/:id` - Actualizar usuario
- **DELETE** `/usuarios/:id` - Eliminar usuario

**Request Body (POST/PUT):**
```json
{
  "Nombre": "string",
  "Correo": "string",
  "Contraseña": "string",
  "RolID": 1
}
```

**Response:**
```json
{
  "data": {
    "ID_Usuario": 1,
    "Nombre": "Juan Pérez",
    "Correo": "juan@example.com",
    "RolID": 1,
    "RolNombre": "Administrador",
    "Creado_En": "2024-01-01T00:00:00.000Z"
  }
}
```

### 🏷️ Categorías
- **GET** `/categorias` - Listar todas las categorías
- **GET** `/categorias/:id` - Obtener categoría por ID
- **POST** `/categorias` - Crear nueva categoría
- **PUT** `/categorias/:id` - Actualizar categoría
- **DELETE** `/categorias/:id` - Eliminar categoría

**Request Body (POST/PUT):**
```json
{
  "Tipo": "string"
}
```

**Response:**
```json
{
  "data": {
    "ID_Categoria": 1,
    "Tipo": "Bovino"
  }
}
```

### 🐄 Animales
- **GET** `/animales` - Listar todos los animales
  - Query params: `ID_Categoria`, `Sexo`, `fechaIngresoDesde`, `fechaIngresoHasta`
- **GET** `/animales/:id` - Obtener animal por ID
- **POST** `/animales` - Crear nuevo animal
- **PUT** `/animales/:id` - Actualizar animal
- **DELETE** `/animales/:id` - Eliminar animal
- **GET** `/animales-con-detalle` - Listar animales con información completa
- **GET** `/animales/:id/estado` - Obtener estado de un animal
- **GET** `/animales/:id/historial` - Obtener historial médico de un animal
- **GET** `/animales/:id/recordatorios` - Obtener recordatorios de un animal

**Request Body (POST/PUT):**
```json
{
  "Nombre": "string",
  "Sexo": "string",
  "Color": "string",
  "Peso": "string",
  "Fecha_Nacimiento": "YYYY-MM-DD",
  "Raza": "string",
  "Esta_Preniada": 0,
  "Fecha_Monta": "YYYY-MM-DD",
  "Fecha_Estimada_Parto": "YYYY-MM-DD",
  "Fecha_Ingreso": "YYYY-MM-DD",
  "ID_Categoria": 1
}
```

**Response:**
```json
{
  "data": {
    "ID_Animal": 1,
    "Nombre": "Luna",
    "Sexo": "Hembra",
    "Color": "Negro",
    "Peso": "450 kg",
    "Fecha_Nacimiento": "2020-03-15",
    "Raza": "Holstein",
    "Esta_Preniada": 0,
    "Fecha_Monta": null,
    "Fecha_Estimada_Parto": null,
    "Fecha_Ingreso": "2020-03-20",
    "ID_Categoria": 1,
    "CategoriaTipo": "Bovino"
  }
}
```

### 🔔 Recordatorios
- **GET** `/recordatorios` - Listar todos los recordatorios
  - Query params: `ID_Animal`, `fechaDesde`, `fechaHasta`
- **GET** `/recordatorios/:id` - Obtener recordatorio por ID
- **POST** `/recordatorios` - Crear nuevo recordatorio
- **PUT** `/recordatorios/:id` - Actualizar recordatorio
- **DELETE** `/recordatorios/:id` - Eliminar recordatorio

**Request Body (POST/PUT):**
```json
{
  "ID_Animal": 1,
  "Titulo": "string",
  "Descripcion": "string",
  "Fecha_Recordatorio": "YYYY-MM-DD"
}
```

**Response:**
```json
{
  "data": {
    "ID_Recordatorio": 1,
    "ID_Animal": 1,
    "Titulo": "Vacuna Triple",
    "Descripcion": "Aplicar vacuna triple viral",
    "Fecha_Recordatorio": "2024-02-15",
    "AnimalNombre": "Luna"
  }
}
```

### 🏥 Historial Veterinario
- **GET** `/historial` - Listar todo el historial médico
- **GET** `/historial/:id` - Obtener evento del historial por ID
- **POST** `/historial` - Crear nuevo evento en el historial
- **PUT** `/historial/:id` - Actualizar evento del historial
- **DELETE** `/historial/:id` - Eliminar evento del historial

**Request Body (POST/PUT):**
```json
{
  "ID_Animal": 1,
  "Tipo_Evento": "string",
  "Descripcion": "string",
  "Fecha_Aplicacion": "YYYY-MM-DD",
  "Proxima_Fecha": "YYYY-MM-DD",
  "Hecho_Por": 1
}
```

**Response:**
```json
{
  "data": {
    "ID_Evento": 1,
    "ID_Animal": 1,
    "Tipo_Evento": "Vacunación",
    "Descripcion": "Vacuna triple viral aplicada",
    "Fecha_Aplicacion": "2024-01-15",
    "Proxima_Fecha": "2024-07-15",
    "Hecho_Por": 2,
    "AnimalNombre": "Luna",
    "UsuarioNombre": "María García"
  }
}
```

### 📊 Estados
- **GET** `/estados` - Listar todos los estados
- **GET** `/estados/:id` - Obtener estado por ID
- **POST** `/estados` - Crear nuevo estado
- **PUT** `/estados/:id` - Actualizar estado
- **DELETE** `/estados/:id` - Eliminar estado

**Request Body (POST/PUT):**
```json
{
  "Nombre": "string"
}
```

**Response:**
```json
{
  "data": {
    "ID_Estado": 1,
    "Nombre": "Activo"
  }
}
```

### 🏷️ Estado Animal
- **GET** `/estado-animal` - Listar estados de animales
  - Query params: `ID_Animal`
- **GET** `/estado-animal/:id` - Obtener estado de animal por ID
- **POST** `/estado-animal` - Crear nuevo estado de animal
- **PUT** `/estado-animal/:id` - Actualizar estado de animal
- **DELETE** `/estado-animal/:id` - Eliminar estado de animal

**Request Body (POST/PUT):**
```json
{
  "ID_Animal": 1,
  "ID_Estado": 1,
  "Fecha_Fallecimiento": "YYYY-MM-DD"
}
```

**Response:**
```json
{
  "data": {
    "ID_Estado_Animal": 1,
    "ID_Animal": 1,
    "ID_Estado": 1,
    "Fecha_Fallecimiento": null,
    "AnimalNombre": "Luna",
    "EstadoNombre": "Activo"
  }
}
```

### 💰 Ventas
- **GET** `/ventas` - Listar todas las ventas
  - Query params: `ID_Animal`, `fechaDesde`, `fechaHasta`
- **GET** `/ventas/:id` - Obtener venta por ID
- **POST** `/ventas` - Crear nueva venta
- **PUT** `/ventas/:id` - Actualizar venta
- **DELETE** `/ventas/:id` - Eliminar venta

**Request Body (POST/PUT):**
```json
{
  "ID_Animal": 1,
  "Fecha_Venta": "YYYY-MM-DD",
  "Tipo_Venta": "string",
  "Comprador": "string",
  "Precio": 2500.00,
  "Registrado_Por": 1,
  "Observaciones": "string"
}
```

**Response:**
```json
{
  "data": {
    "ID_Venta": 1,
    "ID_Animal": 1,
    "Fecha_Venta": "2024-01-30",
    "Tipo_Venta": "Venta Directa",
    "Comprador": "Granja San Martín",
    "Precio": 2500.00,
    "Registrado_Por": 1,
    "Observaciones": "Venta por fin de ciclo productivo",
    "AnimalNombre": "Luna",
    "UsuarioNombre": "Juan Pérez"
  }
}
```

## 🎨 Vistas Mínimas Requeridas

### 1. **Dashboard Principal**
- Resumen de estadísticas (total animales, recordatorios pendientes, etc.)
- Gráficos o métricas visuales
- Acceso rápido a funciones principales

### 2. **Gestión de Animales** (Página Principal)
- Tabla con listado de animales
- Filtros por categoría, sexo, fecha de ingreso
- Botones para crear, editar, eliminar
- Vista detallada con pestañas:
  - **Información General** - Datos básicos del animal
  - **Estado** - Estado actual del animal
  - **Historial Médico** - Lista de eventos médicos
  - **Recordatorios** - Recordatorios asociados

### 3. **Gestión de Categorías**
- CRUD completo para categorías de animales
- Tabla con listado y acciones

### 4. **Gestión de Roles**
- CRUD completo para roles de usuario
- Tabla con listado y acciones

### 5. **Gestión de Usuarios**
- CRUD completo para usuarios del sistema
- Tabla con listado y acciones
- Formulario con selector de rol

### 6. **Gestión de Estados**
- CRUD completo para estados de animales
- Tabla con listado y acciones

### 7. **Gestión de Recordatorios**
- Listado con filtros por animal y fechas
- CRUD completo
- Vista de calendario opcional

### 8. **Historial Veterinario**
- Listado de eventos médicos
- CRUD completo
- Filtros por animal y fechas

### 9. **Gestión de Ventas**
- Listado de ventas con filtros
- CRUD completo
- Resumen de ingresos

### 10. **Vista "Animales con Detalle"**
- Tabla unificada con información completa
- Columnas: Animal, Categoría, Estado, Venta, Precio
- Filtros avanzados

## 🔧 Funcionalidades Técnicas Requeridas

### 1. **React Query Integration**
- Configurar React Query con el backend
- Implementar cache y refetch automático
- Manejar estados de loading, error y success

### 2. **React Router**
- Navegación entre páginas
- Rutas protegidas (opcional)
- Breadcrumbs para navegación

### 3. **Formularios**
- Formularios para crear/editar entidades
- Validación básica de campos requeridos
- Manejo de errores de API

### 4. **Tablas y Listados**
- Tablas paginadas (opcional)
- Filtros y búsqueda
- Ordenamiento por columnas
- Acciones en fila (editar, eliminar)

### 5. **Manejo de Estados**
- Estados de loading
- Mensajes de error y éxito
- Confirmaciones para acciones destructivas

## 🎯 Criterios de Aceptación

### ✅ Funcionalidad
- [ ] Todas las operaciones CRUD funcionan correctamente
- [ ] Los filtros de búsqueda funcionan según la especificación
- [ ] Los formularios envían datos en el formato correcto
- [ ] Las respuestas de la API se muestran correctamente
- [ ] Los endpoints de conveniencia funcionan (estado, historial, recordatorios por animal)

### ✅ UX/UI
- [ ] Interfaz responsiva y moderna
- [ ] Navegación intuitiva entre páginas
- [ ] Feedback visual para todas las acciones
- [ ] Manejo de estados de loading y error
- [ ] Confirmaciones para acciones destructivas

### ✅ Código
- [ ] TypeScript implementado correctamente
- [ ] React Query para manejo de estado del servidor
- [ ] Componentes reutilizables
- [ ] Hooks personalizados para lógica común
- [ ] Manejo de errores robusto

### ✅ Integración
- [ ] Conexión exitosa con el backend en `localhost:3000`
- [ ] Todas las llamadas API funcionan
- [ ] Manejo correcto de códigos de estado HTTP
- [ ] Variables de entorno configuradas

## 🚀 Entregables

1. **Código fuente** del frontend completo
2. **README.md** con instrucciones de instalación y ejecución
3. **Capturas de pantalla** de todas las vistas implementadas
4. **Documentación** de la API del frontend (opcional)

## 📝 Notas Importantes

- **No implementar autenticación** - el backend no la tiene
- **Usar exactamente** los nombres de campos del backend
- **Manejar errores** HTTP (404, 409, 500) apropiadamente
- **Implementar validaciones básicas** en formularios
- **Usar Tailwind CSS** para todos los estilos
- **Mantener consistencia** en el diseño entre páginas

---

**¡Construye un frontend que haga justicia a este robusto backend de ganado! 🐄✨**
