'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleHibrido } from "components/interfaces/combustible_hibrido";

export const updateCombustibleHibridoById = async (item: CombustibleHibrido) => {
    try {
        const query = `
        UPDATE carga_hibrido
        SET
            Bit_Activo = @Bit_Activo,
            Fec_Alta = @Fec_Alta,
            Fecha_Carga = @Fecha_Carga,
            Litros_T1 = @Litros_T1,
            Litros_T2 = @Litros_T2,
            Litros_T3 = @Litros_T3,
            Litros_T4 = @Litros_T4,
            Litros_TG = @Litros_TG,
            programacion = @programacion,
            precio_litro_gas = @precio_litro_gas,
            precio_litro_gasolina = @precio_litro_gasolina

        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
            { name: 'Fecha_Carga', value: item.Fecha_Carga || new Date().toISOString() },
            { name: 'Litros_T1', value: item.Litros_T1},
            { name: 'Litros_T2', value: item.Litros_T2},
            { name: 'Litros_T3', value: item.Litros_T3},
            { name: 'Litros_T4', value: item.Litros_T4},
            { name: 'Litros_TG', value: item.Litros_TG},
            { name: 'programacion', value: item.programacion},
            { name: 'precio_litro_gas', value: item.precio_litro_gas},
            { name: 'precio_litro_gasolina', value: item.precio_litro_gasolina},
            { name: 'uniqueId', value: item.uniqueId }];

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