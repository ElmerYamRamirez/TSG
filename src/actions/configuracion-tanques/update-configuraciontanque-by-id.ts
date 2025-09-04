'use server';

import { executeQuery } from "components/app/lib/connection";
import { ConfiguracionTanquesI } from "components/interfaces/configuracion_tanques";

export const updateConfiguracionTanqueById = async (item: ConfiguracionTanquesI) => {
  try {
    const query = `
      UPDATE configuracion_tanques
      SET 
        litros_maximos_t1 = @litros_maximos_t1,
        litros_maximos_t2 = @litros_maximos_t2,
        litros_maximos_t3 = @litros_maximos_t3,
        litros_maximos_t4 = @litros_maximos_t4,
        litros_maximos_tg = @litros_maximos_tg
      WHERE uniqueId = @id;
    `;

    const paramsList = [
      { name: 'id', value: item.uniqueId ?? 0 },
      { name: 'litros_maximos_t1', value: item.litros_maximos_t1 },
      { name: 'litros_maximos_t2', value: item.litros_maximos_t2 },
      { name: 'litros_maximos_t3', value: item.litros_maximos_t3 },
      { name: 'litros_maximos_t4', value: item.litros_maximos_t4 },
      { name: 'litros_maximos_tg', value: item.litros_maximos_tg }
    ];

    const result = await executeQuery(query, paramsList);

    return {
      ok: true,
      configuracion: result,
    };

  } catch (error) {
    console.error("Error al actualizar configuración de tanques:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
};
