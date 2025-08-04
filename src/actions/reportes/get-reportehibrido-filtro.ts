'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteHibridoFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = "",
  desde = "",
  hasta = ""
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
      FROM PC_Rep_ReporteHibrido
      WHERE 
        (unidad LIKE @searchTerm OR programacion LIKE @searchTerm)
      ORDER BY uniqueId DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;


    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      rendimientos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      rendimientos: []
    };
  }
};