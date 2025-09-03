'use server';

import { executeQuery } from "components/app/lib/connection";
import { Prestamo } from "components/interfaces/prestamo";

export const deletePrestamoById = async (item: Prestamo) => {
    try {
        const query = `
        UPDATE Prestamo
        SET
            Bit_Activo = @Bit_Activo
        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: 0 },
            { name: 'uniqueId', value: item.uniqueId || null},
        ];

        const responce = await executeQuery(query, paramsList );

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
