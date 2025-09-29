import sql from '../config/database.js';

export const avisoModel = {
  async getAll(filters = {}) {
    const { ubicacion, tipo_contrato } = filters;

    let query = sql`
      SELECT
        a.*,
        e.nombre as empresa_nombre,
        e.descripcion as empresa_descripcion,
        e.website as empresa_website
      FROM avisos a
      JOIN empresas e ON a.empresa_id = e.id
      WHERE 1=1
    `;

    if (ubicacion) {
      query = sql`
        SELECT
          a.*,
          e.nombre as empresa_nombre,
          e.descripcion as empresa_descripcion,
          e.website as empresa_website
        FROM avisos a
        JOIN empresas e ON a.empresa_id = e.id
        WHERE LOWER(a.ubicacion) LIKE LOWER(${'%' + ubicacion + '%'})
      `;
    }

    if (tipo_contrato && ubicacion) {
      query = sql`
        SELECT
          a.*,
          e.nombre as empresa_nombre,
          e.descripcion as empresa_descripcion,
          e.website as empresa_website
        FROM avisos a
        JOIN empresas e ON a.empresa_id = e.id
        WHERE LOWER(a.ubicacion) LIKE LOWER(${'%' + ubicacion + '%'})
          AND a.tipo_contrato = ${tipo_contrato}
      `;
    } else if (tipo_contrato) {
      query = sql`
        SELECT
          a.*,
          e.nombre as empresa_nombre,
          e.descripcion as empresa_descripcion,
          e.website as empresa_website
        FROM avisos a
        JOIN empresas e ON a.empresa_id = e.id
        WHERE a.tipo_contrato = ${tipo_contrato}
      `;
    }

    const results = await query;
    return results.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
  },

  async getById(id) {
    const result = await sql`
      SELECT
        a.*,
        e.nombre as empresa_nombre,
        e.descripcion as empresa_descripcion,
        e.website as empresa_website,
        e.email as empresa_email
      FROM avisos a
      JOIN empresas e ON a.empresa_id = e.id
      WHERE a.id = ${id}
    `;
    return result[0];
  },

  async create(avisoData) {
    const { titulo, descripcion, ubicacion, tipo_contrato, empresa_id } = avisoData;

    const result = await sql`
      INSERT INTO avisos (titulo, descripcion, ubicacion, tipo_contrato, empresa_id)
      VALUES (${titulo}, ${descripcion}, ${ubicacion}, ${tipo_contrato}, ${empresa_id})
      RETURNING *
    `;
    return result[0];
  },

  async update(id, avisoData) {
    const { titulo, descripcion, ubicacion, tipo_contrato, empresa_id } = avisoData;

    const result = await sql`
      UPDATE avisos
      SET
        titulo = ${titulo},
        descripcion = ${descripcion},
        ubicacion = ${ubicacion},
        tipo_contrato = ${tipo_contrato},
        empresa_id = ${empresa_id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async delete(id) {
    const result = await sql`
      DELETE FROM avisos
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  }
};