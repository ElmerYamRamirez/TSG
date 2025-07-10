'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReportesRendimiento = async () => {
  try {
    const query = `
      SELECT *
      FROM PC_Rep_RendimientosNew
      ORDER BY Fecha_programada DESC, Hora_programada;
    `;

    const reportes = await executeQuery(query);

    return {
      ok: true,
      reportes,
    };
    
  } catch (error) {
    console.error("API Error - Reportes de Rendimiento:", error);
    return {
      ok: false,
      reportes: [],
    };
  }
};
