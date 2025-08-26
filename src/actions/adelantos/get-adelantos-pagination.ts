'use server';

import { executeQuery } from "components/app/lib/connection";

export const getAdelantosPagination = async (page: number, pageSize: number = 15) => {
  try {
    const offset = (page - 1) * pageSize;
    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
    ];

    const query = `
      SELECT 
        Ad.*,
        O.Nombre AS operador_name
      FROM 
        Adelanto Ad
      LEFT JOIN
        Operador O ON Ad.Nombre = O.uniqueId
      WHERE 
          Ad.Bit_Activo = 1
      ORDER BY Ad.Fec_Alta ASC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `SELECT COUNT(*) AS total FROM Adelanto`;

    const [adelantos, totalResult] = await Promise.all([
      executeQuery(query, paramsList),
      executeQuery(totalQuery),
    ]);

    return {
      ok: true,
      adelantos,
      total: totalResult?.[0]?.total ?? 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, adelantos: [], total: 0 };
  }
};
