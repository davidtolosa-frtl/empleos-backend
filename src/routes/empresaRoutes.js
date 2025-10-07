import express from 'express';
import { empresaController } from '../controllers/empresaController.js';
import { validateEmpresa } from '../middlewares/validation.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, empresaController.getAll);
router.get('/:id', authenticateToken, empresaController.getById);
router.post('/', authenticateToken, validateEmpresa, empresaController.create);
router.put('/:id', authenticateToken, validateEmpresa, empresaController.update);
router.delete('/:id', authenticateToken, empresaController.delete);

export default router;