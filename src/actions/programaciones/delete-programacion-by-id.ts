'use server';

import { executeQuery } from "components/app/lib/connection";
import { ProgramacionI } from "components/interfaces/programacion";

export const deleteProgramacionById = async (item: ProgramacionI) => {
    try {
        const query = `
        UPDATE Programacion_de_envio
        SET
            Bit_Activo = @Bit_Activo
        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: 0 },
            { name: 'uniqueId', value: item.uniqueId },
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
