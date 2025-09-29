import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import avisoRoutes from './routes/avisoRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Avisos de Empleo',
    version: '1.0.0',
    endpoints: {
      avisos: '/api/avisos',
      empresas: '/api/empresas'
    }
  });
});

app.use('/api/avisos', avisoRoutes);
app.use('/api/empresas', empresaRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});