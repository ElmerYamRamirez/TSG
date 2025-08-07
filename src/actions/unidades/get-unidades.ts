'use server';

import { executeQuery } from "components/app/lib/connection";

export const getUnidades = async () => {
    try {
      const query = `
        SELECT 
            *
        FROM 
            Unidad
        WHERE Bit_Activo = 1
        ORDER BY 
            uniqueId DESC
        `;

        const unidades = await executeQuery(query, []);

        return {
            ok: true,
            unidades: unidades,
        };

    } catch (error) {
        console.error("Error al obtener unidades:", error);
        return {
            ok: false,
            unidades: [],
        };
    }
};
