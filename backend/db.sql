-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion_alumnos;
USE gestion_alumnos;

-- -----------------------------
-- Tabla: usuarios
-- -----------------------------
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Usuario de prueba (contraseña "123456" hasheada con bcrypt)
INSERT INTO usuarios (nombre, email, password)
VALUES
('Administrador', 'admin@mail.com', '$2b$10$2zI8PPR.zbKkhr6b9ajYfO0X5z/s04bqTlpYIz/x3zKBZKh6fSpni');

-- -----------------------------
-- Tabla: alumnos
-- -----------------------------
DROP TABLE IF EXISTS alumnos;

CREATE TABLE alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL
);

-- Datos de prueba
INSERT INTO alumnos (nombre, apellido, dni)
VALUES
('Juan', 'Pérez', '40300200'),
('Lucía', 'Gómez', '42111111'),
('Pedro', 'Martínez', '38999111');

-- -----------------------------
-- Tabla: materias
-- -----------------------------
DROP TABLE IF EXISTS materias;

CREATE TABLE materias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  anio INT NOT NULL
);

-- Datos de prueba
INSERT INTO materias (nombre, codigo, anio)
VALUES
('Matemática I', 'MAT101', 1),
('Programación II', 'PROG201', 2),
('Bases de Datos', 'BD301', 3);

-- -----------------------------
-- Tabla: notas
-- -----------------------------
DROP TABLE IF EXISTS notas;

CREATE TABLE notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT NOT NULL,
  materia_id INT NOT NULL,
  nota1 DECIMAL(4,2),
  nota2 DECIMAL(4,2),
  nota3 DECIMAL(4,2),
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- Datos de prueba
INSERT INTO notas (alumno_id, materia_id, nota1, nota2, nota3)
VALUES
(1, 1, 8, 7, 9),
(2, 2, 6, 5, 7),
(3, 3, 9, 8, 10);
