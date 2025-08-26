
'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosAll = async () => {
  try {

    const query = `
        SELECT 
            Su.*
        FROM 
            Sueldos Su
        WHERE Bit_Activo = 1
    `;

    const [sueldos] = await Promise.all([
      executeQuery(query)
    ]);

    return {
      ok: true,
      sueldos,
    };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, sueldos: [], total: 0 };
  }
};
