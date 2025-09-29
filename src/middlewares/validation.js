class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateAviso = (req, res, next) => {
  const { titulo, descripcion, ubicacion, tipo_contrato, empresa_id } = req.body;

  if (!titulo || titulo.trim().length === 0) {
    throw new ValidationError('El título es obligatorio');
  }

  if (titulo.length > 200) {
    throw new ValidationError('El título no puede exceder 200 caracteres');
  }

  if (!descripcion || descripcion.trim().length === 0) {
    throw new ValidationError('La descripción es obligatoria');
  }

  if (descripcion.length > 5000) {
    throw new ValidationError('La descripción no puede exceder 5000 caracteres');
  }

  if (!ubicacion || ubicacion.trim().length === 0) {
    throw new ValidationError('La ubicación es obligatoria');
  }

  if (ubicacion.length > 100) {
    throw new ValidationError('La ubicación no puede exceder 100 caracteres');
  }

  if (!tipo_contrato) {
    throw new ValidationError('El tipo de contrato es obligatorio');
  }

  const tiposValidos = ['full-time', 'part-time', 'freelance', 'contrato', 'pasantia'];
  if (!tiposValidos.includes(tipo_contrato)) {
    throw new ValidationError(`El tipo de contrato debe ser uno de: ${tiposValidos.join(', ')}`);
  }

  if (!empresa_id || isNaN(parseInt(empresa_id))) {
    throw new ValidationError('El ID de empresa es obligatorio y debe ser un número válido');
  }

  next();
};

export const validateEmpresa = (req, res, next) => {
  const { nombre, descripcion, website, email } = req.body;

  if (!nombre || nombre.trim().length === 0) {
    throw new ValidationError('El nombre de la empresa es obligatorio');
  }

  if (nombre.length > 200) {
    throw new ValidationError('El nombre no puede exceder 200 caracteres');
  }

  if (descripcion && descripcion.length > 2000) {
    throw new ValidationError('La descripción no puede exceder 2000 caracteres');
  }

  if (website && !validateUrl(website)) {
    throw new ValidationError('El website debe ser una URL válida');
  }

  if (email && !validateEmail(email)) {
    throw new ValidationError('El email debe ser válido');
  }

  next();
};