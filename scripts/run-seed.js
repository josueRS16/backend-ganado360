require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execute } = require('../src/db/pool');

async function runSeed() {
  try {
    console.log('🔄 Iniciando carga de datos iniciales...');
    
    // Leer el archivo seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Dividir el SQL en statements individuales
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Ejecutando ${statements.length} statements...`);
    
    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await execute(statement);
          console.log(`✅ Statement ${i + 1} ejecutado correctamente`);
        } catch (error) {
          console.error(`❌ Error en statement ${i + 1}:`, error.message);
          // Continuar con el siguiente statement
        }
      }
    }
    
    console.log('🎉 Carga de datos iniciales completada');
    
  } catch (error) {
    console.error('💥 Error durante la carga de datos:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
