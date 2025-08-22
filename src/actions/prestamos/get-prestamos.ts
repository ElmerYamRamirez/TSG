'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPrestamos = async () => {
    try {

        //const paramsList = [{ id:"id"}];

        const query = `
        SELECT * 
        FROM Prestamo
        WHERE Status in ('en vigor', 'pendiente') AND Bit_Activo = 1
        `;

        const prestamos = await executeQuery(query, []);

        return {
            ok: true,
            prestamos: prestamos,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}