"use server";

import { executeQuery } from "components/app/lib/connection";

import { RendimientoHibrido } from "components/interfaces/rendimiento_hibrido";

export const createRendimientoHibrido = async (item: RendimientoHibrido) => {
    try {
        const query = `
        INSERT INTO reporte_rendimiento_hibrido (uniqueId, Bit_Activo, Fec_Alta, Km_Inicial, Km_Final, Porcentaje_Inicial_T1, Porcentaje_Inicial_T2, Porcentaje_Inicial_T3, 
        Porcentaje_Inicial_T4, Porcentaje_Final_T1, Porcentaje_Final_T2, Porcentaje_Final_T3, Porcentaje_Final_T4, Porcentaje_Final_TG, programacion)
        VALUES (
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM reporte_rendimiento_hibrido),
            1,
            @Fec_Alta,
            @Km_Inicial, 
            @Km_Final,
            @Porcentaje_Inicial_T1,
            @Porcentaje_Inicial_T2,
            @Porcentaje_Inicial_T3,
            @Porcentaje_Inicial_T4,
            @Porcentaje_Final_T1,
            @Porcentaje_Final_T2,
            @Porcentaje_Final_T3,
            @Porcentaje_Final_T4,
            @Porcentaje_Final_TG,
            @programacion
        )
        `;

        const paramsList = [
            { name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
            { name: 'Km_Inicial', value: item.Km_Inicial ?? null},
            { name: 'Km_Final', value: item.Km_Final ?? null},
            { name: 'Porcentaje_Inicial_T1', value: item.Porcentaje_Inicial_T1 ?? null},
            { name: 'Porcentaje_Inicial_T2', value: item.Porcentaje_Inicial_T2 ?? null},
            { name: 'Porcentaje_Inicial_T3', value: item.Porcentaje_Inicial_T3 ?? null},
            { name: 'Porcentaje_Inicial_T4', value: item.Porcentaje_Inicial_T4 ?? null},
            { name: 'Porcentaje_Final_T1', value: item.Porcentaje_Final_T1 ?? null},
            { name: 'Porcentaje_Final_T2', value: item.Porcentaje_Final_T2 ?? null},
            { name: 'Porcentaje_Final_T3', value: item.Porcentaje_Final_T3 ?? null},
            { name: 'Porcentaje_Final_T4', value: item.Porcentaje_Final_T4 ?? null},
            { name: 'Porcentaje_Final_TG', value: item.Porcentaje_Final_TG ?? null},
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