const apuestaService = require("../Services/ApuestaService");

class ApuestaController {

    async getAll(req, res) {
        try {
            const apuestas = await apuestaService.getAll();
            res.json(apuestas);
        }
        catch(error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const apuesta = await apuestaService.getById(req.params.id);

            if(!apuesta){
                return res.status(404).json({
                    mensaje: "Apuesta no encontrada"
                });
            }

            res.json(apuesta);
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }

    async getDetalle(req, res) {
    try {
        const detalle = await apuestaService.getDetalle(req.params.id);

        if (!detalle) {
            return res.status(404).json({ mensaje: "Apuesta no encontrada" });
        }

        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

    async destacar(req, res) {
        try {
            await apuestaService.destacar(req.params.id);

            res.json({
                mensaje: "Apuesta destacada"
            });
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }

    async quitarDestacada(req, res) {
        try {
            await apuestaService.quitarDestacada(req.params.id);

            res.json({
                mensaje: "Apuesta ya no está destacada"
            });
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }

    async cambiarEstado(req, res) {
        try {

            const { estado } = req.body;

            await apuestaService.cambiarEstado(
                req.params.id,
                estado
            );

            res.json({
                mensaje: "Estado actualizado"
            });

        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ApuestaController();