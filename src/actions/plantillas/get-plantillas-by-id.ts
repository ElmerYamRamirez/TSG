'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillaById = async (folio: string) => {
  try {
    const query = `
      SELECT * 
      FROM Destino 
      WHERE Folio = @id;
    `;

    const paramsList = [{ name: 'id', value: folio }];
    const result = await executeQuery(query, paramsList);

    return {
      ok: true,
      plantilla: result[0] ?? null,
    };

  } catch (error) {
    console.error("API Error:", error);
  }
};
