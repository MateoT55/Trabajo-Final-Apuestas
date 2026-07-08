

const express = require("express");

const router = express.Router();

const apuestaController =
    require("../Controllers/ApuestaController");



// RUTAS GET

// Obtener todas las apuestas
router.get(
    "/",
    apuestaController.obtenerApuestas
);

// Obtener una apuesta por ID
router.get(
    "/:id",
    apuestaController.obtenerApuestaPorId
);

// Obtener apostadores de una apuesta
router.get(
    "/:id/apostadores",
    apuestaController.obtenerApostadores
);






// RUTAS PUT

// Abrir o cerrar apuesta
router.put(
    "/:id/estado",
    apuestaController.cambiarEstado
);

// Destacar apuesta
router.put(
    "/:id/destacar",
    apuestaController.destacarApuesta
);



module.exports = router;