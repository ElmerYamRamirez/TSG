'use server';

import { executeQuery } from "components/app/lib/connection";

export const getUnidadesPagination = async (page: number, pageSize = 15) => {
  try {
    const offset = (page - 1) * pageSize;

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
    ];

    const query = `
      SELECT  u.*
      FROM  Unidad u
      WHERE 
        Bit_Activo = 1
      ORDER BY 
        u.Nombre
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const unidades = await executeQuery(query, paramsList);

    console.log(JSON.stringify(unidades));

    return {
      ok: true,
      unidades,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      unidades: [],
    };
  }
};
