'use server';

import { executeQuery } from "components/app/lib/connection";

export const getAdelantosFiltro = async (
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
        Ad.*,
        O.Nombre AS operador_name
      FROM 
        Adelanto Ad
      LEFT JOIN 
        Operador O ON Ad.Nombre = O.uniqueId
      WHERE 
        (
          CAST(Ad.Nombre AS VARCHAR) LIKE @searchTerm
          OR O.Nombre LIKE @searchTerm
        )
        AND Ad.Bit_Activo = 1
      ORDER BY Ad.Fec_Alta DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      adelantos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      adelantos: []
    };
  }
};
