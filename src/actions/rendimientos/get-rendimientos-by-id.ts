'use server';

import { executeQuery } from "components/app/lib/connection";
import { Rendimiento } from "components/interfaces/rendimientos";

export const getRendimientoByProgramacion = async (programacion: number): Promise<Rendimiento | null> => {
  try {
    const query = `
      SELECT TOP 1 *
      FROM reporte_rendimiento
      WHERE programacion = @programacion AND Bit_Activo = 1
    `;

    const paramsList = [{ name: 'programacion', value: programacion }];
    const result = await executeQuery(query, paramsList);

    // Si executeQuery retorna un array plano, simplemente accedemos al índice 0:
    return result?.[0] ?? null;

  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
