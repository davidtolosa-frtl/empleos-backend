import { avisoModel } from '../models/avisoModel.js';
import { empresaModel } from '../models/empresaModel.js';

export const avisoController = {
  async getAll(req, res, next) {
    try {
      const { ubicacion, tipo_contrato } = req.query;
      const filters = {};

      if (ubicacion) filters.ubicacion = ubicacion;
      if (tipo_contrato) filters.tipo_contrato = tipo_contrato;

      const avisos = await avisoModel.getAll(filters);
      res.json(avisos);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const aviso = await avisoModel.getById(id);

      if (!aviso) {
        return res.status(404).json({
          error: 'Aviso no encontrado'
        });
      }

      res.json(aviso);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      // Verificar que la empresa existe
      const empresa = await empresaModel.getById(req.body.empresa_id);

      if (!empresa) {
        return res.status(400).json({
          error: 'La empresa especificada no existe'
        });
      }

      const nuevoAviso = await avisoModel.create(req.body);
      const avisoCompleto = await avisoModel.getById(nuevoAviso.id);

      res.status(201).json(avisoCompleto);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar que la empresa existe si se proporciona
      if (req.body.empresa_id) {
        const empresa = await empresaModel.getById(req.body.empresa_id);
        if (!empresa) {
          return res.status(400).json({
            error: 'La empresa especificada no existe'
          });
        }
      }

      const avisoActualizado = await avisoModel.update(id, req.body);

      if (!avisoActualizado) {
        return res.status(404).json({
          error: 'Aviso no encontrado'
        });
      }

      const avisoCompleto = await avisoModel.getById(avisoActualizado.id);
      res.json(avisoCompleto);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const avisoEliminado = await avisoModel.delete(id);

      if (!avisoEliminado) {
        return res.status(404).json({
          error: 'Aviso no encontrado'
        });
      }

      res.json({
        message: 'Aviso eliminado exitosamente',
        aviso: avisoEliminado
      });
    } catch (error) {
      next(error);
    }
  }
};