const { execute } = require('../src/db/pool');

(async () => {
  try {
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const rows = await execute(`
      SELECT hv.*, a.Nombre as AnimalNombre, u.Nombre as UsuarioNombre 
      FROM Historial_Veterinario hv 
      JOIN Animal a ON hv.ID_Animal = a.ID_Animal
      LEFT JOIN Usuario u ON hv.Hecho_Por = u.ID_Usuario
      ORDER BY hv.Fecha_Aplicacion DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    const countRows = await execute('SELECT COUNT(*) as total FROM Historial_Veterinario');

    console.log('rows length:', Array.isArray(rows) ? rows.length : typeof rows, rows && rows.slice(0,2));
    console.log('count:', countRows[0] && countRows[0].total);
  } catch (err) {
    console.error('Error running debug query:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
