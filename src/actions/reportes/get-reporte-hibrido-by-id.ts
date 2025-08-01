'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteHibridoById = async (id: string) => {
  try {
    const paramsList = [{ name: "id", value: id }];

    const query = `
      SELECT *
      FROM PC_Rep_ReporteHibrido
      WHERE programacion = @id;
    `;
    const reporte_hibrido = await executeQuery(query, paramsList);

    return {
      ok: true,
      reporte_hibrido: reporte_hibrido[0] ?? null,
    };
  } catch (error) {
    console.error("Error al obtener datos híbridos:", error);
    return {
      ok: false,
      reporte_hibrido: null,
    };
  }
};