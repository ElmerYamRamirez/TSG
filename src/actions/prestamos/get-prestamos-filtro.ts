'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPrestamosFiltro = async (
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
      SELECT 
        Pr.*,
        O.Nombre AS operador_name
      FROM 
        Prestamo Pr
      LEFT JOIN 
        Operador O ON Pr.Nombre = O.uniqueId
      WHERE 
        (
          CAST(Pr.Nombre AS VARCHAR) LIKE @searchTerm
          OR O.Nombre LIKE @searchTerm
        )
        AND Pr.Bit_Activo = 1
      ORDER BY Pr.Fec_Alta DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      prestamos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      prestamos: []
    };
  }
};
