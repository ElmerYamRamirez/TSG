'use server';

import { executeQuery } from "components/app/lib/connection";
import { Prestamo } from "components/interfaces/prestamo";

export const updatePrestamoById = async (item: Prestamo) => {
  try {
    const query = `
      UPDATE Prestamo
      SET
        Descuento_por_semana = @Descuento_por_semana,
        Monto_de_prestamo = @Monto_de_prestamo,
        Numero_de_pagos = @Numero_de_pagos,
        Saldo = @Saldo,
        Nombre = @Nombre,
        Status = @Status,
        Comentario = @Comentario
      WHERE uniqueId = @uniqueId AND Bit_Activo = 1
    `;

    const paramsList = [
      { name: 'uniqueId', value: item.uniqueId},
      { name: 'Descuento_por_semana', value: item.Descuento_por_semana ?? 0 },
      { name: 'Monto_de_prestamo', value: item.Monto_de_prestamo},
      { name: 'Numero_de_pagos', value: item.Numero_de_pagos ?? 0 },
      { name: 'Saldo', value: item.Saldo },
      { name: 'Nombre', value: Number(item.Nombre) },
      { name: 'Status', value: item.Status },
      { name: 'Comentario', value: item.Comentario ?? "" },
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
