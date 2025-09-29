import express from 'express';
import { avisoController } from '../controllers/avisoController.js';
import { validateAviso } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', avisoController.getAll);
router.get('/:id', avisoController.getById);
router.post('/', validateAviso, avisoController.create);
router.put('/:id', validateAviso, avisoController.update);
router.delete('/:id', avisoController.delete);

export default router;