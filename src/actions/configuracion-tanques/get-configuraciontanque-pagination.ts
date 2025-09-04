'use server';

import { executeQuery } from "components/app/lib/connection";

export const getConfiguracionTanquesPagination = async (page: number, pageSize = 15) => {
  try {
    const offset = (page - 1) * pageSize;

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
    ];

    const query = `
      SELECT *
      FROM configuracion_tanques
      ORDER BY unidad
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const configuracionTanques = await executeQuery(query, paramsList);

    console.log(JSON.stringify(configuracionTanques));

    return {
      ok: true,
      configuracionTanques,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      unidades: [],
    };
  }
};
