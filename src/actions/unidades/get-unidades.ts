'use server';

import { executeQuery } from "components/app/lib/connection";

export const getUnidades = async () => {
    try {
        let query = `
            SELECT 
                uniqueId,
                Nombre,
                Marca,
                Modelo,
                Placa,
                Tipo_De_Unidad,
                combustible,
                Caracteristica,
                Ano,
                Descripcion
            FROM 
                Unidad
            WHERE Bit_Activo = 1
            ORDER BY Nombre
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
