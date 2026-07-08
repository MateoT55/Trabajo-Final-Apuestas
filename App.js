const express = require("express");
const cors = require("cors");

const apuestaRoutes = require("./Routes/ApuestaRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("FrontEnd")); // Convierte el servidor en un host de archivos estáticos.

app.use("/api/apuestas", apuestaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en puerto ${PORT}`);
});