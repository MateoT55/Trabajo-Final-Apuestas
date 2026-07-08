const Apuesta = require("../Models/Apuesta");




// OBTENER TODAS LAS APUESTAS
// GET /api/apuestas

async function obtenerApuestas(req, res) {

    try {

        const apuestas =
            await Apuesta.obtenerTodas();

        res.status(200).json(apuestas);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener las apuestas"
        });

    }

}





// OBTENER APUESTA POR ID
// GET /api/apuestas/:id

async function obtenerApuestaPorId(req, res) {

    try {

        const id =
            parseInt(req.params.id);

        const apuesta =
            await Apuesta.obtenerPorId(id);

        if (!apuesta) {

            return res.status(404).json({
                mensaje: "Apuesta no encontrada"
            });

        }

        res.status(200).json(apuesta);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener la apuesta"
        });

    }

}





// OBTENER APOSTADORES
// GET /api/apuestas/:id/apostadores

async function obtenerApostadores(req, res) {

    try {

        const id =
            parseInt(req.params.id);

        const apostadores =
            await Apuesta.obtenerApostadores(id);

        res.status(200).json(apostadores);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener apostadores"
        });

    }

}






// CAMBIAR ESTADO
// PUT /api/apuestas/:id/estado


async function cambiarEstado(req, res) {

    try {

        const id =
            parseInt(req.params.id);

        const nuevoEstado =
            await Apuesta.cambiarEstado(id);

        res.status(200).json({
            mensaje: "Estado actualizado",
            estado: nuevoEstado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al cambiar estado"
        });

    }

}






// DESTACAR APUESTA
// PUT /api/apuestas/:id/destacar


async function destacarApuesta(req, res) {

    try {

        const id =
            parseInt(req.params.id);

        await Apuesta.destacarApuesta(id);

        res.status(200).json({
            mensaje: "Apuesta destacada"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al destacar apuesta"
        });

    }

}





module.exports = {

    obtenerApuestas,
    obtenerApuestaPorId,
    obtenerApostadores,
    cambiarEstado,
    destacarApuesta

};