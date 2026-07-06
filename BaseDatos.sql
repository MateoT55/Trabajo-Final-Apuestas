-- 1. TABLA PERSONAS (Usuarios del sistema)

CREATE TABLE Personas (

id_persona INT PRIMARY KEY IDENTITY(1,1),

apellido VARCHAR(50) NOT NULL,

nombre VARCHAR(50) NOT NULL,

dni VARCHAR(12) NOT NULL UNIQUE,

fecha_nacimiento DATE NOT NULL,

mail VARCHAR(100) NOT NULL UNIQUE,

telefono VARCHAR(20) NULL,

saldo DECIMAL(12, 2) NOT NULL DEFAULT 100000.00,

estado CHAR(3) NOT NULL DEFAULT 'ACT', -- 'ACT' (Activo), 'BAJ' (Baja)

CONSTRAINT CK_Persona_Estado CHECK (estado IN ('ACT', 'BAJ'))

);

-- 2. TABLA APUESTAS (Cabecera del evento)

CREATE TABLE Apuestas (

id_apuesta INT PRIMARY KEY IDENTITY(1,1),

evento VARCHAR(255) NOT NULL,

fecha_evento DATETIME NOT NULL,

fecha_cierre DATETIME NOT NULL, 

prioridad INT NOT NULL DEFAULT 0, 

comision DECIMAL(5, 2) NOT NULL DEFAULT 0.00, 

estado CHAR(3) NOT NULL DEFAULT 'ACT', 

CONSTRAINT CK_Apuesta_Estado CHECK (estado IN ('ACT', 'CER', 'FIN', 'BAJ'))

);


ALTER TABLE Apuestas
ADD destacada BIT DEFAULT 0;




-- 3. TABLA APUESTAS_DETALLE (Opciones disponibles para cada apuesta)

CREATE TABLE ApuestasDetalle (

id_opcion INT PRIMARY KEY IDENTITY(1,1),

id_apuesta INT NOT NULL,

num_ocurrencia INT NOT NULL, 

descripcion VARCHAR(255) NOT NULL,

ocurrio CHAR(1) NOT NULL DEFAULT 'N',

CONSTRAINT FK_Detalle_Apuesta FOREIGN KEY (id_apuesta) REFERENCES Apuestas(id_apuesta) ON DELETE CASCADE,

CONSTRAINT UQ_Apuesta_Ocurrencia UNIQUE (id_apuesta, num_ocurrencia), 

CONSTRAINT CK_Detalle_Ocurrio CHECK (ocurrio IN ('S', 'N'))

);

-- 4. TABLA APUESTAS_PERSONAS (Jugadas/Transacciones realizadas)

CREATE TABLE ApuestasPersonas (

id_jugada INT PRIMARY KEY IDENTITY(1,1),

id_apuesta INT NOT NULL,

num_ocurrencia INT NOT NULL, 

id_persona INT NOT NULL,

fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

importe DECIMAL(12, 2) NOT NULL,


CONSTRAINT FK_Jugadas_Detalle FOREIGN KEY (id_apuesta, num_ocurrencia)

REFERENCES ApuestasDetalle(id_apuesta, num_ocurrencia),

CONSTRAINT FK_Jugadas_Persona FOREIGN KEY (id_persona) REFERENCES Personas(id_persona),


CONSTRAINT CK_Jugada_Importe_Maximo CHECK (importe > 0 AND importe <= 100000.00)

);

GO


-- INSERCIÓN DE DATOS DEMOSTRATIVOS (PRECARGADOS)

INSERT INTO Personas (apellido, nombre, dni, fecha_nacimiento, mail, telefono, saldo, estado) VALUES

('Gómez', 'Carlos', '38444555', '1994-05-12', 'carlos.gomez@mail.com', '1122334455', '15000.00', 'ACT'), -- ID 1

('Rodríguez', 'Ana', '40111222', '1997-08-24', 'ana.rod@mail.com', '1199887766', '45000.00', 'ACT'), -- ID 2

('Pérez', 'Juan', '35333444', '1990-01-15', 'juan.perez@mail.com', '1155667788', '5000.00', 'ACT'), -- ID 3

('López', 'María', '42555666', '2000-11-02', 'maria.lopez@mail.com', '1144332211', '120000.00', 'ACT'), -- ID 4

('Silva', 'Diego', '39777888', '1996-03-30', 'diego.silva@mail.com', '1166778899', '85000.00', 'ACT'), -- ID 5

('Martínez', 'Laura', '37111999', '1992-07-19', 'laura.mar@mail.com', '1133445566', '90000.00', 'ACT'), -- ID 6

('Fernández', 'Lucas', '41222333', '1998-09-11', 'lucas.fer@mail.com', '1177665544', '35000.00', 'ACT'), -- ID 7

('Díaz', 'Sofía', '43444111', '2001-04-05', 'sofia.diaz@mail.com', '1188990011', '190000.00', 'ACT'), -- ID 8

('Peralta', 'Bautista', '45111222', '2003-10-22', 'bauti.p@mail.com', '1122112211', '60000.00', 'ACT'), -- ID 9

('Romero', 'Elena', '36888777', '1991-12-28', 'elena.rom@mail.com', '1133221100', '50000.00', 'ACT'), -- ID 10

('Álvarez', 'Nicolás', '34123456', '1989-02-14', 'nico.alvarez@mail.com', '1155443322', '75000.00', 'ACT'),-- ID 11

('Benítez', 'Florencia', '41987654', '1999-06-07', 'flor.b@mail.com', '1166554433', '130000.00', 'ACT'), -- ID 12

('Castro', 'Matías', '33555444', '1988-08-18', 'matias.c@mail.com', '1177889900', '20000.00', 'ACT'), -- ID 13

('Delgado', 'Valentina', '44111000', '2002-05-29', 'valen.d@mail.com', '1144556677', '95000.00', 'ACT'), -- ID 14

('Espinosa', 'Facundo', '39000111', '1995-01-25', 'facu.espi@mail.com', '1199009900', '10000.00', 'ACT'); -- ID 15

-- 2. INSERTS: Apuestas (10 Eventos Deportivos / Entretenimiento)

-- Nota la variedad de estados y prioridades para probar tus PUTs y filtros GET.

INSERT INTO Apuestas (evento, fecha_evento, fecha_cierre, prioridad, comision, estado) VALUES

('Final ATP Madrid (Alcaraz vs Sinner)', '2026-07-10 15:00:00', '2026-07-10 14:45:00', 5, 5.00, 'ACT'), -- ID 1

('Superclásico: River Plate vs Boca Juniors', '2026-07-15 17:00:00', '2026-07-15 16:50:00', 10, 8.00, 'ACT'),-- ID 2

('Final UEFA Champions League', '2026-07-30 16:00:00', '2026-07-30 15:45:00', 9, 7.50, 'ACT'), -- ID 3

('Fórmula 1: Gran Premio de Monza', '2026-08-12 09:00:00', '2026-08-12 08:45:00', 2, 4.00, 'ACT'), -- ID 4

('Finales NBA: Juego 7', '2026-07-18 21:00:00', '2026-07-18 20:45:00', 7, 6.00, 'ACT'), -- ID 5

('Boxeo: Tyson Fury vs Oleksandr Usyk II', '2026-09-05 23:00:00', '2026-09-05 22:30:00', 4, 10.00, 'ACT'),-- ID 6

('Valorant Champions Tour: Gran Final', '2026-07-28 18:00:00', '2026-07-28 17:45:00', 0, 5.00, 'ACT'), -- ID 7

('Eliminatorias: Argentina vs Brasil', '2026-08-04 20:00:00', '2026-08-04 19:45:00', 10, 8.50, 'ACT'), -- ID 8

('Final Roland Garros Masculino', '2026-07-07 10:00:00', '2026-07-07 09:45:00', 3, 5.00, 'CER'), -- ID 9 (Ya está cerrada a apuestas)

('Lanzamiento de GTA VI (¿Sufre retraso?)', '2026-12-15 00:00:00', '2026-11-30 23:59:00', 1, 3.00, 'ACT');-- ID 10

-- 3. INSERTS: ApuestasDetalle (2 Ocurrencias por cada apuesta: Sí / No o Competidor A / Competidor B)

INSERT INTO ApuestasDetalle (id_apuesta, num_ocurrencia, descripcion, ocurrio) VALUES

(1, 1, 'Gana Carlos Alcaraz', 'N'), (1, 2, 'Gana Jannik Sinner', 'N'),

(2, 1, 'Gana River Plate', 'N'), (2, 2, 'Gana Boca Juniors', 'N'),

(3, 1, 'Gana Real Madrid', 'N'), (3, 2, 'Gana Manchester City', 'N'),

(4, 1, 'Gana Max Verstappen', 'N'), (4, 2, 'Gana Lewis Hamilton', 'N'),

(5, 1, 'Gana Boston Celtics', 'N'), (5, 2, 'Gana Los Angeles Lakers', 'N'),

(6, 1, 'Gana Tyson Fury', 'N'), (6, 2, 'Gana Oleksandr Usyk', 'N'),

(7, 1, 'Gana KRÜ Esports', 'N'), (7, 2, 'Gana Sentinels', 'N'),

(8, 1, 'Lionel Messi anota un gol', 'N'), (8, 2, 'Lionel Messi NO anota goles', 'N'),

(9, 1, 'Gana Novak Djokovic', 'N'), (9, 2, 'Gana Alexander Zverev', 'N'),

(10, 1, 'Se retrasa a 2027', 'N'), (10, 2, 'Se lanza en la fecha pactada (2026)', 'N');

-- 4. INSERTS: ApuestasPersonas (Exactamente 5 personas distintas apostando por cada evento)

-- Comprobamos la regla: personas diferentes, montos variados sin exceder los 100.000 individuales.

-- El pozo total acumulado de una opción o apuesta puede superar los 100k con holgura.

-- Apuesta 1 (Total apostado: 180,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(1, 1, 1, 50000.00), (1, 1, 2, 30000.00), (1, 1, 3, 20000.00), -- Opcion 1 tiene 100k acumulados

(1, 2, 4, 60000.00), (1, 2, 5, 20000.00);

-- Apuesta 2 (Total apostado: 290,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(2, 1, 6, 80000.00), (2, 1, 7, 95000.00), -- Opcion 1 supera los 100k en conjunto (175k)

(2, 2, 8, 45000.00), (2, 2, 9, 30000.00), (2, 2, 10, 40000.00);

-- Apuesta 3 (Total apostado: 215,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(3, 1, 11, 70000.00), (3, 1, 12, 15000.00),

(3, 2, 13, 50000.00), (3, 2, 14, 30000.00), (3, 2, 15, 50000.00);

-- Apuesta 4 (Total apostado: 195,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(4, 1, 1, 90000.00), (4, 1, 3, 40000.00),

(4, 2, 5, 15000.00), (4, 2, 7, 20000.00), (4, 2, 9, 30000.00);

-- Apuesta 5 (Total apostado: 140,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(5, 1, 2, 25000.00), (5, 1, 4, 35000.00), (5, 1, 6, 10000.00),

(5, 2, 8, 50000.00), (5, 2, 10, 20000.00);

-- Apuesta 6 (Total apostado: 260,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(6, 1, 12, 85000.00), (6, 1, 13, 65000.00), -- Opcion 1 acumulado: 150k

(6, 2, 14, 40000.00), (6, 2, 15, 30000.00), (6, 2, 1, 40000.00);

-- Apuesta 7 (Total apostado: 110,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(7, 1, 3, 15000.00), (7, 1, 5, 20000.00),

(7, 2, 7, 40000.00), (7, 2, 11, 20000.00), (7, 2, 2, 15000.00);

-- Apuesta 8 (Total apostado: 380,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(8, 1, 4, 100000.00), (8, 1, 6, 90000.00), (8, 1, 8, 100000.00), -- Tres apuestas altas (Total opcion 1: 290k)

(8, 2, 10, 50000.00), (8, 2, 12, 40000.00);

-- Apuesta 9 (Total apostado: 155,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(9, 1, 14, 25000.00), (9, 1, 15, 35000.00),

(9, 2, 9, 40000.00), (9, 2, 13, 45000.00), (9, 2, 3, 10000.00);

-- Apuesta 10 (Total apostado: 220,000)

INSERT INTO ApuestasPersonas (id_apuesta, num_ocurrencia, id_persona, importe) VALUES

(10, 1, 5, 55000.00), (10, 1, 11, 40000.00),

(10, 2, 7, 30000.00), (10, 2, 1, 25000.00), (10, 2, 2, 70000.00);

GO





-- ==========================================================
-- ACTUALIZACIÓN DE FECHAS PARA SIMULAR EVENTOS VENCIDOS
-- (Fecha de referencia: 25/06/2026)
-- ==========================================================

-- 1. Modificar Apuesta ID 1: Final ATP Madrid
-- Cambiamos las fechas a Mayo de 2026 y el estado a 'FIN' (Finalizada)
UPDATE Apuestas
SET 
    fecha_evento = '2026-05-10 15:00:00',
    fecha_cierre = '2026-05-10 14:45:00',
    estado = 'FIN'
WHERE id_apuesta = 1;

-- 2. Modificar Apuesta ID 2: Superclásico River vs Boca
-- Cambiamos las fechas a principios de Junio de 2026 y el estado a 'FIN'
UPDATE Apuestas
SET 
    fecha_evento = '2026-06-01 17:00:00',
    fecha_cierre = '2026-06-01 16:50:00',
    estado = 'FIN'
WHERE id_apuesta = 2;

-- 3. Modificar Apuesta ID 3: Final UEFA Champions League
-- Cambiamos las fechas a finales de Mayo de 2026 y el estado a 'FIN'
UPDATE Apuestas
SET 
    fecha_evento = '2026-05-30 16:00:00',
    fecha_cierre = '2026-05-30 15:45:00',
    estado = 'FIN'
WHERE id_apuesta = 3;

-- 4. Modificar Apuesta ID 5: Finales NBA (Juego 7)
-- Cambiamos las fechas a mediados de Junio de 2026 y el estado a 'CER' (Cerrada)
-- (La dejamos como Cerrada para que tengas variedad de estados vencidos en tus pruebas)
UPDATE Apuestas
SET 
    fecha_evento = '2026-06-15 21:00:00',
    fecha_cierre = '2026-06-15 20:45:00',
    estado = 'CER'
WHERE id_apuesta = 5;

-- Nota: La apuesta ID 9 (Final Roland Garros) ya estaba originalmente configurada 
-- con el estado 'CER', pero su fecha era '2026-07-07'. Si quieres que sea consistente 
-- con el tiempo, también podrías pasar su fecha al pasado:
UPDATE Apuestas
SET 
    fecha_evento = '2026-06-07 10:00:00',
    fecha_cierre = '2026-06-07 09:45:00'
WHERE id_apuesta = 9;





-- ==========================================================
-- ACTUALIZACIÓN DE COMISIONES (10% PARA TODAS LAS APUESTAS)
-- ==========================================================

UPDATE Apuestas
SET comision = 10.00;