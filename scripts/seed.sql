-- Script de datos iniciales para GanadoDB

-- Insertar roles base
INSERT INTO Rol (Nombre) VALUES 
('Administrador'),
('Veterinario'),
('Operador'),
('Supervisor');

-- Insertar estados base
INSERT INTO Estado (Nombre) VALUES 
('Activo'),
('Enfermo'),
('Fallecido'),
('Vendido'),
('En Tratamiento');

-- Insertar categorías base
INSERT INTO Categoria (Tipo) VALUES 
('Bovino'),
('Porcino'),
('Ovino'),
('Caprino'),
('Equino');

-- Insertar usuarios de ejemplo
INSERT INTO Usuario (Nombre, Correo, Contraseña, RolID) VALUES 
('Juan Pérez', 'juan.perez@ganado.com', 'password123', 1),
('María García', 'maria.garcia@ganado.com', 'password123', 2),
('Carlos López', 'carlos.lopez@ganado.com', 'password123', 3);

-- Insertar animales de ejemplo
INSERT INTO Animal (Nombre, Sexo, Color, Peso, Fecha_Nacimiento, Raza, Esta_Preniada, Fecha_Ingreso, ID_Categoria) VALUES 
('Luna', 'Hembra', 'Negro', '450 kg', '2020-03-15', 'Holstein', 0, '2020-03-20', 1),
('Toro', 'Macho', 'Marrón', '800 kg', '2019-07-10', 'Angus', 0, '2019-07-15', 1),
('Estrella', 'Hembra', 'Blanco', '380 kg', '2021-01-20', 'Jersey', 1, '2021-01-25', 1),
('Rex', 'Macho', 'Gris', '600 kg', '2018-11-05', 'Hereford', 0, '2018-11-10', 1);

-- Insertar estados de animales
INSERT INTO Estado_Animal (ID_Animal, ID_Estado, Fecha_Fallecimiento) VALUES 
(1, 1, NULL),
(2, 1, NULL),
(3, 1, NULL),
(4, 1, NULL);

-- Insertar recordatorios de ejemplo
INSERT INTO Recordatorio (ID_Animal, Titulo, Descripcion, Fecha_Recordatorio) VALUES 
(1, 'Vacuna Triple', 'Aplicar vacuna triple viral', '2024-02-15'),
(2, 'Desparasitación', 'Desparasitar con ivermectina', '2024-02-20'),
(3, 'Control Prenatal', 'Revisar estado de gestación', '2024-02-25');

-- Insertar historial veterinario
INSERT INTO Historial_Veterinario (ID_Animal, Tipo_Evento, Descripcion, Fecha_Aplicacion, Proxima_Fecha, Hecho_Por) VALUES 
(1, 'Vacunación', 'Vacuna triple viral aplicada', '2024-01-15', '2024-07-15', 2),
(2, 'Desparasitación', 'Desparasitante aplicado', '2024-01-10', '2024-04-10', 2),
(3, 'Control Prenatal', 'Revisión de gestación exitosa', '2024-01-20', '2024-02-20', 2);

-- Insertar venta de ejemplo
INSERT INTO Venta (ID_Animal, Fecha_Venta, Tipo_Venta, Comprador, Precio, Registrado_Por, Observaciones) VALUES 
(4, '2024-01-30', 'Venta Directa', 'Granja San Martín', 2500.00, 1, 'Venta por fin de ciclo productivo');
