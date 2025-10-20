# 📄 SISTEMA DE FACTURACIÓN - GUÍA PARA FRONTEND

## 🎯 RESUMEN EJECUTIVO

Se ha implementado un sistema de facturación integrado en el módulo de **Ventas**. NO existe una tabla separada de facturas, sino que se agregaron campos a la tabla `Venta` existente para manejar toda la información de facturación.

---

## 📊 CAMBIOS EN LA BASE DE DATOS

### **Tabla `Venta` - CAMPOS NUEVOS:**

```sql
- Numero_Factura (varchar 50) - Generado automáticamente: FAC-2025-00001
- Vendedor (varchar 200) - Nombre del vendedor/rancho
- Metodo_Pago (varchar 50) - Efectivo, Sinpe Móvil, Transferencia, etc.
- Precio_Unitario (decimal) - Precio por cada animal
- Cantidad (int) - Cantidad de animales (default: 1)
- Subtotal (decimal) - Precio sin IVA
- IVA_Porcentaje (decimal) - Porcentaje de IVA (default: 12%)
- IVA_Monto (decimal) - Monto calculado de IVA
- Total (decimal) - Total con IVA
```

### **Cálculos Automáticos (Triggers SQL):**
- ✅ Número de factura se genera automáticamente
- ✅ IVA se calcula: `Subtotal × (IVA_Porcentaje / 100)`
- ✅ Total se calcula: `Subtotal + IVA_Monto`
- ✅ Si proporcionas `Precio_Unitario`, se calcula `Subtotal = Precio_Unitario × Cantidad`

---

## 📡 ENDPOINTS DE LA API

### **BASE URL:** `http://localhost:3000/api/ventas`

---

## 1️⃣ CREAR VENTA/FACTURA

### **POST** `/api/ventas`

**Descripción:** Crea una venta y genera automáticamente la factura con número único.

### **Body (JSON):**

```typescript
interface CrearVentaRequest {
  // OBLIGATORIOS
  ID_Animal: number;           // ID del animal a vender
  Fecha_Venta: string;         // Formato: YYYY-MM-DD
  Tipo_Venta: string;          // "Directa", "Subasta", etc.
  Comprador: string;           // Nombre del comprador
  Vendedor: string;            // Nombre del vendedor/rancho
  Precio_Unitario: number;     // Precio por animal
  
  // OPCIONALES
  Metodo_Pago?: string;        // "Efectivo", "Sinpe Móvil", "Transferencia", "Cheque", "Tarjeta"
  Cantidad?: number;           // Default: 1
  Subtotal?: number;           // Se calcula automáticamente si no se proporciona
  IVA_Porcentaje?: number;     // Default: 12.00
  Registrado_Por?: number;     // ID del usuario logueado
  Observaciones?: string;      // Notas adicionales
}
```

### **Ejemplo de Petición:**

```javascript
fetch('http://localhost:3000/api/ventas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // OBLIGATORIOS
    ID_Animal: 12,
    Fecha_Venta: "2025-01-10",
    Tipo_Venta: "Directa",
    Comprador: "Juan Pérez García",
    Vendedor: "Rancho El Paraíso",
    Precio_Unitario: 50000.00,
    
    // OPCIONALES
    Metodo_Pago: "Transferencia",
    Cantidad: 1,
    IVA_Porcentaje: 12.00,
    Registrado_Por: 1,
    Observaciones: "Pago en una sola exhibición"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### **Respuesta Exitosa (201):**

```json
{
  "data": {
    "ID_Venta": 15,
    "Numero_Factura": "FAC-2025-00015",
    "ID_Animal": 12,
    "Fecha_Venta": "2025-01-10",
    "Tipo_Venta": "Directa",
    "Comprador": "Juan Pérez García",
    "Vendedor": "Rancho El Paraíso",
    "Metodo_Pago": "Transferencia",
    "Precio_Unitario": "50000.00",
    "Cantidad": 1,
    "Subtotal": "50000.00",
    "IVA_Porcentaje": "12.00",
    "IVA_Monto": "6000.00",
    "Total": "56000.00",
    "Registrado_Por": 1,
    "Observaciones": "Pago en una sola exhibición",
    "AnimalNombre": "Vaca Lechera",
    "AnimalRaza": "Holstein",
    "AnimalSexo": "Hembra",
    "AnimalPeso": "450kg",
    "CategoriaTipo": "Ganado Lechero",
    "UsuarioNombre": "Admin"
  }
}
```

### **Cálculos que hace el Backend Automáticamente:**

```
Si proporcionas Precio_Unitario:
  Subtotal = Precio_Unitario × Cantidad

IVA_Monto = Subtotal × (IVA_Porcentaje / 100)
  Ejemplo: 50,000 × 0.12 = 6,000

Total = Subtotal + IVA_Monto
  Ejemplo: 50,000 + 6,000 = 56,000

Numero_Factura = "FAC-YYYY-NNNNN"
  Ejemplo: FAC-2025-00001, FAC-2025-00002, etc.
```

---

## 2️⃣ LISTAR VENTAS/FACTURAS

### **GET** `/api/ventas`

**Query Parameters (TODOS OPCIONALES):**

```typescript
{
  ID_Animal?: number;          // Filtrar por animal
  Comprador?: string;          // Buscar por nombre de comprador (parcial)
  Numero_Factura?: string;     // Buscar por número de factura
  fechaDesde?: string;         // YYYY-MM-DD
  fechaHasta?: string;         // YYYY-MM-DD
  Tipo_Venta?: string;         // Filtrar por tipo
  page?: number;               // Número de página
  limit?: number;              // Elementos por página
}
```

### **Ejemplos:**

```javascript
// Todas las ventas sin paginación
fetch('http://localhost:3000/api/ventas')

// Con paginación
fetch('http://localhost:3000/api/ventas?page=1&limit=10')

// Buscar por comprador
fetch('http://localhost:3000/api/ventas?Comprador=Juan')

// Buscar por número de factura
fetch('http://localhost:3000/api/ventas?Numero_Factura=FAC-2025-00001')

// Filtrar por rango de fechas
fetch('http://localhost:3000/api/ventas?fechaDesde=2025-01-01&fechaHasta=2025-01-31')
```

---

## 3️⃣ OBTENER VENTA POR ID

### **GET** `/api/ventas/:id`

```javascript
fetch('http://localhost:3000/api/ventas/15')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 4️⃣ BUSCAR POR NÚMERO DE FACTURA

### **GET** `/api/ventas/factura/numero/:numero`

```javascript
fetch('http://localhost:3000/api/ventas/factura/numero/FAC-2025-00001')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 5️⃣ OBTENER DATOS PARA PDF

### **GET** `/api/ventas/:id/factura-pdf`

**Descripción:** Devuelve todos los datos necesarios para generar el PDF de la factura.

```javascript
fetch('http://localhost:3000/api/ventas/15/factura-pdf')
  .then(res => res.json())
  .then(data => {
    // data.data contiene todos los campos para el PDF
    console.log(data.data);
  });
```

**Respuesta incluye:**
```json
{
  "data": {
    "ID_Venta": 15,
    "Numero_Factura": "FAC-2025-00015",
    "Fecha_Venta": "2025-01-10",
    "Comprador": "Juan Pérez García",
    "Vendedor": "Rancho El Paraíso",
    "Metodo_Pago": "Transferencia",
    "Cantidad": 1,
    "Precio_Unitario": "50000.00",
    "Subtotal": "50000.00",
    "IVA_Porcentaje": "12.00",
    "IVA_Monto": "6000.00",
    "Total": "56000.00",
    "Animal_Nombre": "Vaca Lechera",
    "Animal_Raza": "Holstein",
    "Animal_Sexo": "Hembra",
    "Animal_Peso": "450kg",
    "Animal_Color": "Blanco con manchas",
    "Animal_Categoria": "Ganado Lechero",
    "Registrado_Por_Nombre": "Admin",
    "Observaciones": "..."
  }
}
```

---

## 6️⃣ OBTENER ESTADÍSTICAS

### **GET** `/api/ventas/estadisticas`

**Query Parameters:**
```typescript
{
  fechaDesde?: string;  // YYYY-MM-DD
  fechaHasta?: string;  // YYYY-MM-DD
}
```

**Ejemplo:**

```javascript
// Estadísticas de enero 2025
fetch('http://localhost:3000/api/ventas/estadisticas?fechaDesde=2025-01-01&fechaHasta=2025-01-31')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Respuesta:**

```json
{
  "data": {
    "total_ventas": 45,
    "monto_total": "2520000.00",
    "subtotal_total": "2250000.00",
    "iva_total": "270000.00",
    "promedio_venta": "56000.00",
    "venta_minima": "15000.00",
    "venta_maxima": "150000.00"
  }
}
```

---

## 🎨 IMPLEMENTACIÓN EN FRONTEND

### **FORMULARIO DE CREAR VENTA/FACTURA**

```jsx
import { useState } from 'react';

function CrearVentaForm({ animalId, onSuccess }) {
  const [formData, setFormData] = useState({
    ID_Animal: animalId,
    Fecha_Venta: new Date().toISOString().split('T')[0],
    Tipo_Venta: "Directa",
    Comprador: "",
    Vendedor: "Rancho El Paraíso", // Default
    Metodo_Pago: "Efectivo",
    Precio_Unitario: 0,
    Cantidad: 1,
    IVA_Porcentaje: 12.00,
    Registrado_Por: 1, // ID del usuario logueado
    Observaciones: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcular totales en tiempo real
  const subtotal = parseFloat(formData.Precio_Unitario) * formData.Cantidad;
  const iva = subtotal * (formData.IVA_Porcentaje / 100);
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          Subtotal: subtotal // Calculado en el frontend
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear venta');
      }

      alert(`¡Venta creada! Factura: ${data.data.Numero_Factura}`);
      onSuccess(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Venta/Factura</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {/* COMPRADOR */}
      <div className="form-group">
        <label>Comprador *</label>
        <input
          type="text"
          value={formData.Comprador}
          onChange={(e) => setFormData({...formData, Comprador: e.target.value})}
          required
          placeholder="Nombre del comprador"
        />
      </div>

      {/* VENDEDOR */}
      <div className="form-group">
        <label>Vendedor *</label>
        <input
          type="text"
          value={formData.Vendedor}
          onChange={(e) => setFormData({...formData, Vendedor: e.target.value})}
          required
          placeholder="Nombre del vendedor/rancho"
        />
      </div>

      {/* MÉTODO DE PAGO */}
      <div className="form-group">
        <label>Método de Pago</label>
        <select
          value={formData.Metodo_Pago}
          onChange={(e) => setFormData({...formData, Metodo_Pago: e.target.value})}
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Sinpe Móvil">Sinpe Móvil</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Cheque">Cheque</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
      </div>

      {/* PRECIO UNITARIO */}
      <div className="form-group">
        <label>Precio Unitario *</label>
        <input
          type="number"
          value={formData.Precio_Unitario}
          onChange={(e) => setFormData({...formData, Precio_Unitario: e.target.value})}
          required
          min="0.01"
          step="0.01"
          placeholder="50000.00"
        />
      </div>

      {/* CANTIDAD (siempre 1 por ahora) */}
      <div className="form-group">
        <label>Cantidad</label>
        <input
          type="number"
          value={formData.Cantidad}
          onChange={(e) => setFormData({...formData, Cantidad: parseInt(e.target.value)})}
          min="1"
          disabled // Siempre 1 por ahora
        />
      </div>

      {/* RESUMEN DE FACTURA */}
      <div className="factura-resumen">
        <h3>Resumen de Factura</h3>
        <div className="linea-factura">
          <span>SUBTOTAL:</span>
          <span>₡{subtotal.toLocaleString('es-CR', {minimumFractionDigits: 2})}</span>
        </div>
        <div className="linea-factura">
          <span>IVA ({formData.IVA_Porcentaje}%):</span>
          <span>₡{iva.toLocaleString('es-CR', {minimumFractionDigits: 2})}</span>
        </div>
        <div className="linea-factura total">
          <span><strong>TOTAL:</strong></span>
          <span><strong>₡{total.toLocaleString('es-CR', {minimumFractionDigits: 2})}</strong></span>
        </div>
      </div>

      {/* OBSERVACIONES */}
      <div className="form-group">
        <label>Observaciones</label>
        <textarea
          value={formData.Observaciones}
          onChange={(e) => setFormData({...formData, Observaciones: e.target.value})}
          rows={3}
          placeholder="Notas adicionales..."
        />
      </div>

      {/* BOTONES */}
      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Creando...' : 'Crear Venta y Generar Factura'}
        </button>
      </div>
    </form>
  );
}

export default CrearVentaForm;
```

---

## 📄 GENERAR PDF DE FACTURA

**Librería recomendada:** `jsPDF` + `jspdf-autotable`

```bash
npm install jspdf jspdf-autotable
```

### **Ejemplo de Generador de PDF:**

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

async function generarFacturaPDF(ventaId) {
  // 1. Obtener datos de la factura
  const response = await fetch(`http://localhost:3000/api/ventas/${ventaId}/factura-pdf`);
  const { data: factura } = await response.json();

  // 2. Crear documento PDF
  const doc = new jsPDF();
  
  // 3. Encabezado
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Número: ${factura.Numero_Factura}`, 105, 30, { align: 'center' });
  doc.text(`Fecha: ${new Date(factura.Fecha_Venta).toLocaleDateString('es-CR')}`, 105, 37, { align: 'center' });

  // 4. Información del Vendedor
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VENDEDOR:', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.Vendedor, 20, 56);

  // 5. Información del Comprador
  doc.setFont('helvetica', 'bold');
  doc.text('COMPRADOR:', 120, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(factura.Comprador, 120, 56);

  // 6. Línea divisoria
  doc.line(20, 65, 190, 65);

  // 7. Detalles del Animal
  doc.autoTable({
    startY: 70,
    head: [['Descripción', 'Cantidad', 'Precio Unit.', 'Subtotal']],
    body: [
      [
        `${factura.Animal_Nombre}\n${factura.Animal_Raza} - ${factura.Animal_Sexo}\nPeso: ${factura.Animal_Peso}`,
        factura.Cantidad,
        `₡${parseFloat(factura.Precio_Unitario).toLocaleString('es-CR', {minimumFractionDigits: 2})}`,
        `₡${parseFloat(factura.Subtotal).toLocaleString('es-CR', {minimumFractionDigits: 2})}`
      ]
    ],
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] }
  });

  // 8. Totales
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text('SUBTOTAL:', 130, finalY);
  doc.text(`₡${parseFloat(factura.Subtotal).toLocaleString('es-CR', {minimumFractionDigits: 2})}`, 190, finalY, { align: 'right' });
  
  doc.text(`IVA (${factura.IVA_Porcentaje}%):`, 130, finalY + 7);
  doc.text(`₡${parseFloat(factura.IVA_Monto).toLocaleString('es-CR', {minimumFractionDigits: 2})}`, 190, finalY + 7, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 130, finalY + 15);
  doc.text(`₡${parseFloat(factura.Total).toLocaleString('es-CR', {minimumFractionDigits: 2})}`, 190, finalY + 15, { align: 'right' });

  // 9. Método de Pago
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Método de Pago: ${factura.Metodo_Pago}`, 20, finalY + 30);

  // 10. Observaciones
  if (factura.Observaciones) {
    doc.text('Observaciones:', 20, finalY + 40);
    doc.setFontSize(9);
    const splitObservaciones = doc.splitTextToSize(factura.Observaciones, 170);
    doc.text(splitObservaciones, 20, finalY + 46);
  }

  // 11. Pie de página
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('Gracias por su compra', 105, 280, { align: 'center' });
  doc.text(`Registrado por: ${factura.Registrado_Por_Nombre}`, 105, 285, { align: 'center' });

  // 12. Guardar PDF
  doc.save(`Factura-${factura.Numero_Factura}.pdf`);
}

// Uso:
// generarFacturaPDF(15);
```

---

## 🎯 VALIDACIONES EN EL FORMULARIO

```typescript
const validaciones = {
  ID_Animal: "Requerido - debe seleccionar un animal",
  Fecha_Venta: "Requerido - formato YYYY-MM-DD",
  Tipo_Venta: "Requerido - mínimo 3 caracteres",
  Comprador: "Requerido - mínimo 3 caracteres",
  Vendedor: "Requerido - mínimo 3 caracteres",
  Precio_Unitario: "Requerido - número mayor a 0",
  Metodo_Pago: "Opcional - dropdown",
  Cantidad: "Opcional - default 1, mínimo 1",
  IVA_Porcentaje: "Opcional - default 12%, entre 0-100",
  Observaciones: "Opcional - máximo 1000 caracteres"
};
```

---

## 🚀 FLUJO DE USUARIO COMPLETO

```
1. Usuario ve lista de animales disponibles
   ↓
2. Selecciona un animal y click en "Vender"
   ↓
3. Se abre formulario de venta con:
   - Comprador (input text)
   - Vendedor (input text con valor default)
   - Método de Pago (dropdown)
   - Precio Unitario (input number)
   - Cálculo automático de Subtotal, IVA, Total en UI
   ↓
4. Usuario completa formulario y click en "Crear Venta"
   ↓
5. POST /api/ventas
   ↓
6. Backend:
   - Genera número de factura automáticamente
   - Calcula IVA y Total
   - Cambia estado del animal a "vendida"
   - Guarda en base de datos
   ↓
7. Respuesta exitosa con datos completos incluyendo Numero_Factura
   ↓
8. Frontend muestra:
   - Mensaje de éxito
   - Número de factura generado
   - Botón "Descargar PDF"
   ↓
9. Usuario click en "Descargar PDF"
   ↓
10. GET /api/ventas/:id/factura-pdf
    ↓
11. Generar PDF con jsPDF
    ↓
12. Descargar archivo: Factura-FAC-2025-00001.pdf
```

---

## 🔍 CONSIDERACIONES IMPORTANTES

### **Para Múltiples Animales:**
Actualmente, la tabla solo permite 1 animal por venta (constraint UNIQUE en ID_Animal).

**Solución temporal:**
- Crear una venta por cada animal
- Agruparlas por Comprador + Fecha_Venta al generar PDF

**Ejemplo:**
```javascript
// Vender 3 animales al mismo comprador:
const animalesIds = [12, 15, 18];
const datosComunes = {
  Comprador: "Juan Pérez",
  Vendedor: "Rancho El Paraíso",
  Metodo_Pago: "Transferencia",
  Fecha_Venta: "2025-01-10"
};

for (const animalId of animalesIds) {
  await fetch('http://localhost:3000/api/ventas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ID_Animal: animalId,
      ...datosComunes,
      Precio_Unitario: 50000
    })
  });
}

// Luego generar un PDF consolidado con las 3 ventas
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Backend (✅ COMPLETADO):**
- ✅ Script SQL para modificar tabla Venta
- ✅ Triggers para cálculos automáticos
- ✅ Repository actualizado
- ✅ Controller con nuevos endpoints
- ✅ Rutas actualizadas
- ✅ Documentación Swagger

### **Frontend (PENDIENTE):**
- ⬜ Formulario crear venta con campos de facturación
- ⬜ Dropdown de métodos de pago
- ⬜ Cálculo en tiempo real de IVA y Total
- ⬜ Lista de ventas/facturas
- ⬜ Vista detallada de factura
- ⬜ Generador de PDF con jsPDF
- ⬜ Búsqueda por número de factura
- ⬜ Dashboard de estadísticas
- ⬜ Validaciones de formulario
- ⬜ Manejo de errores

---

## 🎯 INSTRUCCIONES FINALES

1. **Ejecutar script SQL:**
   ```bash
   mysql -u root -p GanadoDB < scripts/update-ventas-facturacion.sql
   ```

2. **Reiniciar backend:**
   ```bash
   npm run dev
   ```

3. **Verificar en Swagger:**
   `http://localhost:3000/api-docs` → Sección "Ventas"

4. **Implementar en frontend:**
   - Usar los ejemplos de código de este documento
   - Instalar jsPDF para generación de PDF
   - Implementar formulario con dropdown de métodos de pago
   - Calcular IVA y Total en tiempo real en UI

---

**¡TODO LISTO EN EL BACKEND! 🚀**

El sistema está completo y funcional. El frontend solo necesita consumir los endpoints y generar el PDF.

