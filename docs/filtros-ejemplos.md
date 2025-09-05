# Ejemplos de Uso de Filtros - API Ganado360

## Filtros de Animales

### 1. Filtro por Fechas de Ingreso

**URL Correcta:**
```
http://localhost:3000/api/animales?fechaIngresoDesde=2025-09-01&fechaIngresoHasta=2025-09-02
```

**URL Incorrecta (con comillas):**
```
http://localhost:3000/api/animales?fechaIngresoDesde=%222025-09-01%22&fechaIngresoHasta=%222025-09-02%22
```

### 2. Filtro por Sexo

```
http://localhost:3000/api/animales?Sexo=H
http://localhost:3000/api/animales?Sexo=M
```

### 3. Filtro por Categoría

```
http://localhost:3000/api/animales?ID_Categoria=1
```

### 4. Filtro por Estado de Preñez

```
http://localhost:3000/api/animales?Esta_Preniada=1
http://localhost:3000/api/animales?Esta_Preniada=0
http://localhost:3000/api/animales?Esta_Preniada=true
http://localhost:3000/api/animales?Esta_Preniada=false
```

### 5. Paginación (AMBOS parámetros requeridos)

```
http://localhost:3000/api/animales?page=1&limit=5
http://localhost:3000/api/animales?page=2&limit=3
http://localhost:3000/api/animales?page=1&limit=10
```

### 5.1. Sin Paginación (devuelve TODOS los registros)

```
http://localhost:3000/api/animales
http://localhost:3000/api/animales?page=1
http://localhost:3000/api/animales?limit=5
```

### 6. Combinación de Filtros y Paginación

```
http://localhost:3000/api/animales?Sexo=H&ID_Categoria=1&fechaIngresoDesde=2025-01-01&page=1&limit=5
http://localhost:3000/api/animales?Esta_Preniada=1&Sexo=H&page=2&limit=3
http://localhost:3000/api/animales?Esta_Preniada=0&ID_Categoria=1&page=1&limit=10
```

## Formato de Fechas

- **Formato requerido:** `YYYY-MM-DD`
- **Ejemplos válidos:**
  - `2025-09-01`
  - `2023-12-25`
  - `2024-01-15`

## Uso en Swagger UI

1. Ve a `http://localhost:3000/api-docs`
2. Selecciona el endpoint `GET /animales`
3. Haz clic en "Try it out"
4. Completa los parámetros de query:
   - `fechaIngresoDesde`: `2025-09-01` (sin comillas)
   - `fechaIngresoHasta`: `2025-09-02` (sin comillas)
   - `Sexo`: `H` o `M`
   - `ID_Categoria`: `1`, `2`, etc.
   - `Esta_Preniada`: `1`, `0`, `true`, o `false`
   - `page`: `1`, `2`, `3`, etc. (número de página - requiere limit)
   - `limit`: `5`, `10`, `20`, etc. (registros por página, máximo 100 - requiere page)
5. Haz clic en "Execute"

## Respuesta Esperada

```json
{
  "data": [
    {
      "ID_Animal": 1,
      "Nombre": "Bella",
      "Sexo": "H",
      "Color": "Marrón",
      "Peso": 450.5,
      "Fecha_Nacimiento": "2020-05-15",
      "Raza": "Holstein",
      "Esta_Preniada": false,
      "Fecha_Ingreso": "2023-01-10",
      "ID_Categoria": 1,
      "CategoriaTipo": "Vaca"
    }
  ],
  "count": 1,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1,
    "limit": 5,
    "hasNextPage": false,
    "hasPrevPage": false,
    "nextPage": null,
    "prevPage": null
  }
}
```

## Formato de Valores Booleanos

- **Para Esta_Preniada:**
  - `1` o `true` = Animal preñado
  - `0` o `false` = Animal no preñado

## Parámetros de Paginación

- **page**: Número de página (inicia en 1)
- **limit**: Registros por página (máximo 100)

**⚠️ Importante:** La paginación solo se activa cuando se proporcionan **AMBOS** parámetros (`page` Y `limit`). Si solo se proporciona uno de ellos, se devuelven TODOS los registros sin paginación.

## Notas Importantes

- ✅ **Correcto:** Usar fechas en formato `YYYY-MM-DD` sin comillas
- ❌ **Incorrecto:** Usar comillas alrededor de las fechas
- ✅ **Correcto:** Los valores de enum (Sexo) son `M` o `H`
- ✅ **Correcto:** Los IDs son números enteros
- ✅ **Correcto:** Los valores booleanos pueden ser `1/0` o `true/false`
- ✅ **Correcto:** La paginación funciona con todos los filtros
- ✅ **Correcto:** El límite máximo es 100 registros por página
