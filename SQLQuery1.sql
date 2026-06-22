-- 1. Tabla Usuarios (con columna saldo agregada)
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL, -- 'Admin' o 'Usuario'
    saldo DECIMAL(12, 2) DEFAULT 100000.00 -- Billetera virtual inicial
);

-- 2. Tabla Apuestas
CREATE TABLE Apuestas (
    id_apuesta INT PRIMARY KEY IDENTITY(1,1),
    enunciado VARCHAR(255) NOT NULL,
    opcion_a VARCHAR(100) NOT NULL,
    opcion_b VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Abierta' -- 'Abierta' o 'Cerrada'
);
ALTER TABLE Apuestas
ADD destacada BIT DEFAULT 0;



-- 3. Tabla Jugadas (con columna fecha_jugada agregada)
CREATE TABLE Jugadas (
    id_jugada INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL,
    id_apuesta INT NOT NULL,
    eleccion CHAR(1) NOT NULL CHECK (eleccion IN ('A', 'B')),
    monto DECIMAL(12, 2) NOT NULL,
    fecha_jugada DATETIME DEFAULT CURRENT_TIMESTAMP, -- Registro temporal automático
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_apuesta) REFERENCES Apuestas(id_apuesta)
);

-- Insertar 10 Usuarios (Los administradores inician con saldo, pero su foco es gestionar)
INSERT INTO Usuarios (nombre, rol, saldo) VALUES
('Carlos Gómez', 'Admin', 0.00),
('Ana Rodríguez', 'Usuario', 150000.00),
('Juan Pérez', 'Usuario', 80000.00),
('María López', 'Usuario', 200000.00),
('Diego Silva', 'Usuario', 45000.00),
('Laura Martínez', 'Usuario', 120000.00),
('Lucas Fernández', 'Usuario', 95000.00),
('Sofía Díaz', 'Usuario', 110000.00),
('Bautista Peralta', 'Usuario', 30000.00),
('Elena Romero', 'Admin', 0.00);

-- Insertar 10 Apuestas
INSERT INTO Apuestas (enunciado, opcion_a, opcion_b, estado) VALUES
('Final ATP Madrid', 'Gana Jannik Sinner', 'Gana Carlos Alcaraz', 'Cerrada'),
('Superclásico Argentino', 'Gana River Plate', 'Gana Boca Juniors', 'Abierta'),
('Final Champions League', 'Gana Real Madrid', 'Gana Manchester City', 'Abierta'),
('Gran Premio de Fórmula 1', 'Gana Max Verstappen', 'Gana Lewis Hamilton', 'Abierta'),
('Final NBA', 'Gana Boston Celtics', 'Gana Los Angeles Lakers', 'Abierta'),
('Pelea de Boxeo Peso Pesado', 'Gana Tyson Fury', 'Gana Oleksandr Usyk', 'Abierta'),
('Torneo de Esports', 'Gana KRÜ Esports', 'Gana Sentinels', 'Abierta'),
('Partido Selección Argentina', 'Messi hace un gol', 'Messi no hace goles', 'Abierta'),
('Final Roland Garros', 'Gana Novak Djokovic', 'Gana Alexander Zverev', 'Abierta'),
('Estreno de Videojuego del Año', 'Se retrasa el lanzamiento', 'Se lanza en la fecha pactada', 'Cerrada');

-- Simulación de Jugadas iniciales
INSERT INTO Jugadas (id_usuario, id_apuesta, eleccion, monto) VALUES
(2, 1, 'A', 15000.00), (3, 1, 'A', 25000.00), (4, 1, 'A', 20000.00),
(5, 1, 'B', 10000.00), (6, 1, 'B', 30000.00), (7, 1, 'B', 10000.00),
(2, 2, 'A', 50000.00), (4, 2, 'A', 75000.00), (3, 2, 'B', 15000.00),
(3, 3, 'A', 40000.00), (6, 3, 'B', 60000.00), (2, 4, 'A', 80000.00),
(7, 5, 'A', 55000.00), (2, 5, 'B', 45000.00), (4, 6, 'A', 30000.00),
(8, 6, 'B', 90000.00), (2, 7, 'A', 15000.00), (9, 7, 'B', 50000.00),
(3, 8, 'A', 90000.00), (4, 8, 'A', 85000.00), (2, 9, 'A', 40000.00),
(3, 9, 'B', 30000.00), (4, 10, 'A', 70000.00), (7, 10, 'B', 80000.00);