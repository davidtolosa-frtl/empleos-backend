import sql from '../config/database.js';

export const empresaModel = {
  async getAll() {
    return await sql`
      SELECT * FROM empresas
      ORDER BY nombre ASC
    `;
  },

  async getById(id) {
    const result = await sql`
      SELECT * FROM empresas
      WHERE id = ${id}
    `;
    return result[0];
  },

  async getByNombre(nombre) {
    const result = await sql`
      SELECT * FROM empresas
      WHERE LOWER(nombre) = LOWER(${nombre})
    `;
    return result[0];
  },

  async create(empresaData) {
    const { nombre, descripcion, website, email } = empresaData;

    const result = await sql`
      INSERT INTO empresas (nombre, descripcion, website, email)
      VALUES (${nombre}, ${descripcion || null}, ${website || null}, ${email || null})
      RETURNING *
    `;
    return result[0];
  },

  async update(id, empresaData) {
    const { nombre, descripcion, website, email } = empresaData;

    const result = await sql`
      UPDATE empresas
      SET
        nombre = ${nombre},
        descripcion = ${descripcion || null},
        website = ${website || null},
        email = ${email || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async delete(id) {
    const result = await sql`
      DELETE FROM empresas
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  }
};