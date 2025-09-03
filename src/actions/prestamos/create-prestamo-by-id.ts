'use server';

import { executeQuery } from "components/app/lib/connection";
import { Prestamo } from "components/interfaces/prestamo";

export const createPrestamo = async (item: Prestamo) => {
  try {
    const queryInsert = `
      INSERT INTO Prestamo (uniqueId,Bit_Activo,Fec_Alta,Descuento_por_semana,Monto_de_prestamo,Numero_de_pagos,Saldo,Nombre,Status,Comentario
      )
      VALUES (
        (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM Prestamo),
        1,
        @Fec_Alta,
        @Descuento_por_semana,
        @Monto_de_prestamo,
        @Numero_de_pagos,
        @Saldo,
        @Nombre,
        @Status,
        @Comentario
         
      )
    `;

    await executeQuery(queryInsert, [
      { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
      { name: 'Descuento_por_semana', value: item.Descuento_por_semana ?? 0 },
      { name: 'Monto_de_prestamo', value: item.Monto_de_prestamo },
      { name: 'Numero_de_pagos', value: item.Numero_de_pagos ?? 0 },
      { name: 'Saldo', value: item.Saldo},
      { name: 'Nombre', value: Number(item.Nombre) },
      { name: 'Status', value: item.Status },
      { name: 'Comentario', value: item.Comentario ?? "" },
      
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
