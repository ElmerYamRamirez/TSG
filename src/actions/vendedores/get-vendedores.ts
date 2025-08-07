'use server';

import { executeQuery } from "components/app/lib/connection";

export const getVendedores = async () => {
    try {
        const query = `
        SELECT 
            *
        FROM 
            vendedores
        ORDER BY 
            uniqueId DESC
        `;

        const vendedores = await executeQuery(query, []);

        return {
            ok: true,
            vendedores: vendedores,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}