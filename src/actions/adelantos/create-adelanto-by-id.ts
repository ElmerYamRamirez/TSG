'use server';

import { executeQuery } from "components/app/lib/connection";
import { Adelanto } from "components/interfaces/adelanto";

export const createAdelanto = async (item: Adelanto) => {
  try {
    const queryInsert = `
      INSERT INTO Adelanto (
        uniqueId,
        Bit_Activo,
        Fec_Alta,
        Cantidad,
        Status,
        Comentario,
        Nombre,
        Fecha_Finalizacion,
        Fecha_Inicio,
        Total_Actual
      )
      VALUES (
        (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM Adelanto),
        1,
        @Fec_Alta,
        @Cantidad,
        @Status,
        @Comentario,
        @Nombre,
        @Fecha_Finalizacion,
        @Fecha_Inicio,
        @Total_Actual
      )
    `;

    await executeQuery(queryInsert, [
      { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
      { name: 'Cantidad', value: item.Cantidad ?? null },
      { name: 'Status', value: item.Status ?? null },
      { name: 'Comentario', value: item.Comentario ?? null },
      { name: 'Nombre', value: Number(item.Nombre) },
      { name: 'Fecha_Finalizacion', value: item.Fecha_Finalizacion ?? null },
      { name: 'Fecha_Inicio', value: item.Fecha_Inicio ?? null },
      { name: 'Total_Actual', value: item.Total_Actual ?? null },
    ]);

    return { ok: true, message: "Registro creado correctamente" };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      error: "Internal Server Error"
    };
  }
};
