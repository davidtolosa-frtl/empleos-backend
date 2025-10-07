import express from 'express';
import { avisoController } from '../controllers/avisoController.js';
import { validateAviso } from '../middlewares/validation.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/', avisoController.getAll);
router.get('/:id', avisoController.getById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, validateAviso, avisoController.create);
router.put('/:id', authenticateToken, validateAviso, avisoController.update);
router.delete('/:id', authenticateToken, avisoController.delete);

export default router;