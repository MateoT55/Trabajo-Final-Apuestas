const express = require("express");
const router = express.Router();
const apuestaController = require("../Controllers/ApuestaController");

// 1. Obtener todas
router.get("/", apuestaController.getAll);

// 2. IMPORTANTE: La ruta específica de detalle va PRIMERO
router.get("/detalle/:id", apuestaController.getDetalle);

// 3. La ruta genérica de ID va DESPUÉS
router.get("/:id", apuestaController.getById);

// ... (Acá siguen los PUT de destacar, quitar-destacada, etc)
router.put("/destacar/:id", apuestaController.destacar);
router.put("/quitar-destacada/:id", apuestaController.quitarDestacada);
router.put("/estado/:id", apuestaController.cambiarEstado);

module.exports = router;