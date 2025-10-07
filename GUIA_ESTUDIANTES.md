# Guía del Proyecto para Estudiantes - Backend Avisos de Empleo

## 📚 Introducción

Este documento explica el proyecto de backend para una aplicación de avisos de empleo, diseñado para ayudarte a comprender cómo funciona una API REST moderna con Node.js, Express y PostgreSQL.

## 🎯 ¿Qué es este proyecto?

Es un backend (servidor) que permite:
- Registrar usuarios y autenticarlos
- Publicar avisos de empleo
- Gestionar información de empresas
- Todo esto mediante una API REST que puede ser consumida por un frontend

## 🏗️ Arquitectura del Proyecto

### Patrón MVC (Model-View-Controller)

Este proyecto usa una arquitectura MVC adaptada para APIs:

```
Cliente (Frontend)
    ↓
Rutas (Routes) → Define qué URL responde a qué acción
    ↓
Controladores (Controllers) → Lógica de negocio
    ↓
Modelos (Models) → Interacción con la base de datos
    ↓
Base de Datos (PostgreSQL)
```

### Estructura de Carpetas Explicada

```
src/
├── config/          → Configuraciones (conexión a BD, etc.)
├── controllers/     → Lógica de negocio (qué hacer con cada petición)
├── middlewares/     → Funciones que se ejecutan antes de los controladores
├── models/          → Interacción con la base de datos
├── routes/          → Definición de endpoints (URLs)
└── index.js         → Punto de entrada (arranca el servidor)
```

## 📖 Conceptos Clave

### 1. API REST

**REST** = Representational State Transfer

Es un estilo de arquitectura para diseñar APIs. Usa los métodos HTTP:
- **GET**: Obtener datos
- **POST**: Crear datos
- **PUT**: Actualizar datos
- **DELETE**: Eliminar datos

**Ejemplo:**
```
GET /api/avisos        → Obtener todos los avisos
GET /api/avisos/1      → Obtener el aviso con ID 1
POST /api/avisos       → Crear un nuevo aviso
PUT /api/avisos/1      → Actualizar el aviso con ID 1
DELETE /api/avisos/1   → Eliminar el aviso con ID 1
```

### 2. Middleware

Un middleware es una función que se ejecuta **entre** la petición y la respuesta.

```javascript
// Ejemplo simple de middleware
const middleware = (req, res, next) => {
  console.log('Petición recibida');
  next(); // Pasar al siguiente middleware o controlador
};
```

**Usos comunes:**
- Verificar autenticación (¿el usuario tiene token válido?)
- Validar datos (¿el email tiene formato correcto?)
- Logging (registrar peticiones)
- Manejo de errores

### 3. JWT (JSON Web Token)

Es un sistema de autenticación **sin estado** (stateless).

**¿Cómo funciona?**

1. Usuario se registra/inicia sesión
2. Servidor genera un token JWT firmado
3. Cliente guarda el token
4. Cliente envía el token en cada petición
5. Servidor verifica el token

```javascript
// Ejemplo de token JWT
const token = jwt.sign(
  { userId: 1, email: 'user@example.com' }, // Datos (payload)
  'clave_secreta',                           // Clave para firmar
  { expiresIn: '24h' }                       // Opciones
);
```

**Estructura de un JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9.SflKxwRJ...
└────────── Header ─────────┘ └─── Payload ──┘ └─ Signature ─┘
```

### 4. Hash de Contraseñas

**¡NUNCA guardes contraseñas en texto plano!**

Usamos `bcryptjs` para encriptar contraseñas:

```javascript
// Encriptar
const hash = await bcrypt.hash('miContraseña', 10);
// Resultado: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL...

// Verificar
const esValida = await bcrypt.compare('miContraseña', hash);
// true o false
```

## 🔍 Recorrido por el Código

### 1. Punto de Entrada: `index.js`

```javascript
import express from 'express';
import cors from 'cors';

const app = express(); // Crear aplicación Express

// Middlewares globales
app.use(cors());              // Permitir peticiones desde otros dominios
app.use(express.json());      // Parsear JSON del body

// Rutas
app.use('/api/avisos', avisoRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});
```

### 2. Rutas: `authRoutes.js`

Las rutas conectan URLs con controladores:

```javascript
import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register → authController.register
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
```

### 3. Controladores: `authController.js`

Contienen la lógica de negocio:

```javascript
export const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validar datos
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email y password requeridos'
        });
      }

      // Verificar si existe
      const exists = await userModel.exists(email);
      if (exists) {
        return res.status(409).json({
          message: 'Usuario ya existe'
        });
      }

      // Crear usuario
      const user = await userModel.create({ email, password });

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Responder
      res.status(201).json({
        success: true,
        data: { user, token }
      });

    } catch (error) {
      next(error); // Pasar error al middleware de errores
    }
  }
};
```

### 4. Modelos: `userModel.js`

Interactúan con la base de datos:

```javascript
import bcrypt from 'bcryptjs';
import sql from '../config/database.js';

export const userModel = {
  // Crear usuario
  async create(userData) {
    const { email, password } = userData;

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar en BD y retornar el registro creado
    const [user] = await sql`
      INSERT INTO usuarios (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id, email, created_at
    `;

    return user;
  },

  // Buscar por email
  async findByEmail(email) {
    const [user] = await sql`
      SELECT * FROM usuarios WHERE email = ${email}
    `;
    return user;
  }
};
```

### 5. Middlewares: `auth.js`

Verifican autenticación:

```javascript
export const authenticateToken = (req, res, next) => {
  // Obtener token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      message: 'Token requerido'
    });
  }

  // Verificar token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Token inválido'
      });
    }

    // Agregar usuario al request
    req.user = user;
    next(); // Continuar al controlador
  });
};
```

**Uso en rutas:**

```javascript
// Ruta protegida - requiere autenticación
router.post('/avisos', authenticateToken, avisoController.create);
//                     ↑ Middleware que verifica el token
```

## 🔄 Flujo Completo de una Petición

### Ejemplo: Crear un aviso de empleo

```
1. Cliente envía petición:
   POST /api/avisos
   Headers: { Authorization: "Bearer eyJhbG..." }
   Body: { titulo: "Developer", descripcion: "..." }

2. Express recibe la petición
   ↓
3. Middleware CORS permite la petición
   ↓
4. express.json() parsea el body
   ↓
5. Router identifica: POST /api/avisos → avisoRoutes
   ↓
6. Middleware authenticateToken verifica el token JWT
   ↓
7. Si el token es válido, continúa al controlador
   ↓
8. avisoController.create procesa la petición
   ↓
9. avisoModel.create inserta en la base de datos
   ↓
10. Controlador envía respuesta al cliente
    ↓
11. Cliente recibe: { success: true, data: { ... } }
```

## 🗄️ Base de Datos

### Conexión: `database.js`

```javascript
import postgres from 'postgres';

// Crear conexión usando la URL de entorno
const sql = postgres(process.env.DATABASE_URL);

export default sql;
```

### Consultas SQL con postgres.js

```javascript
// Insertar
const [user] = await sql`
  INSERT INTO usuarios (email, password_hash)
  VALUES (${email}, ${hash})
  RETURNING *
`;

// Consultar
const users = await sql`
  SELECT * FROM usuarios WHERE email = ${email}
`;

// Actualizar
await sql`
  UPDATE usuarios
  SET email = ${newEmail}
  WHERE id = ${userId}
`;

// Eliminar
await sql`
  DELETE FROM usuarios WHERE id = ${userId}
`;
```

## 🛡️ Seguridad

### Buenas Prácticas Implementadas

1. **Contraseñas encriptadas**: Usamos bcryptjs
2. **Variables de entorno**: Datos sensibles en `.env`
3. **JWT**: Autenticación sin guardar sesiones
4. **Validación de datos**: Verificamos inputs antes de procesar
5. **Manejo de errores**: No exponemos detalles internos

### Variables de Entorno (`.env`)

```env
# NUNCA subir este archivo a Git
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=clave_super_secreta_cambiar_en_produccion
JWT_EXPIRATION=24h
PORT=3000
```

## 🧪 Probando la API

### Con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Crear aviso (con token)
curl -X POST http://localhost:3000/api/avisos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbG..." \
  -d '{"titulo":"Developer","empresa_id":1}'
```

### Con Postman o Thunder Client

1. Crear una petición POST a `http://localhost:3000/api/auth/login`
2. En Body → JSON: `{"email":"test@test.com","password":"123456"}`
3. Enviar y copiar el token de la respuesta
4. Para rutas protegidas, agregar header: `Authorization: Bearer <token>`

## 📚 Conceptos de Node.js Usados

### 1. Módulos ES6

```javascript
// Exportar
export const authController = { ... };
export default router;

// Importar
import express from 'express';
import { authController } from './controllers/authController.js';
```

### 2. Async/Await

```javascript
// Manejo de operaciones asíncronas
async function obtenerUsuario() {
  const user = await userModel.findByEmail('test@test.com');
  return user;
}
```

### 3. Destructuring

```javascript
// Extraer propiedades de objetos
const { email, password } = req.body;

// En lugar de:
const email = req.body.email;
const password = req.body.password;
```

### 4. Template Literals

```javascript
// Con postgres.js usamos tagged templates
const users = await sql`SELECT * FROM usuarios WHERE id = ${userId}`;
```

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo (con auto-reload)
npm run dev

# Iniciar en producción
npm start

# Ver logs del servidor
# El servidor muestra en consola cada petición recibida
```

## 📝 Ejercicios Propuestos

### Nivel Básico

1. Agregar un endpoint GET `/api/auth/me` que retorne el usuario actual (usando el token)
2. Agregar validación de email (formato válido)
3. Agregar un campo `nombre` al registro de usuarios

### Nivel Intermedio

4. Implementar un endpoint para cambiar la contraseña
5. Agregar paginación a GET `/api/avisos` (limit y offset)
6. Implementar búsqueda de avisos por título

### Nivel Avanzado

7. Implementar refresh tokens (tokens que expiran y se renuevan)
8. Agregar roles de usuario (admin, empresa, usuario)
9. Implementar upload de imágenes para logos de empresas

## 🔗 Recursos Adicionales

- [Express.js Docs](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - Decodificar y entender JWTs
- [Postgres.js Docs](https://github.com/porsager/postgres)
- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

## ❓ Preguntas Frecuentes

**P: ¿Por qué usamos JWT en lugar de sesiones?**
R: JWT es stateless (sin estado), perfecto para APIs que pueden ser consumidas por múltiples clientes (web, móvil, etc.). No necesitamos guardar sesiones en el servidor.

**P: ¿Qué es el salt en bcrypt?**
R: Es un valor aleatorio que se agrega a la contraseña antes de encriptarla. Hace que dos usuarios con la misma contraseña tengan hashes diferentes.

**P: ¿Por qué separar en capas (routes, controllers, models)?**
R: Separación de responsabilidades. Facilita el mantenimiento, testing y escalabilidad del código.

**P: ¿Qué es `next()` en los middlewares?**
R: Es una función que pasa el control al siguiente middleware o controlador en la cadena.

**P: ¿Por qué usar variables de entorno?**
R: Para separar la configuración del código. Diferentes ambientes (desarrollo, producción) pueden tener diferentes configuraciones sin cambiar el código.

## 🎓 Conclusión

Este proyecto te enseña:
- Arquitectura de APIs REST
- Autenticación moderna con JWT
- Seguridad básica (encriptación, validación)
- Interacción con bases de datos
- Buenas prácticas de Node.js

¡Experimenta, rompe cosas, aprende! 💪
