'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReportesRendimientoFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const search = `%${searchTerm.trim()}%`;
    const isDateSearch = /^\d{2}\/\d{2}\/\d{2}$/.test(searchTerm.trim()) || /^\d{2}\/\d{2}\/\d{4}$/.test(searchTerm.trim());

    let dateCondition = "";
    if (isDateSearch) {
      const parts = searchTerm.trim().split('/');
      const isoDate = parts[2].length === 2 ? `20${parts[2]}-${parts[1]}-${parts[0]}` : `${parts[2]}-${parts[1]}-${parts[0]}`;
      dateCondition = `OR CONVERT(date, Fecha_programada) = CONVERT(date, '${isoDate}')`;
    }

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
      { name: "searchTerm", value: search },
    ];

    const query = `
      SELECT *
      FROM PC_Rep_RendimientosNew
      WHERE 
        unidad LIKE @searchTerm
        ${dateCondition || "OR FORMAT(Fecha_programada, 'dd/MM/yy') LIKE @searchTerm"}
      ORDER BY 
        Fecha_programada DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
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