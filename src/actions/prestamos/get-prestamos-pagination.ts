'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPrestamosPagination = async (page: number, pageSize: number = 15) => {
  try {
    const offset = (page - 1) * pageSize;
    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
    ];

    const query = `
      SELECT 
        Pr.*,
        O.Nombre AS operador_name
      FROM 
        Prestamo Pr
      LEFT JOIN
        Operador O ON Pr.Nombre = O.uniqueId
      WHERE 
          Pr.Bit_Activo = 1
      ORDER BY Pr.Fec_Alta ASC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `SELECT COUNT(*) AS total FROM Prestamo`;

    const [prestamos, totalResult] = await Promise.all([
      executeQuery(query, paramsList),
      executeQuery(totalQuery),
    ]);

    return {
      ok: true,
      prestamos,
      total: totalResult?.[0]?.total ?? 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, prestamos: [], total: 0 };
  }
};
