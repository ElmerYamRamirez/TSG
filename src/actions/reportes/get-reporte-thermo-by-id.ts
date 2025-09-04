'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteThermoById = async (id: string) => {
  try {
    const paramsList = [{ name: "id", value: id }];

    const query = `
      SELECT *
      FROM PC_Rep_ReporteThermo
      WHERE programacion = @id;
    `;
    const reporte_thermo = await executeQuery(query, paramsList);
    

    return {
      ok: true,
      reporte_thermo: reporte_thermo[0] ?? null,
    };
    
  } catch (error) {
    console.error("API Error - reporte_thermo de Rendimiento:", error);
    return {
      ok: false,
      reporte_thermo: [],
    };
  }
};
