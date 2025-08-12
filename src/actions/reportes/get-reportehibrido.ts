'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReportesHibrido = async () => {
  try {
    const query = `
      SELECT *
      FROM PC_Rep_ReporteHibrido
      ORDER BY uniqueId DESC;
    `;

    const reportes = await executeQuery(query);

    return {
      ok: true,
      reportes,
    };
    
  } catch (error) {
    console.error("API Error - Reportes Hibridos:", error);
    return {
      ok: false,
      reportes: [],
    };
  }
};
