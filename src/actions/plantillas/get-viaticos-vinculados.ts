'use server';

import { executeQuery } from "components/app/lib/connection";

export const getViaticosVinculados = async (plantillaId: number): Promise<{ ok: boolean; viaticosVinculados: number[] }> => {
  try {
    const query = `
      SELECT viaticos
      FROM plantilla_viaticos
      WHERE destino = @id AND Bit_Activo = 1
    `;

    const paramsList = [{ name: "id", value: plantillaId }];

    const result = await executeQuery(query, paramsList);

    const viaticosVinculados: number[] = (result as { viaticos: number }[]).map((row) => row.viaticos);

    return { ok: true, viaticosVinculados };
  } catch (error) {
    console.error("Error al obtener los viáticos vinculados:", error);
    return { ok: false, viaticosVinculados: [] };
  }
};
