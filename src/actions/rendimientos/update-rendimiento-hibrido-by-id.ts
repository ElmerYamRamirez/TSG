'use server';

import { executeQuery } from "components/app/lib/connection";
import { RendimientoHibrido } from "components/interfaces/rendimiento_hibrido";

export const updateRendimientoHibridoById = async (item: RendimientoHibrido) => {
    try {
        if (item.uniqueId === undefined) {
            throw new Error("uniqueId es obligatorio para actualizar un rendimiento.");
        }

        const query = `
        UPDATE reporte_rendimiento_hibrido
        SET 
            Km_Inicial = @Km_Inicial,
            Km_Final = @Km_Final,
            Porcentaje_Inicial_T1 = @Porcentaje_Inicial_T1,
            Porcentaje_Inicial_T2 = @Porcentaje_Inicial_T2,
            Porcentaje_Inicial_T3 = @Porcentaje_Inicial_T3,
            Porcentaje_Inicial_T4 = @Porcentaje_Inicial_T4,
            Porcentaje_Inicial_TG = @Porcentaje_Inicial_TG,
            Porcentaje_Final_T1 = @Porcentaje_Final_T1,
            Porcentaje_Final_T2 = @Porcentaje_Final_T2,
            Porcentaje_Final_T3 = @Porcentaje_Final_T3,
            Porcentaje_Final_T4 = @Porcentaje_Final_T4,
            Porcentaje_Final_TG = @Porcentaje_Final_TG,
            programacion = @programacion,
            precio_litro_gas = @precio_litro_gas,
            precio_litro_gasolina = @precio_litro_gasolina,
            Fec_Alta = @Fec_Alta
        WHERE uniqueId = @uniqueId;
        `;

        const paramsList = [
            { name: 'Km_Inicial', value: item.Km_Inicial ?? null},
            { name: 'Km_Final', value: item.Km_Final ?? null},
            { name: 'Porcentaje_Inicial_T1', value: item.Porcentaje_Inicial_T1 ?? null},
            { name: 'Porcentaje_Inicial_T2', value: item.Porcentaje_Inicial_T2 ?? null},
            { name: 'Porcentaje_Inicial_T3', value: item.Porcentaje_Inicial_T3 ?? null},
            { name: 'Porcentaje_Inicial_T4', value: item.Porcentaje_Inicial_T4 ?? null},
            { name: 'Porcentaje_Inicial_TG', value: item.Porcentaje_Inicial_TG ?? null},
            { name: 'Porcentaje_Final_T1', value: item.Porcentaje_Final_T1 ?? null},
            { name: 'Porcentaje_Final_T2', value: item.Porcentaje_Final_T2 ?? null},
            { name: 'Porcentaje_Final_T3', value: item.Porcentaje_Final_T3 ?? null},
            { name: 'Porcentaje_Final_T4', value: item.Porcentaje_Final_T4 ?? null},
            { name: 'Porcentaje_Final_TG', value: item.Porcentaje_Final_TG ?? null},
            { name: 'programacion', value: item.programacion },
            { name: 'precio_litro_gas', value: item.precio_litro_gas ?? null},
            { name: 'precio_litro_gasolina', value: item.precio_litro_gasolina ?? null},
            { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
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
