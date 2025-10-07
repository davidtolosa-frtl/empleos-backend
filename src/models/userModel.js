import sql from '../config/database.js';
import bcrypt from 'bcryptjs';

export const userModel = {
  // Crear un nuevo usuario
  async create(userData) {
    const { email, password } = userData;
    
    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const [result] = await sql`
      INSERT INTO usuarios (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id, email, created_at
    `;
    
    return result;
  },

  // Buscar usuario por email
  async findByEmail(email) {
    const [result] = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
    return result;
  },

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Verificar si existe un usuario por email
  async exists(email) {
    const result = await sql`SELECT id FROM usuarios WHERE email = ${email}`;
    return result.length > 0;
  }
};