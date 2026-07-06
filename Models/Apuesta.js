const { getConnection, sql } = require("../Config/db");

// OBTENER TODAS LAS APUESTAS

async function obtenerTodas() {
    const pool = await getConnection();

    const resultado = await pool.request().query(`
        SELECT 
            A.id_apuesta, A.evento, A.fecha_evento, A.fecha_cierre, 
            A.prioridad, A.destacada, A.comision, A.estado,
            O1.descripcion AS opcionA, O2.descripcion AS opcionB,
            AP.num_ocurrencia, AP.importe
        FROM Apuestas A
        INNER JOIN ApuestasDetalle O1 ON A.id_apuesta = O1.id_apuesta AND O1.num_ocurrencia = 1
        INNER JOIN ApuestasDetalle O2 ON A.id_apuesta = O2.id_apuesta AND O2.num_ocurrencia = 2
        LEFT JOIN ApuestasPersonas AP ON A.id_apuesta = AP.id_apuesta
        ORDER BY 
            CASE WHEN A.destacada = 1 THEN 0
                 WHEN A.fecha_cierre >= GETDATE() AND A.estado != 'CER' THEN 1
                 WHEN A.fecha_cierre < GETDATE() AND A.estado != 'CER' THEN 2
                 ELSE 3 END,
            A.fecha_cierre ASC
    `);


    const apuestas = []; 

    for (let fila of resultado.recordset) {
        
        let apuestaExistente = apuestas.find(a => a.id_apuesta === fila.id_apuesta);

        if (!apuestaExistente) {
            apuestaExistente = {
                id_apuesta: fila.id_apuesta,
                evento: fila.evento,
                fecha_evento: fila.fecha_evento,
                fecha_cierre: fila.fecha_cierre,
                prioridad: fila.prioridad,
                destacada: fila.destacada,
                comision: fila.comision,
                estado: fila.estado,
                opcionA: fila.opcionA,
                opcionB: fila.opcionB,
                montoOpcionA: 0,
                montoOpcionB: 0
            };
            apuestas.push(apuestaExistente);
        }

        if (fila.importe) {
            if (fila.num_ocurrencia === 1) {
                apuestaExistente.montoOpcionA += fila.importe;
            } else if (fila.num_ocurrencia === 2) {
                apuestaExistente.montoOpcionB += fila.importe;
            }
        }
    }

    // 3. CALCULO DE CUOTAS
    apuestas.forEach(apuesta => {
        const totalApostado = apuesta.montoOpcionA + apuesta.montoOpcionB;
        const pozoNeto = totalApostado - (totalApostado * apuesta.comision / 100);

        apuesta.cuotaA = apuesta.montoOpcionA > 0 
            ? (pozoNeto / apuesta.montoOpcionA).toFixed(2) 
            : 0;

        apuesta.cuotaB = apuesta.montoOpcionB > 0 
            ? (pozoNeto / apuesta.montoOpcionB).toFixed(2) 
            : 0;
    });

    return apuestas;
}

// OBTENER APUESTA POR ID

async function obtenerPorId(id) {
    const pool = await getConnection();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT 
                A.id_apuesta, A.evento, A.fecha_evento, A.fecha_cierre, 
                A.prioridad, A.destacada, A.comision, A.estado,
                O1.descripcion AS opcionA, O2.descripcion AS opcionB,
                AP.num_ocurrencia, AP.importe
            FROM Apuestas A
            INNER JOIN ApuestasDetalle O1 ON A.id_apuesta = O1.id_apuesta AND O1.num_ocurrencia = 1
            INNER JOIN ApuestasDetalle O2 ON A.id_apuesta = O2.id_apuesta AND O2.num_ocurrencia = 2
            LEFT JOIN ApuestasPersonas AP ON A.id_apuesta = AP.id_apuesta
            WHERE A.id_apuesta = @id
        `);

    if (resultado.recordset.length === 0) {
        return null; // No existe la apuesta
    }

    const primeraFila = resultado.recordset[0];
    
    const apuesta = {
        id_apuesta: primeraFila.id_apuesta,
        evento: primeraFila.evento,
        fecha_evento: primeraFila.fecha_evento,
        fecha_cierre: primeraFila.fecha_cierre,
        prioridad: primeraFila.prioridad,
        destacada: primeraFila.destacada,
        comision: primeraFila.comision,
        estado: primeraFila.estado,
        opcionA: primeraFila.opcionA,
        opcionB: primeraFila.opcionB,
        montoOpcionA: 0,
        montoOpcionB: 0
    };

    for (let fila of resultado.recordset) {
        if (fila.importe) {
            if (fila.num_ocurrencia === 1) apuesta.montoOpcionA += fila.importe;
            if (fila.num_ocurrencia === 2) apuesta.montoOpcionB += fila.importe;
        }
    }

    const totalApostado = apuesta.montoOpcionA + apuesta.montoOpcionB;
    const pozoNeto = totalApostado - (totalApostado * apuesta.comision / 100);

    apuesta.cuotaA = apuesta.montoOpcionA > 0 
        ? (pozoNeto / apuesta.montoOpcionA).toFixed(2) 
        : 0;

    apuesta.cuotaB = apuesta.montoOpcionB > 0 
        ? (pozoNeto / apuesta.montoOpcionB).toFixed(2) 
        : 0;

    return apuesta;
}

// CAMBIAR ESTADO

async function cambiarEstado(id) {
    const pool = await getConnection();

    const consulta = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`SELECT estado FROM Apuestas WHERE id_apuesta = @id`);

    const estadoActual = consulta.recordset[0].estado;
    const nuevoEstado = estadoActual === "ACT" ? "CER" : "ACT";

    await pool
        .request()
        .input("id", sql.Int, id)
        .input("estado", sql.Char(3), nuevoEstado)
        .query(`UPDATE Apuestas SET estado = @estado WHERE id_apuesta = @id`);

    return nuevoEstado;
}

// DESTACAR APUESTA

async function destacarApuesta(id) {
    const pool = await getConnection();

    await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            UPDATE Apuestas 
            SET destacada = CASE WHEN destacada = 1 THEN 0 ELSE 1 END 
            WHERE id_apuesta = @id
        `);
}

// OBTENER APOSTADORES

async function obtenerApostadores(id) {
    const pool = await getConnection();

    const resultado = await pool
        .request()
        .input("id", sql.Int, id)
        .query(`
            SELECT P.nombre, P.apellido, AP.importe, D.descripcion AS opcion 
            FROM ApuestasPersonas AP
            INNER JOIN Personas P ON AP.id_persona = P.id_persona
            INNER JOIN ApuestasDetalle D ON AP.id_apuesta = D.id_apuesta AND AP.num_ocurrencia = D.num_ocurrencia
            WHERE AP.id_apuesta = @id
            ORDER BY P.apellido, P.nombre
        `);

    return resultado.recordset;
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    cambiarEstado,
    destacarApuesta,
    obtenerApostadores
};