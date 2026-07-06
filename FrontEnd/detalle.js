// ==========================================
// PARAMETROS URL
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const idApuesta =
    parametros.get("id");

// ==========================================
// URL API
// ==========================================

const URL_API =
    "http://localhost:3000/api/apuestas";

// ==========================================
// ELEMENTOS
// ==========================================

const detalleApuesta =
    document.getElementById(
        "detalleApuesta"
    );

const tablaApostadores =
    document.getElementById(
        "tablaApostadores"
    );

// ==========================================
// INICIO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarDetalle();
        cargarApostadores();

    }
);

// ==========================================
// CARGAR DETALLE
// ==========================================

async function cargarDetalle() {

    try {

        const respuesta =
            await fetch(
                `${URL_API}/${idApuesta}`
            );

        const apuesta =
            await respuesta.json();

        mostrarDetalle(apuesta);

    } catch (error) {

        console.log(error);

        alert(
            "Error al cargar detalle"
        );

    }

}

// ==========================================
// MOSTRAR DETALLE
// ==========================================

function mostrarDetalle(apuesta) {

    const titulo =
        document.createElement("h2");

    titulo.classList.add(
        "detalle__titulo"
    );

    titulo.textContent =
        apuesta.evento;

    const fechaEvento =
        document.createElement("p");

    fechaEvento.classList.add(
        "detalle__info"
    );

    fechaEvento.textContent =
        "Fecha Evento: " +
        formatearFecha(
            apuesta.fecha_evento
        );

    const fechaCierre =
        document.createElement("p");

    fechaCierre.classList.add(
        "detalle__info"
    );

    fechaCierre.textContent =
        "Fecha Cierre: " +
        formatearFecha(
            apuesta.fecha_cierre
        );

    const estado =
        document.createElement("p");

    estado.classList.add(
        "detalle__info"
    );

    estado.textContent =
        "Estado: " +
        (apuesta.estado === "ACT"
            ? "Abierta"
            : "Cerrada");

    // ======================================
    // OPCION A
    // ======================================

    const opcionA =
        document.createElement("div");

    opcionA.classList.add(
        "detalle__opcion"
    );

    opcionA.textContent =
        `${apuesta.opcionA}
        - $${apuesta.montoOpcionA}
        - Cuota ${apuesta.cuotaA}`;

    // ======================================
    // OPCION B
    // ======================================

    const opcionB =
        document.createElement("div");

    opcionB.classList.add(
        "detalle__opcion"
    );

    opcionB.textContent =
        `${apuesta.opcionB}
        - $${apuesta.montoOpcionB}
        - Cuota ${apuesta.cuotaB}`;

    // ======================================
    // BOTONES
    // ======================================

    const acciones =
        document.createElement("div");

    acciones.classList.add(
        "detalle__acciones"
    );

    const botonEstado =
        document.createElement("button");

    botonEstado.classList.add(
        "boton"
    );

    if (apuesta.estado === "ACT") {

        botonEstado.classList.add(
            "boton--cerrar"
        );

        botonEstado.textContent =
            "Cerrar";

    } else {

        botonEstado.classList.add(
            "boton--abrir"
        );

        botonEstado.textContent =
            "Abrir";

    }

    botonEstado.addEventListener(
        "click",
        () => cambiarEstado()
    );

    if (apuesta.estado !== "CER") {

        var botonDestacar =
            document.createElement("button");

        botonDestacar.classList.add(
            "boton",
            "boton--destacar"
        );

        botonDestacar.textContent =
            "Destacar";

        botonDestacar.addEventListener(
            "click",
            () => destacarApuesta()
        );

    }

    const botonVolver =
        document.createElement("button");

    botonVolver.classList.add(
        "boton",
        "boton--volver"
    );

    botonVolver.textContent =
        "Volver";

    botonVolver.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

    acciones.appendChild(
        botonEstado
    );

    if (botonDestacar) {
        acciones.appendChild(
            botonDestacar
        );
    }

    acciones.appendChild(
        botonVolver
    );

    detalleApuesta.appendChild(
        titulo
    );

    detalleApuesta.appendChild(
        fechaEvento
    );

    detalleApuesta.appendChild(
        fechaCierre
    );

    detalleApuesta.appendChild(
        estado
    );

    detalleApuesta.appendChild(
        opcionA
    );

    detalleApuesta.appendChild(
        opcionB
    );

    detalleApuesta.appendChild(
        acciones
    );

}

// ==========================================
// CARGAR APOSTADORES
// ==========================================

async function cargarApostadores() {

    try {

        const respuesta =
            await fetch(
                `${URL_API}/${idApuesta}/apostadores`
            );

        const apostadores =
            await respuesta.json();

        apostadores.forEach(
            apostador => {

                const fila =
                    document.createElement("tr");

                const tdNombre =
                    document.createElement("td");

                tdNombre.textContent =
                    apostador.nombre +
                    " " +
                    apostador.apellido;

                const tdOpcion =
                    document.createElement("td");

                tdOpcion.textContent =
                    apostador.opcion;

                const tdImporte =
                    document.createElement("td");

                tdImporte.textContent =
                    "$" +
                    apostador.importe;

                fila.appendChild(
                    tdNombre
                );

                fila.appendChild(
                    tdOpcion
                );

                fila.appendChild(
                    tdImporte
                );

                tablaApostadores.appendChild(
                    fila
                );

            }
        );

    } catch (error) {

        console.log(error);

    }

}

// ==========================================
// CAMBIAR ESTADO
// ==========================================

async function cambiarEstado() {

    try {

        await fetch(
            `${URL_API}/${idApuesta}/estado`,
            {
                method: "PUT"
            }
        );

        location.reload();

    } catch (error) {

        console.log(error);

    }

}

// ==========================================
// DESTACAR APUESTA
// ==========================================

async function destacarApuesta() {

    try {

        await fetch(
            `${URL_API}/${idApuesta}/destacar`,
            {
                method: "PUT"
            }
        );

        alert(
            "Apuesta destacada"
        );

    } catch (error) {

        console.log(error);

    }

}

// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    return new Date(fecha)
        .toLocaleString(
            "es-AR"
        );

}