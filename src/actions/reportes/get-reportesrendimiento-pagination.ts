'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReportesRendimientoPagination = async ( page: number,pageSize: number = 15) => {
  try {
    const offset = (page - 1) * pageSize;
    const paramsList = [{ name: "offset", value: offset }, { name: "pageSize", value: pageSize },];

    const query = `
      SELECT * FROM PC_Rep_RendimientosNew
      ORDER BY Fecha_programada DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `SELECT COUNT(*) AS total FROM PC_Rep_RendimientosNew`;

    const [rendimientos, totalResult] = await Promise.all([
      executeQuery(query, paramsList),
      executeQuery(totalQuery),
    ]);

    return {
      ok: true,
      rendimientos,
      total: totalResult?.[0]?.total ?? 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, rendimientos: [], total: 0 };
  }
};
