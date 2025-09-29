import { empresaModel } from '../models/empresaModel.js';

export const empresaController = {
  async getAll(req, res, next) {
    try {
      const empresas = await empresaModel.getAll();
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const empresa = await empresaModel.getById(id);

      if (!empresa) {
        return res.status(404).json({
          error: 'Empresa no encontrada'
        });
      }

      res.json(empresa);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const empresaExistente = await empresaModel.getByNombre(req.body.nombre);

      if (empresaExistente) {
        return res.status(409).json({
          error: 'Ya existe una empresa con ese nombre',
          empresa: empresaExistente
        });
      }

      const nuevaEmpresa = await empresaModel.create(req.body);
      res.status(201).json(nuevaEmpresa);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const empresaActualizada = await empresaModel.update(id, req.body);

      if (!empresaActualizada) {
        return res.status(404).json({
          error: 'Empresa no encontrada'
        });
      }

      res.json(empresaActualizada);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const empresaEliminada = await empresaModel.delete(id);

      if (!empresaEliminada) {
        return res.status(404).json({
          error: 'Empresa no encontrada'
        });
      }

      res.json({
        message: 'Empresa eliminada exitosamente',
        empresa: empresaEliminada
      });
    } catch (error) {
      next(error);
    }
  }
};