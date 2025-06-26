'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillas = async () => {
    try {
        let query = `
        SELECT 
            Folio,
            Nombre,
            Municipio,
            NombreDestino
        FROM 
            Plantillas
        ORDER BY 
            Folio DESC
        `;

        const plantillas = await executeQuery(query, []);

        return {
            ok: true,
            plantillas: plantillas,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}