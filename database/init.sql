-- Crear base de datos
CREATE DATABASE avisos_empleos;

-- Conectar a la base de datos
\c avisos_empleos;

-- Tabla de empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL UNIQUE,
  descripcion TEXT,
  website VARCHAR(500),
  email VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de avisos
CREATE TABLE avisos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  ubicacion VARCHAR(100) NOT NULL,
  tipo_contrato VARCHAR(50) NOT NULL CHECK (tipo_contrato IN ('full-time', 'part-time', 'freelance', 'contrato', 'pasantia')),
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  fecha_publicacion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_avisos_ubicacion ON avisos(ubicacion);
CREATE INDEX idx_avisos_tipo_contrato ON avisos(tipo_contrato);
CREATE INDEX idx_avisos_empresa_id ON avisos(empresa_id);
CREATE INDEX idx_avisos_fecha_publicacion ON avisos(fecha_publicacion DESC);

-- Datos de ejemplo
INSERT INTO empresas (nombre, descripcion, website, email) VALUES
  ('TechCorp SA', 'Empresa de tecnología líder en desarrollo de software', 'https://techcorp.com', 'rrhh@techcorp.com'),
  ('InnovaIT', 'Consultora de IT especializada en soluciones cloud', 'https://innovait.com', 'contacto@innovait.com'),
  ('StartupHub', 'Startup de desarrollo de aplicaciones móviles', 'https://startuphub.com', 'jobs@startuphub.com');

INSERT INTO avisos (titulo, descripcion, ubicacion, tipo_contrato, empresa_id) VALUES
  ('Desarrollador Full Stack', 'Buscamos desarrollador con experiencia en React y Node.js para proyecto innovador', 'Buenos Aires', 'full-time', 1),
  ('Analista de Datos', 'Se requiere analista con conocimientos en Python y SQL para análisis de datos masivos', 'Remoto', 'full-time', 2),
  ('Diseñador UX/UI', 'Diseñador creativo para trabajar en aplicaciones móviles', 'Córdoba', 'part-time', 3),
  ('DevOps Engineer', 'Profesional con experiencia en AWS, Docker y Kubernetes', 'Buenos Aires', 'full-time', 1),
  ('Developer Junior', 'Oportunidad para desarrolladores junior con ganas de aprender', 'Remoto', 'pasantia', 2);