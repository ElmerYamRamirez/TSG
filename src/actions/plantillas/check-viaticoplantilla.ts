'use server';

import { executeQuery } from "components/app/lib/connection";
import { checkViaticoPlantilla } from "components/interfaces/check_viatico";

export const checkViatico = async (item: checkViaticoPlantilla) => {
  try {
    const query = `
      IF NOT EXISTS (
        SELECT 1 FROM plantilla_viaticos
        WHERE destino = @destino AND viaticos = @viaticos
      )
      BEGIN
        INSERT INTO plantilla_viaticos (
          uniqueId,
          Bit_Activo,
          Fec_Alta,
          descripcion,
          viaticos,
          destino,
          nombre
        )
        SELECT
          (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM plantilla_viaticos),
          1,
          @fecha_alta,
          @descripcion,
          @viaticos,
          d.uniqueId,
          d.Nombre
        FROM Destino d
        WHERE d.uniqueId = @destino;
      END
    `;

    const paramsList = [
      { name: 'fecha_alta', value: item.Fec_Alta },
      { name: 'descripcion', value: item.descripcion ?? null },
      { name: 'viaticos', value: item.viaticos },
      { name: 'destino', value: item.destino },

    ];

    const response = await executeQuery(query, paramsList);

    return {
      ok: true,
      res: response,
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      res: null,
    };
  }
};
