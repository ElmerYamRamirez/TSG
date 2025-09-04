'use server';

import { executeQuery } from "components/app/lib/connection";

export const getConfiguracionTanquesFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const search = `%${searchTerm.trim()}%`;

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
      { name: "searchTerm", value: search },
    ];

    const query = `
      SELECT ct.*
      FROM configuracion_tanques ct
      JOIN Unidad u ON ct.unidad = u.uniqueId
      WHERE u.Nombre LIKE @searchTerm
      ORDER BY u.Nombre
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const configuraciontanque = await executeQuery(query, paramsList);

    return {
      ok: true,
      configuracionTanques: configuraciontanque
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      configuracionTanques: []
    };
  }
};
