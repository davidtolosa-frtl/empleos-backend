export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  if (err.code === '23505') { // Postgres unique violation
    return res.status(409).json({
      error: 'El recurso ya existe',
      details: 'Ya existe un registro con estos datos'
    });
  }

  if (err.code === '23503') { // Postgres foreign key violation
    return res.status(400).json({
      error: 'Referencia inválida',
      details: 'El registro referenciado no existe'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error'
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    path: req.originalUrl
  });
};