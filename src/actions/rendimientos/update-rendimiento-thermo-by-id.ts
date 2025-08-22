'use server';

import { executeQuery } from "components/app/lib/connection";
import { RendimientoThermo } from "components/interfaces/rendimiento_thermo";

export const updateRendimientoThermoById = async (item: RendimientoThermo) => {
    try {
        if (item.uniqueId === undefined) {
            throw new Error("uniqueId es obligatorio para actualizar un rendimiento.");
        }

        const query = `
        UPDATE reporte_rendimiento_thermo
        SET 
            Fec_Alta = @Fec_Alta,
            litros_iniciales = @litros_iniciales,
            litros_finales = @litros_finales,
            programacion = @programacion 
        WHERE uniqueId = @uniqueId;
        `;

        const paramsList = [
            { name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
            { name: 'litros_iniciales', value: item.litros_iniciales ?? null},
            { name: 'litros_finales', value: item.litros_finales ?? null},
            { name: 'programacion', value: item.programacion },
            { name: 'uniqueId', value: item.uniqueId },
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
