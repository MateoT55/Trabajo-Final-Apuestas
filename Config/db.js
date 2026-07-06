const sql = require("mssql/msnodesqlv8");

// Usamos EXACTAMENTE la cadena nativa que acaba de funcionar en tu prueba
const stringDeConexion = "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=SistemasApuesta;Trusted_Connection=yes;";

async function getConnection() {
    try {
        // Le pasamos la cadena directamente configurando la propiedad 'connectionString'
        const pool = await sql.connect({
            connectionString: stringDeConexion
        });
        
        console.log("✅ Base de datos conectada correctamente a tu proyecto Node/Express");
        return pool;
        
    } catch (error) {
        console.error("❌ Error en la conexión:", error);
    }
}

module.exports = {
    getConnection,
    sql
};