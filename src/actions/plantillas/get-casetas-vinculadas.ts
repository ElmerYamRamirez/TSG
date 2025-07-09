'use server';

import { executeQuery } from "components/app/lib/connection";

export const getCasetasVinculadas = async (plantillaId: number): Promise<{ ok: boolean; casetasVinculadas: number[] }> => {
  try {
    const query = `
      SELECT caseta
      FROM plantilla_casetas
      WHERE destino = @id AND Bit_Activo = 1
    `;

    const paramsList = [{ name: "id", value: plantillaId }];

    const result = await executeQuery(query, paramsList);

    const casetasVinculadas: number[] = result.map((row: any) => row.caseta);

    return { ok: true, casetasVinculadas };
  } catch (error) {
    console.error("Error al obtener las casetas vinculadas:", error);
    return { ok: false, casetasVinculadas: [] };
  }
};