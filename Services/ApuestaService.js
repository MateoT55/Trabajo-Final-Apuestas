const { sql, config } = require("../Config/db");

class ApuestaService {
    
    
    async getAll() {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .query(`
            SELECT *
            FROM Apuestas
            ORDER BY destacada DESC, id_apuesta ASC
        `);
    return result.recordset;
    }


    async getById(id) {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT *
            FROM Apuestas
            WHERE id_apuesta = @id
        `);
    return result.recordset[0];
    }



    async destacar(id) {
    const pool = await sql.connect(config);
    await pool.request()
        .input("id", sql.Int, id)
        .query(`
            UPDATE Apuestas
            SET destacada = 1
            WHERE id_apuesta = @id
        `);
    return true;
    }



    async quitarDestacada(id) {
    const pool = await sql.connect(config);
    await pool.request()
        .input("id", sql.Int, id)
        .query(`
            UPDATE Apuestas
            SET destacada = 0
            WHERE id_apuesta = @id
        `);
    return true;
    }



    async cambiarEstado(id, nuevoEstado) {
    const pool = await sql.connect(config);
    await pool.request()
        .input("id", sql.Int, id)
        .input("estado", sql.VarChar(20), nuevoEstado)
        .query(`
            UPDATE Apuestas
            SET estado = @estado
            WHERE id_apuesta = @id
        `);
    return true;
    }


    async getAbiertas() {

    const pool = await sql.connect(config);

    const result = await pool.request()
        .query(`
            SELECT *
            FROM Apuestas
            WHERE estado = 'Abierta'
            ORDER BY destacada DESC
        `);

    return result.recordset;
    }


    async getCerradas() {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .query(`
            SELECT *
            FROM Apuestas
            WHERE estado = 'Cerrada'
        `);
    return result.recordset;
    }






    async getDetalle(id) {
    const pool = await sql.connect(config); 
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT
                a.*,

                ISNULL(
                    SUM(
                        CASE
                            WHEN j.eleccion = 'A'
                            THEN j.monto
                        END
                    ),
                    0
                ) AS totalA,

                ISNULL(
                    SUM(
                        CASE
                            WHEN j.eleccion = 'B'
                            THEN j.monto
                        END
                    ),
                    0
                ) AS totalB

            FROM Apuestas a

            LEFT JOIN Jugadas j
                ON a.id_apuesta = j.id_apuesta

            WHERE a.id_apuesta = @id

            GROUP BY
                a.id_apuesta,
                a.enunciado,
                a.opcion_a,
                a.opcion_b,
                a.estado,
                a.destacada
        `);

    return result.recordset[0];
    }
}


module.exports = new ApuestaService();