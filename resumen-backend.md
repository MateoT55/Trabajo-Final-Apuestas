# Resumen del Backend — Proyecto Apuestas (MVC)

---

## 1. Config — `Config/db.js`

**¿Qué hace?** Establece la conexión con SQL Server usando el paquete `mssql/msnodesqlv8`.

```js
const stringDeConexion = "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=SistemasApuesta;Trusted_Connection=yes;";
```

- Usa **autenticación de Windows** (`Trusted_Connection=yes`).
- La función `getConnection()` devuelve un `pool` de conexiones.
- Exporta `{ getConnection, sql }` para que Models lo use.
- Si falla la conexión, atrapa el error y lo muestra en consola.

**Para exponer:** Es la capa de infraestructura, la que permite que el backend hable con SQL Server. El driver es nativo de Windows (`msnodesqlv8`) y la conexión se hace con credenciales del sistema operativo.

---

## 2. Models — `Models/Apuesta.js`

**¿Qué hace?** Contiene TODA la lógica de negocio y acceso a la base de datos. Es la capa que ejecuta las consultas SQL. Exporta **5 funciones**:

### `obtenerTodas()`
- Hace un `SELECT` con `INNER JOIN` a `ApuestasDetalle` (para traer las 2 opciones A y B) y `LEFT JOIN` a `ApuestasPersonas` (para traer los montos apostados).
- **Ordena** los resultados por prioridad:
  1. Apuestas destacadas primero
  2. Apuestas abiertas no vencidas
  3. Apuestas abiertas vencidas
  4. Apuestas cerradas/finalizadas al final
- **Procesa los datos en JavaScript**: recorre el `recordset`, agrupa por `id_apuesta` y suma los montos de cada opción.
- **Calcula cuotas**:
  - `pozoNeto = totalApostado - (totalApostado * comision / 100)`
  - `cuota = pozoNeto / montoApostadoEnEsaOpcion`
  - A menor monto apostado en una opción, mayor es la cuota (más riesgo, más ganancia).

### `obtenerPorId(id)`
- Misma lógica que `obtenerTodas()` pero filtrada por `WHERE id_apuesta = @id`.
- Usa `input("id", sql.Int, id)` para **parametrizar la consulta** (seguridad contra SQL injection).
- Si no encuentra el registro, devuelve `null`.
- Calcula cuotas de la misma forma.

### `cambiarEstado(id)`
- Consulta el estado actual de la apuesta.
- Si es `"ACT"` (Activa) lo cambia a `"CER"` (Cerrada), y viceversa (toggle).
- Devuelve el nuevo estado.

### `destacarApuesta(id)`
- Hace un toggle del campo `destacada` (bit): si es 1 pasa a 0, si es 0 pasa a 1.
- Usa un `CASE WHEN` dentro del `UPDATE`.

### `obtenerApostadores(id)`
- Trae todas las personas que apostaron en una apuesta específica.
- Hace `INNER JOIN` entre `ApuestasPersonas`, `Personas` y `ApuestasDetalle`.
- Devuelve: `nombre`, `apellido`, `importe`, `opcion` (descripción de la opción que eligieron).

**Para exponer:** Este es el archivo más importante. Es la capa **Modelo** del patrón MVC. Cada función representa una operación de negocio. Usan consultas parametrizadas (`@id`) para prevenir SQL injection y el cálculo de cuotas se hace del lado del servidor con lógica JavaScript.

---

## 3. Controllers — `Controllers/ApuestaController.js`

**¿Qué hace?** Es el intermediario entre las rutas y los modelos. Recibe las peticiones HTTP (`req`/`res`), llama al modelo correspondiente y devuelve la respuesta JSON. Tiene **5 funciones**, una por cada operación:

| Función | Método HTTP | Ruta | Qué hace |
|---|---|---|---|
| `obtenerApuestas` | GET | `/api/apuestas` | Llama a `Apuesta.obtenerTodas()` y devuelve JSON con status 200 |
| `obtenerApuestaPorId` | GET | `/api/apuestas/:id` | Parsea `req.params.id` a entero, llama al modelo, si es null responde 404, si no 200 |
| `obtenerApostadores` | GET | `/api/apuestas/:id/apostadores` | Parsea el ID, llama al modelo, devuelve 200 con el listado |
| `cambiarEstado` | PUT | `/api/apuestas/:id/estado` | Llama al modelo, devuelve 200 con `{ mensaje, estado }` |
| `destacarApuesta` | PUT | `/api/apuestas/:id/destacar` | Llama al modelo, devuelve 200 con mensaje de confirmación |

**Todas** tienen `try/catch` que atrapa errores y responde con status **500** y un mensaje genérico.

**Para exponer:** El Controller **NO tiene lógica de negocio**, solo orquesta. Recibe la request, extrae parámetros, llama al Model, y arma la respuesta HTTP. Es la capa más delgada del patrón MVC.

---

## 4. Routes — `Routes/ApuestaRoutes.js`

**¿Qué hace?** Define los endpoints de la API usando `express.Router()` y conecta cada ruta con su controller.

```js
router.get("/", apuestaController.obtenerApuestas);
router.get("/:id", apuestaController.obtenerApuestaPorId);
router.get("/:id/apostadores", apuestaController.obtenerApostadores);
router.put("/:id/estado", apuestaController.cambiarEstado);
router.put("/:id/destacar", apuestaController.destacarApuesta);
```

**5 rutas en total:**
- 3 `GET` (traer todas, traer una, traer apostadores)
- 2 `PUT` (cambiar estado, destacar)

**Para exponer:** Este archivo es el "mapa" de la API. Cada ruta es un endpoint. No hay rutas `POST` (crear) ni `DELETE` (eliminar) — la API solo permite consultar y modificar estados. Las rutas se definen bajo el prefijo `/api/apuestas` (eso se configura en App.js).

---

## 5. App.js — `App.js`

**¿Qué hace?** Es el punto de entrada. Configura y levanta el servidor Express.

```js
const express = require("express");
const cors = require("cors");
const apuestaRoutes = require("./Routes/ApuestaRoutes");

const app = express();
app.use(cors());              // Permite peticiones desde cualquier origen (frontend)
app.use(express.json());      // Parsea el body de las requests como JSON
app.use(express.static("FrontEnd")); // Sirve archivos estáticos del frontend

app.use("/api/apuestas", apuestaRoutes); // Monta las rutas bajo el prefijo /api/apuestas

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en puerto ${PORT}`);
});
```

**Middleware que usa:**
1. **`cors()`** — habilita CORS para que el frontend (en otro puerto/origen) pueda hacer peticiones.
2. **`express.json()`** — parsea automáticamente el JSON del body de las requests.
3. **`express.static("FrontEnd")`** — sirve los archivos HTML/CSS/JS del frontend directamente.

**Servidor:** Corre en el puerto **3000**.

**Para exponer:** Este archivo es el "corazón" que une todo. El flujo completo es:
1. El frontend (o Postman) hace una petición a `http://localhost:3000/api/apuestas`
2. Express recibe la petición
3. Pasa por los middleware (CORS, JSON parser)
4. Express enruta a `/api/apuestas` → usa `ApuestaRoutes`
5. La ruta llama al `Controller`
6. El Controller llama al `Model`
7. El Model ejecuta la consulta SQL
8. La respuesta sube de vuelta: Model → Controller → Routes → Cliente (JSON)

---

## Bonus: Base de datos (`BaseDatos.sql`)

### Tablas del modelo de datos

| Tabla | Descripción |
|---|---|
| **Personas** | Usuarios del sistema (nombre, dni, mail, saldo, estado) |
| **Apuestas** | Cabecera de cada evento deportivo (evento, fechas, comisión, estado) |
| **ApuestasDetalle** | Las 2 opciones de cada apuesta (ej: "Gana River" / "Gana Boca") |
| **ApuestasPersonas** | Transacciones: quién apostó, a qué opción, cuánto dinero |

### Estados posibles de una apuesta

| Código | Significado |
|---|---|
| `ACT` | Activa (abierta a apuestas) |
| `CER` | Cerrada (ya no se aceptan apuestas) |
| `FIN` | Finalizada (el evento ya ocurrió) |
| `BAJ` | Baja (desactivada) |

### Relaciones entre tablas (Diagrama)

```
Personas (1) ──────< ApuestasPersonas >────── (1) Apuestas
                                    │
                                    └────────── (1) ApuestasDetalle
```

- Una `Persona` puede apostar en muchas `Apuestas` (a través de `ApuestasPersonas`).
- Una `Apuesta` puede tener muchas `Personas` apostando.
- Una `Apuesta` tiene exactamente 2 registros en `ApuestasDetalle` (opción A y opción B).
