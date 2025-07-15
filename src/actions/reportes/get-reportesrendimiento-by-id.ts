'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteRendimientoById = async (id: string) => {
  try {
    const paramsList = [{ name: "id", value: id }];

    const query = `
      SELECT *
      FROM PC_Rep_RendimientosNew
      WHERE uniqueId = @id;
    `;

    const result = await executeQuery(query, paramsList);

    return {
      ok: true,
      reporte: result[0] ?? null,
    };

  } catch (error) {
    console.error("Error al obtener el reporte de rendimiento por ID:", error);
    return {
      ok: false,
      reporte: null,
    };
  }
};
