'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteThermoFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = "",
  desde = "",
  hasta = ""
  ) => {
  try {
    const offset = (page - 1) * pageSize;
    const search = `%${searchTerm.trim()}%`;
   let dateFilter = "";
    if (desde && hasta) {
      dateFilter = `AND CONVERT(date, Fecha_programada) BETWEEN CONVERT(date, '${desde}') AND CONVERT(date, '${hasta}')`;
    } else if (desde) {
      dateFilter = `AND CONVERT(date, Fecha_programada) >= CONVERT(date, '${desde}')`;
    } else if (hasta) {
      dateFilter = `AND CONVERT(date, Fecha_programada) <= CONVERT(date, '${hasta}')`;
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
        (unidad LIKE @searchTerm OR FORMAT(Fecha_programada, 'dd/MM/yy') LIKE @searchTerm)
        ${dateFilter}
      ORDER BY Fecha_programada DESC
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