'use server';

import { executeQuery } from "components/app/lib/connection";

export const getClientes = async () => {
    try {
        const query = `
        SELECT 
            *
        FROM 
            Cliente
        ORDER BY 
            uniqueId DESC
        `;

        const clientes = await executeQuery(query, []);

        return {
            ok: true,
            clientes: clientes,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}