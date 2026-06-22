class Apuesta {
    constructor(id, enunciado, opcion_a, opcion_b, estado, destacada) {
        this.id = id;
        this.enunciado = enunciado;
        this.opcion_a = opcion_a;
        this.opcion_b = opcion_b;
        this.estado = estado;
        this.destacada = destacada;
    }

    esAbierta() {
        return this.estado === "Abierta";
    }

    esDestacada() {
        return this.destacada === true;
    }
}

module.exports = Apuesta;