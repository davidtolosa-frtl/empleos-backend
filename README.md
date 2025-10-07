# Avisos de Empleo - Backend

Backend para aplicación de avisos de empleo desarrollado con Node.js, Express y PostgreSQL.

## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos (Supabase)
- **Postgres.js** - Cliente de PostgreSQL
- **JWT (jsonwebtoken)** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Variables de entorno
- **CORS** - Configuración de cross-origin

## Estructura del Proyecto

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a BD
│   ├── controllers/
│   │   ├── avisoController.js   # Controlador de avisos
│   │   ├── empresaController.js # Controlador de empresas
│   │   └── authController.js    # Controlador de autenticación
│   ├── middlewares/
│   │   ├── auth.js              # Middleware de autenticación JWT
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validation.js        # Validación de datos
│   ├── models/
│   │   ├── avisoModel.js        # Modelo de avisos
│   │   ├── empresaModel.js      # Modelo de empresas
│   │   └── userModel.js         # Modelo de usuarios
│   ├── routes/
│   │   ├── avisoRoutes.js       # Rutas de avisos
│   │   ├── empresaRoutes.js     # Rutas de empresas
│   │   └── authRoutes.js        # Rutas de autenticación
│   └── index.js                 # Punto de entrada de la aplicación
├── .env.example                 # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## Requisitos Previos

- Node.js (versión 16 o superior)
- PostgreSQL (o cuenta en Supabase)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd avisos-empleos/backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus credenciales:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiarla_en_produccion
JWT_EXPIRATION=24h
NODE_ENV=development
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT

### Avisos

- `GET /api/avisos` - Obtener todos los avisos
- `GET /api/avisos/:id` - Obtener un aviso por ID
- `POST /api/avisos` - Crear un nuevo aviso
- `PUT /api/avisos/:id` - Actualizar un aviso
- `DELETE /api/avisos/:id` - Eliminar un aviso

### Empresas

- `GET /api/empresas` - Obtener todas las empresas
- `GET /api/empresas/:id` - Obtener una empresa por ID
- `POST /api/empresas` - Crear una nueva empresa
- `PUT /api/empresas/:id` - Actualizar una empresa
- `DELETE /api/empresas/:id` - Eliminar una empresa

## Ejemplos de Uso

### Registro de usuario

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "created_at": "2025-10-07T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login de usuario

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "created_at": "2025-10-07T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Crear un aviso

```bash
POST /api/avisos
Content-Type: application/json

{
  "titulo": "Desarrollador Full Stack",
  "descripcion": "Buscamos desarrollador con experiencia en Node.js y React",
  "empresa_id": 1,
  "ubicacion": "Buenos Aires",
  "salario": 100000,
  "tipo_empleo": "full-time"
}
```

### Crear una empresa

```bash
POST /api/empresas
Content-Type: application/json

{
  "nombre": "Tech Solutions",
  "descripcion": "Empresa de desarrollo de software",
  "email": "contacto@techsolutions.com",
  "telefono": "+54 11 1234-5678",
  "direccion": "Av. Corrientes 1234, CABA"
}
```

## Autenticación con JWT

Para acceder a rutas protegidas, se debe incluir el token JWT en el header de autorización:

```bash
Authorization: Bearer <token>
```

El token se obtiene al registrarse o iniciar sesión y tiene una duración configurable (por defecto 24 horas).

## Manejo de Errores

La API utiliza códigos de estado HTTP estándar:

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Solicitud incorrecta
- `401` - No autorizado (token faltante o inválido)
- `403` - Prohibido (token expirado)
- `404` - Recurso no encontrado
- `409` - Conflicto (por ejemplo, usuario ya existe)
- `500` - Error interno del servidor

Las respuestas de error tienen el siguiente formato:

```json
{
  "success": false,
  "message": "Mensaje de error descriptivo"
}
```

## Desarrollo

Para desarrollo local con recarga automática:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Seguridad

- Las contraseñas se almacenan encriptadas usando bcryptjs con 10 salt rounds
- Se utiliza JWT para autenticación stateless
- La clave secreta JWT debe configurarse en las variables de entorno
- En producción, asegúrate de usar HTTPS y claves secretas robustas

## Licencia

ISC
