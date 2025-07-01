'use server';

import { executeQuery } from "components/app/lib/connection";
import { checkViaticoPlantilla } from "components/interfaces/check_viatico";

export const checkViatico = async (item: checkViaticoPlantilla) => {
  try {
    const query = `
      INSERT INTO plantilla_viaticos (
        uniqueId,
        Bit_Activo,
        Fec_Alta,
        descripcion,
        viaticos,
        destino,
        nombre
      )
      VALUES (
        (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM plantilla_viaticos),
        1,
        @fecha_alta,
        @descripcion,
        @viaticos,
        @destino,
        @nombre
      );
    `;

    const paramsList = [
      { name: 'fecha_alta', value: item.Fec_Alta },
      { name: 'descripcion', value: item.descripcion ?? null },
      { name: 'viaticos', value: item.viaticos },
      { name: 'destino', value: item.destino },
      { name: 'nombre', value: item.nombre },
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
