# Avisos de Empleo - Backend

Backend para aplicación de avisos de empleo desarrollado con Node.js, Express y PostgreSQL.

## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos (Supabase)
- **Postgres.js** - Cliente de PostgreSQL
- **dotenv** - Variables de entorno
- **CORS** - Configuración de cross-origin

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a BD
│   ├── controllers/
│   │   ├── avisoController.js   # Controlador de avisos
│   │   └── empresaController.js # Controlador de empresas
│   ├── middlewares/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validation.js        # Validación de datos
│   ├── models/
│   │   ├── avisoModel.js        # Modelo de avisos
│   │   └── empresaModel.js      # Modelo de empresas
│   ├── routes/
│   │   ├── avisoRoutes.js       # Rutas de avisos
│   │   └── empresaRoutes.js     # Rutas de empresas
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
NODE_ENV=development
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## API Endpoints

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

## Manejo de Errores

La API utiliza códigos de estado HTTP estándar:

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Solicitud incorrecta
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

Las respuestas de error tienen el siguiente formato:

```json
{
  "error": "Mensaje de error descriptivo"
}
```

## Desarrollo

Para desarrollo local con recarga automática:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Licencia

ISC