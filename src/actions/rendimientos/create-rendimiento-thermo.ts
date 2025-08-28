"use server";

import { executeQuery } from "components/app/lib/connection";

import { RendimientoThermo } from "components/interfaces/rendimiento_thermo";

export const createRendimientoThermo = async (item: RendimientoThermo) => {
    try {
        const query = `
        INSERT INTO reporte_rendimiento_thermo (uniqueId, Bit_Activo, Fec_Alta, litros_iniciales, litros_finales, precio_litro_inicial, fecha_inicial, fecha_final, programacion)
        VALUES (
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM reporte_rendimiento_thermo),
            1,
            @Fec_Alta,
            @litros_iniciales,
            @litros_finales,
            @precio_litro_inicial,
            @fecha_inicial,
            @fecha_final,
            @programacion
        )
        `;

        const paramsList = [
            { name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
            { name: 'litros_iniciales', value: item.litros_iniciales ?? null},
            { name: 'litros_finales', value: item.litros_finales ?? null},
            { name: 'precio_litro_inicial', value: item.precio_litro_inicial ?? null},
            { name: 'fecha_inicial', value: item.fecha_inicial ?? null},
            { name: 'fecha_final', value: item.fecha_final ?? null},
            { name: 'programacion', value: item.programacion },
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