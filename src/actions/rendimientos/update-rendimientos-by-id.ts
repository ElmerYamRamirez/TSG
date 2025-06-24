'use server';

import { executeQuery } from "components/app/lib/connection";
import { Rendimiento } from "components/interfaces/rendimientos";

export const updateRendimientoById = async (item: Rendimiento) => {
    try {
        if (item.uniqueId === undefined) {
            throw new Error("uniqueId es obligatorio para actualizar un rendimiento.");
        }

        const query = `
        UPDATE reporte_rendimiento
        SET 
            rendimiento_ideal = @rendimiento_ideal, 
            litros_ideales = @litros_ideales,
            programacion = @programacion,
            litros_iniciales = @litros_iniciales,
            litros_finales = @litros_finales,
            km_inicial = @km_inicial,
            km_final = @km_final
        WHERE uniqueId = @uniqueId;
        `;

        const paramsList = [
            { name: 'rendimiento_ideal', value: item.rendimiento_ideal },
            { name: 'litros_ideales', value: item.litros_ideales },
            { name: 'programacion', value: item.programacion },
            { name: 'uniqueId', value: item.uniqueId },
            { name: 'litros_iniciales', value: item.litros_iniciales ?? null },
            { name: 'litros_finales', value: item.litros_finales ?? null },
            { name: 'km_inicial', value: item.km_inicial ?? null},
            { name: 'km_final', value: item.km_final ?? null},
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
