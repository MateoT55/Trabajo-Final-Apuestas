// ==========================================
// URL API
// ==========================================

const URL_API = "http://localhost:3000/api/apuestas";

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const contenedorApuestas =
    document.getElementById("contenedorApuestas");

const mensajeError =
    document.getElementById("mensajeError");

// ==========================================
// INICIO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    cargarApuestas
);

// ==========================================
// CARGAR APUESTAS
// ==========================================

async function cargarApuestas() {

    try {

        mensajeError.classList.add(
            "mensaje-error--oculto"
        );

        const respuesta =
            await fetch(URL_API);

        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener apuestas"
            );

        }

        const apuestas =
            await respuesta.json();

        contenedorApuestas.innerHTML = "";

        apuestas.forEach(apuesta => {

            const card =
                crearCard(apuesta);

            contenedorApuestas.appendChild(card);

        });

    } catch (error) {

        console.log(error);

        mensajeError.classList.remove(
            "mensaje-error--oculto"
        );

    }

}

// ==========================================
// CREAR CARD
// ==========================================

function crearCard(apuesta) {

    // Card principal

    const card =
        document.createElement("article");

    card.classList.add("card");

    if (apuesta.destacada) {

        card.classList.add(
            "card--destacada"
        );

    } else if (apuesta.estado === "CER") {

        card.classList.add(
            "card--cerrada"
        );
    }
    // ======================================
    // TITULO
    // ======================================

    const titulo =
        document.createElement("h2");

    titulo.classList.add("card__titulo");

    titulo.textContent =
        apuesta.evento;

    // ======================================
    // ESTADO
    // ======================================

    const estado =
        document.createElement("p");

    estado.classList.add(
        "card__estado"
    );

    if (apuesta.estado === "ACT") {

        estado.classList.add(
            "card__estado--abierta"
        );

        estado.textContent =
            "Estado: Abierta";

    } else {

        estado.classList.add(
            "card__estado--cerrada"
        );

        estado.textContent =
            "Estado: Cerrada";

    }

    // ======================================
    // FECHA EVENTO
    // ======================================

    const fechaEvento =
        document.createElement("p");

    fechaEvento.classList.add(
        "card__info"
    );

    fechaEvento.textContent =
        "Fecha Evento: " +
        formatearFecha(
            apuesta.fecha_evento
        );

    // ======================================
    // FECHA CIERRE
    // ======================================

    const fechaCierre =
        document.createElement("p");

    fechaCierre.classList.add(
        "card__info"
    );

    fechaCierre.textContent =
        "Fecha Cierre: " +
        formatearFecha(
            apuesta.fecha_cierre
        );

    // ======================================
    // OPCION A
    // ======================================

    const opcionA =
        document.createElement("div");

    opcionA.classList.add(
        "card__opcion"
    );

    const opcionATexto =
        document.createElement("p");

    opcionATexto.textContent =
        apuesta.opcionA;

    const cuotaA =
        document.createElement("p");

    cuotaA.textContent =
        "Cuota: " +
        apuesta.cuotaA;

    opcionA.appendChild(
        opcionATexto
    );

    opcionA.appendChild(
        cuotaA
    );

    // ======================================
    // OPCION B
    // ======================================

    const opcionB =
        document.createElement("div");

    opcionB.classList.add(
        "card__opcion"
    );

    const opcionBTexto =
        document.createElement("p");

    opcionBTexto.textContent =
        apuesta.opcionB;

    const cuotaB =
        document.createElement("p");

    cuotaB.textContent =
        "Cuota: " +
        apuesta.cuotaB;

    opcionB.appendChild(
        opcionBTexto
    );

    opcionB.appendChild(
        cuotaB
    );

    // ======================================
    // BOTONES
    // ======================================

    const acciones =
        document.createElement("div");

    acciones.classList.add(
        "card__acciones"
    );

    // --------------------------------------
    // ABRIR / CERRAR
    // --------------------------------------

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
        () => cambiarEstado(
            apuesta.id_apuesta
        )
    );

    // --------------------------------------
    // DESTACAR
    // --------------------------------------

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
            () => destacarApuesta(
                apuesta.id_apuesta
            )
        );

    }


    // --------------------------------------
    // DETALLE
    // --------------------------------------

    const botonDetalle =
        document.createElement("button");

    botonDetalle.classList.add(
        "boton",
        "boton--detalle"
    );

    botonDetalle.textContent =
        "Ver Detalle";

    botonDetalle.addEventListener(
        "click",
        () => {

            window.location.href =
                `detalle.html?id=${apuesta.id_apuesta}`;

        }
    );

    // --------------------------------------
    // APOSTAR
    // --------------------------------------

    if (apuesta.estado !== "CER") {

        var botonApostar =
            document.createElement("button");

        botonApostar.classList.add(
            "boton",
            "boton--apostar"
        );

        botonApostar.textContent =
            "Apostar";

        botonApostar.disabled = true;

    }




    // ======================================
    // ARMADO CARD
    // ======================================

    acciones.appendChild(
        botonEstado
    );

    if (botonDestacar) {
        acciones.appendChild(
            botonDestacar
        );
    }

    acciones.appendChild(
        botonDetalle
    );

    if (botonApostar) {
        acciones.appendChild(
            botonApostar
        );
    }

    card.appendChild(titulo);

    card.appendChild(estado);

    card.appendChild(fechaEvento);

    card.appendChild(fechaCierre);

    card.appendChild(opcionA);

    card.appendChild(opcionB);

    card.appendChild(acciones);

    return card;

}


async function cambiarEstado(id) {

    try {

        const respuesta =
            await fetch(
                `${URL_API}/${id}/estado`,
                {
                    method: "PUT"
                }
            );

        if (!respuesta.ok) {

            throw new Error(
                "Error al cambiar estado"
            );

        }

        cargarApuestas();

    } catch (error) {

        console.log(error);

        alert(
            "No se pudo cambiar el estado"
        );

    }

}

// ==========================================
// DESTACAR APUESTA
// ==========================================

async function destacarApuesta(id) {

    try {

        const respuesta =
            await fetch(
                `${URL_API}/${id}/destacar`,
                {
                    method: "PUT"
                }
            );

        if (!respuesta.ok) {

            throw new Error(
                "Error al destacar"
            );

        }

        cargarApuestas();

    } catch (error) {

        console.log(error);

        alert(
            "No se pudo destacar"
        );

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