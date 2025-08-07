'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosFiltro = async (
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
      SELECT *
      FROM Sueldos
      WHERE 
        (CAST(codigo AS VARCHAR) LIKE @searchTerm OR empleado LIKE @searchTerm)
      ORDER BY Fec_Alta DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      sueldos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      sueldos: []
    };
  }
};
