'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleI } from "components/interfaces/combustibles";

export const updateCombustibleById = async (item: CombustibleI) => {
    try {
        const query = `
        UPDATE carga_diesel
        SET
            Bit_Activo = @Bit_Activo,
            Fec_Alta = @Fec_Alta,
            fecha = @fecha,
            litros = @litros,
            precio = @precio,
            precio_total = @precio_total,
            programacion = @programacion,
            comentario = @comentario
        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
            { name: 'fecha', value: item.fecha || new Date().toISOString() },
            { name: 'litros', value: item.litros },
            { name: 'precio', value: item.precio },
            { name: 'precio_total', value: item.precio_total },
            { name: 'programacion', value: item.programacion },
            { name: 'comentario', value: item.comentario },
            { name: 'uniqueId', value: item.uniqueId }
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
