'use server';

import { executeQuery } from "components/app/lib/connection";
import { Adelanto } from "components/interfaces/adelanto";

export const updateAdelantoById = async (item: Adelanto) => {
  try {
    const query = `
      UPDATE Adelanto
      SET
        Cantidad = @Cantidad,
        Status = @Status,
        Comentario = @Comentario,
        Nombre = @Nombre,
        Fecha_Finalizacion = @Fecha_Finalizacion,
        Fecha_Inicio = @Fecha_Inicio,
        Total_Actual = @Total_Actual
      WHERE uniqueId = @uniqueId AND Bit_Activo = 1
    `;

    const paramsList = [
      { name: 'uniqueId', value: item.uniqueId ?? null },
      { name: 'Cantidad', value: item.Cantidad ?? null }, 
      { name: 'Status', value: item.Status ?? null }, 
      { name: 'Comentario', value: item.Comentario ?? null }, 
      { name: 'Nombre', value: item.Nombre ?? null }, 
      { name: 'Fecha_Finalizacion', value: item.Fecha_Finalizacion ?? null }, 
      { name: 'Fecha_Inicio', value: item.Fecha_Inicio ?? null },
      { name: 'Total_Actual', value: item.Total_Actual ?? null },
    ];

    const response = await executeQuery(query, paramsList);

    console.log(response);
    return {
      ok: true,
      res: response,
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      error: "Internal Server Error"
    };
  }
};
