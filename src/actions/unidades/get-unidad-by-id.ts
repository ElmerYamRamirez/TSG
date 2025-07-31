'use server';

import { executeQuery } from "components/app/lib/connection";

export const getUnidadById = async (id: string) => {
  try {
    const paramsList = [{ name: "id", value: id }];

    const query = `
      SELECT *
      FROM Unidad
      WHERE combustible = 'Gas/Gasolina'
    `;

    const unidad = await executeQuery(query, paramsList);

    return {
      ok: true,
      unidad: unidad[0] ?? null,
    };
  } catch (error) {
    console.error("Error al obtener unidad por ID:", error);
    return {
      ok: false,
      unidad: null,
    };
  }
};
