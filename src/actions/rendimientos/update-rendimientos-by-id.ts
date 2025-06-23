'use server';

import { executeQuery } from "components/app/lib/connection";
import { Rendimiento } from "components/interfaces/rendimientos";

export const updateRendimiento = async (item: Rendimiento) => {
    try {
        const query = `
        UPDATE reporte_rendimiento
        SET
            Bit_Activo = @Bit_Activo,
            Fec_Alta = @Fec_Alta,
            rendimiento_ideal = @rendimiento_ideal,
            litros_ideales = @litros_ideales,
            litros_iniciales = @litros_iniciales,
            litros_finales = @litros_finales,
            km_inicial = @km_inicial,
            km_final = @km_final,
            programacion = @programacion,
        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
           { name: 'rendimiento_ideal', value: item.rendimiento_ideal },
            { name: 'litros_ideales', value: item.litros_ideales },
            { name: 'litros_iniciales', value: item.litros_iniciales },
            { name: 'litros_finales', value: item.litros_finales },
            { name: 'km_inicial', value: item.km_inicial },
            { name: 'km_final', value: item.km_final },
            { name: 'programacion', value: item.programacion },
        ];

        const responce = await executeQuery(query, paramsList);

        console.log(responce);
        return {
            ok: true,
            res: responce,
        };
    } catch (error) {
        console.error("API Error:", error);
        return {
            ok: false,
            error: "Internal Server Error"
        };
    }
};
