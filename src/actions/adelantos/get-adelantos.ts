'use server';

import { executeQuery } from "components/app/lib/connection";

export const getAdelantos = async () => {
    try {

        //const paramsList = [{ id:"id"}];

        const query = `
        SELECT * 
        FROM Adelanto
        WHERE Status in ('en vigor', 'pendiente') AND Bit_Activo = 1
        `;

        const adelantos = await executeQuery(query, []);

        return {
            ok : true,
            adelantos : adelantos,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}