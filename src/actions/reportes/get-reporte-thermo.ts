'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteThermo = async () => {
  try {
    const query = `
      SELECT *
      FROM PC_Rep_ReportePrueba
      ORDER BY uniqueId DESC;
    `;

    const reportes = await executeQuery(query);

    return {
      ok: true,
      reportes,
    };
    
  } catch (error) {
    console.error("API Error - Reportes Thermos:", error);
    return {
      ok: false,
      reportes: [],
    };
  }
};
