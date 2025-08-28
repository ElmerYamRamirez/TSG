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
            precio_litro_inicial = @precio_litro_inicial,
            fecha_inicial = @fecha_inicial,
            fecha_final = @fecha_final,
            programacion = @programacion 
        WHERE uniqueId = @uniqueId;
        `;

        const paramsList = [
            { name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
            { name: 'litros_iniciales', value: item.litros_iniciales ?? null},
            { name: 'litros_finales', value: item.litros_finales ?? null},
            { name: 'precio_litro_inicial', value: item.precio_litro_inicial ?? null},
            { name: 'fecha_inicial', value: item.fecha_inicial ?? null},
            { name: 'fecha_final', value: item.fecha_final ?? null},
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
