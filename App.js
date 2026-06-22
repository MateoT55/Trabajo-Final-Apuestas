const express = require("express");
const cors = require("cors"); // <-- 1. AGREGÁ ESTA LÍNEA
const { connectDB } = require("./Config/db");
const apuestaRoutes = require("./Routes/ApuestaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // <-- 2. AGREGÁ ESTA LÍNEA (Da permisos a cualquier origen)
app.use(express.json());
app.use("/apuestas", apuestaRoutes);

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
})();