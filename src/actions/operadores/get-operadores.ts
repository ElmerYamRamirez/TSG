'use server';

import { executeQuery } from "components/app/lib/connection";

export const getOperadores = async () => {
    try {
        const query = `
        SELECT 
            *
        FROM 
            Operador
        ORDER BY 
            uniqueId DESC
        `;

        const operadores = await executeQuery(query, []);

        return {
            ok: true,
            operadores: operadores,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}