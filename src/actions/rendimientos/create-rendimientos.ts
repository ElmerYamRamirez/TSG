'use server';

import { executeQuery } from "components/app/lib/connection";
import { Rendimiento } from "components/interfaces/rendimientos";

export const createRendimiento = async (item: Rendimiento) => {
    try {
        const query = `
        INSERT INTO reporte_rendimiento (uniqueId, Bit_Activo, Fec_Alta, rendimiento_ideal, litros_ideales, programacion, litros_iniciales,litros_finales, km_inicial, km_final)
        VALUES (
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM reporte_rendimiento),
            1,
            @Fec_Alta,
            @rendimiento_ideal,
            @litros_ideales,
            @programacion,
            @litros_iniciales,
            @litros_finales,
            @km_inicial, 
            @km_final
            
        )
        `;

        const paramsList = [
            { name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
            { name: 'rendimiento_ideal', value: item.rendimiento_ideal },
            { name: 'litros_ideales', value: item.litros_ideales },
            { name: 'programacion', value: item.programacion },
            { name: 'litros_iniciales', value: item.litros_iniciales ?? null },
            { name: 'litros_finales', value: item.litros_finales ?? null },
            { name: 'km_inicial', value: item.km_inicial ?? null},
            { name: 'km_final', value: item.km_final ?? null},
            
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
            message: "Internal Server Error",
            error,
        };
    }
};
