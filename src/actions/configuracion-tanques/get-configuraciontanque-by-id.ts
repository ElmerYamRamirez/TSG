'use server';
import { executeQuery } from "components/app/lib/connection";

export const getConfiguracionTanquesById = async (id: number) => {
    try {
        const query = `
        SELECT *
        FROM configuracion_tanques
        WHERE uniqueId = @id
        `;
        const paramsList = [{ name: 'id', value: id }];
        const configuracionTanques = await executeQuery(query, paramsList)

        console.log(configuracionTanques);
        return {
            ok: true,
            configuracionTanques: configuracionTanques,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
};
