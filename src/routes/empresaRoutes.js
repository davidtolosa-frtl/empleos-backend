import express from 'express';
import { empresaController } from '../controllers/empresaController.js';
import { validateEmpresa } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.post('/', validateEmpresa, empresaController.create);
router.put('/:id', validateEmpresa, empresaController.update);
router.delete('/:id', empresaController.delete);

export default router;