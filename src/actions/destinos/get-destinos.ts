'use server';

import { executeQuery } from "components/app/lib/connection";

export const getDestinos = async () => {
    try {
        const query = `
        SELECT 
            uniqueId,
            Folio,
            Nombre,
            Municipio,
            NombreDestino
        FROM 
            Destino
        ORDER BY 
            Folio DESC
        `;

        const destinos = await executeQuery(query, []);

        return {
            ok: true,
            destinos: destinos,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}