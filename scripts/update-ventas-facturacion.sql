-- ============================================
-- ACTUALIZACIÓN DEL SISTEMA DE VENTAS
-- Para soportar facturación con múltiples animales
-- ============================================

-- PASO 1: Modificar tabla Venta para agregar campos de facturación
ALTER TABLE `Venta` 
  -- Cambiar Precio a Subtotal para mayor claridad
  CHANGE COLUMN `Precio` `Subtotal` DECIMAL(18,2) NULL DEFAULT NULL,
  
  -- Agregar campos nuevos de facturación
  ADD COLUMN `Vendedor` VARCHAR(200) NULL COMMENT 'Nombre del vendedor/rancho' AFTER `Comprador`,
  ADD COLUMN `Metodo_Pago` VARCHAR(50) NULL COMMENT 'Efectivo, Sinpe Móvil, Transferencia, etc.' AFTER `Vendedor`,
  ADD COLUMN `Precio_Unitario` DECIMAL(18,2) NULL COMMENT 'Precio por animal' AFTER `Metodo_Pago`,
  ADD COLUMN `Cantidad` INT DEFAULT 1 COMMENT 'Cantidad de animales (siempre 1 por ahora)' AFTER `Precio_Unitario`,
  ADD COLUMN `IVA_Porcentaje` DECIMAL(5,2) DEFAULT 12.00 COMMENT 'Porcentaje de IVA (default 12%)' AFTER `Subtotal`,
  ADD COLUMN `IVA_Monto` DECIMAL(18,2) DEFAULT 0.00 COMMENT 'Monto calculado de IVA' AFTER `IVA_Porcentaje`,
  ADD COLUMN `Total` DECIMAL(18,2) NULL COMMENT 'Total con IVA' AFTER `IVA_Monto`,
  ADD COLUMN `Numero_Factura` VARCHAR(50) NULL UNIQUE COMMENT 'Número único de factura' AFTER `ID_Venta`;

-- Crear índice para búsqueda rápida por número de factura
CREATE INDEX `IDX_Numero_Factura` ON `Venta`(`Numero_Factura`);

-- ============================================
-- TRIGGER: Generar número de factura automáticamente
-- ============================================
DELIMITER $$

DROP TRIGGER IF EXISTS `trg_venta_numero_factura`$$

CREATE TRIGGER `trg_venta_numero_factura` 
BEFORE INSERT ON `Venta`
FOR EACH ROW
BEGIN
  DECLARE next_number INT;
  DECLARE prefix VARCHAR(10);
  DECLARE current_year VARCHAR(4);
  
  -- Obtener el año actual
  SET current_year = YEAR(CURDATE());
  
  -- Definir prefijo: FAC-2025-
  SET prefix = CONCAT('FAC-', current_year, '-');
  
  -- Si no se proporciona número de factura, generarlo automáticamente
  IF NEW.Numero_Factura IS NULL OR NEW.Numero_Factura = '' THEN
    -- Obtener el siguiente número secuencial del año actual
    SELECT COALESCE(MAX(CAST(SUBSTRING(Numero_Factura, LENGTH(prefix) + 1) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM Venta
    WHERE Numero_Factura LIKE CONCAT(prefix, '%');
    
    -- Generar número de factura: FAC-2025-00001
    SET NEW.Numero_Factura = CONCAT(prefix, LPAD(next_number, 5, '0'));
  END IF;
  
  -- Calcular Cantidad si no se proporciona
  IF NEW.Cantidad IS NULL OR NEW.Cantidad = 0 THEN
    SET NEW.Cantidad = 1;
  END IF;
  
  -- Calcular Subtotal si se proporcionó Precio_Unitario
  IF NEW.Precio_Unitario IS NOT NULL AND (NEW.Subtotal IS NULL OR NEW.Subtotal = 0) THEN
    SET NEW.Subtotal = NEW.Precio_Unitario * NEW.Cantidad;
  END IF;
  
  -- Si se proporcionó Subtotal pero no Precio_Unitario, calcularlo
  IF NEW.Subtotal IS NOT NULL AND NEW.Subtotal > 0 AND (NEW.Precio_Unitario IS NULL OR NEW.Precio_Unitario = 0) THEN
    SET NEW.Precio_Unitario = NEW.Subtotal / NEW.Cantidad;
  END IF;
  
  -- Calcular IVA si hay subtotal
  IF NEW.Subtotal IS NOT NULL AND NEW.Subtotal > 0 THEN
    SET NEW.IVA_Monto = ROUND(NEW.Subtotal * (NEW.IVA_Porcentaje / 100), 2);
    SET NEW.Total = NEW.Subtotal + NEW.IVA_Monto;
  END IF;
END$$

DELIMITER ;

-- ============================================
-- TRIGGER: Recalcular totales en UPDATE
-- ============================================
DELIMITER $$

DROP TRIGGER IF EXISTS `trg_venta_calcular_totales`$$

CREATE TRIGGER `trg_venta_calcular_totales` 
BEFORE UPDATE ON `Venta`
FOR EACH ROW
BEGIN
  -- Recalcular Cantidad si no está establecida
  IF NEW.Cantidad IS NULL OR NEW.Cantidad = 0 THEN
    SET NEW.Cantidad = 1;
  END IF;
  
  -- Recalcular Subtotal si cambió el Precio_Unitario o Cantidad
  IF NEW.Precio_Unitario IS NOT NULL AND 
     (NEW.Precio_Unitario != OLD.Precio_Unitario OR NEW.Cantidad != OLD.Cantidad) THEN
    SET NEW.Subtotal = NEW.Precio_Unitario * NEW.Cantidad;
  END IF;
  
  -- Recalcular IVA si cambió el Subtotal o el porcentaje de IVA
  IF NEW.Subtotal IS NOT NULL AND NEW.Subtotal > 0 AND
     (NEW.Subtotal != OLD.Subtotal OR NEW.IVA_Porcentaje != OLD.IVA_Porcentaje) THEN
    SET NEW.IVA_Monto = ROUND(NEW.Subtotal * (NEW.IVA_Porcentaje / 100), 2);
    SET NEW.Total = NEW.Subtotal + NEW.IVA_Monto;
  END IF;
END$$

DELIMITER ;

-- ============================================
-- ACTUALIZAR registros existentes (opcional)
-- ============================================
-- Calcular IVA y Total para ventas existentes que tienen Subtotal
UPDATE Venta 
SET 
  IVA_Porcentaje = 12.00,
  IVA_Monto = ROUND(Subtotal * 0.12, 2),
  Total = Subtotal + ROUND(Subtotal * 0.12, 2),
  Cantidad = 1,
  Precio_Unitario = Subtotal
WHERE Subtotal IS NOT NULL AND Subtotal > 0;

-- ============================================
-- VISTA: Ventas con información completa para PDF
-- ============================================
CREATE OR REPLACE VIEW `Vista_Ventas_Facturacion` AS
SELECT 
  v.ID_Venta,
  v.Numero_Factura,
  v.Fecha_Venta,
  v.ID_Animal,
  a.Nombre AS Animal_Nombre,
  a.Raza AS Animal_Raza,
  a.Sexo AS Animal_Sexo,
  a.Peso AS Animal_Peso,
  a.Color AS Animal_Color,
  c.Tipo AS Animal_Categoria,
  v.Comprador,
  v.Vendedor,
  v.Metodo_Pago,
  v.Tipo_Venta,
  v.Cantidad,
  v.Precio_Unitario,
  v.Subtotal,
  v.IVA_Porcentaje,
  v.IVA_Monto,
  v.Total,
  v.Observaciones,
  v.Registrado_Por,
  u.Nombre AS Registrado_Por_Nombre,
  v.Fecha_Venta AS Fecha_Emision
FROM Venta v
INNER JOIN Animal a ON v.ID_Animal = a.ID_Animal
LEFT JOIN Categoria c ON a.ID_Categoria = c.ID_Categoria
LEFT JOIN Usuario u ON v.Registrado_Por = u.ID_Usuario
ORDER BY v.Fecha_Venta DESC, v.ID_Venta DESC;

-- ============================================
-- COMENTARIOS FINALES
-- ============================================
-- Este script:
-- 1. Agrega campos de facturación a la tabla Venta existente
-- 2. Crea triggers para cálculo automático de IVA (12%) y totales
-- 3. Genera números de factura automáticos: FAC-2025-00001
-- 4. Crea vista para obtener información completa para PDFs
-- 5. Es compatible con registros existentes

-- NOTA: Para ventas con MÚLTIPLES animales, seguirás creando
-- una venta por cada animal, pero puedes agruparlas por Comprador
-- y Fecha_Venta al generar el PDF.

-- Para ejecutar:
-- mysql -u root -p GanadoDB < scripts/update-ventas-facturacion.sql

