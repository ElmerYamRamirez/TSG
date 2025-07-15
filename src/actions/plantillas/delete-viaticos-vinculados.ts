'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteViaticosVinculados = async (destino: number) => {
  try {
    const query = `
    DELETE FROM plantilla_viaticos
    WHERE destino = @dest`;

    const paramsList = [{ name: 'dest', value: destino }];

    await executeQuery(query, paramsList);
    
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
};
