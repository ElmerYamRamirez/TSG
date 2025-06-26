'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillaById = async (id: string) => {
    try {
        const paramsList = [{ name: "id", value: id }];

        const query = `
            SELECT 
                Nombre,
                Municipio,
                Folio,
                NombreDestino
            FROM Destino
            WHERE Folio = @id;
        `;
        const plantilla = await executeQuery(query, paramsList);

        return {
            ok: true,
            plantilla: plantilla[0] ?? null
        };
    } catch (error) {
        console.error("API Error:", error);
        return {
            ok: false,
            plantilla: null,
            error: "Internal Server Error"
        };
    }
}