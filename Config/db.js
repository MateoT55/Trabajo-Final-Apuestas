const sql = require("mssql/msnodesqlv8");

// Usamos una connectionString explícita para evitar que Node intente adivinar
// el nombre del driver ODBC en Windows y falle.
const config = {
    connectionString: "Driver={SQL Server};Server=localhost;Database=SistemasApuestas;Trusted_Connection=yes;"

};

/* 💡 NOTA DE COMPATIBILIDAD:
Si al ejecutar te sigue dando el mismo error de "No se encuentra el nombre del origen", 
es porque tenés una versión de driver más nueva o más vieja. Simplemente cambiá la línea de arriba por una de estas opciones:

Opción para Driver 18 (Si descargaste el más reciente):
connectionString: "Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=SistemaApuestas;Trusted_Connection=yes;TrustServerCertificate=yes;Encrypt=no;"

Opción universal (El driver antiguo que viene por defecto en todo Windows):
connectionString: "Driver={SQL Server};Server=localhost;Database=SistemaApuestas;Trusted_Connection=yes;"
*/

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log("Conexión a la Base de Datos SQL Server exitosa.");
        return pool;
    } catch (error) {
        console.error("Error al conectar a SQL Server:", error);
        process.exit(1);
    }
};

module.exports = {
    sql,
    config,
    connectDB
};