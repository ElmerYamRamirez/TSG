'use server';

import { executeQuery } from "components/app/lib/connection";
import { Sueldo } from "components/interfaces/sueldo";

export const getSueldoById = async (codigoId: number): Promise<Sueldo | null> => {
    try {
        const query = `
        SELECT TOP 1 *
        FROM Sueldos
        WHERE codigo = @codigo
        `;

        const paramsList = [{ name: 'codigo', value: codigoId }];
        const result = await executeQuery(query, paramsList);

        if (result && result.length > 0) {
            return result[0] as Sueldo;
        }
        
        return null;
        
    } catch (error) {
        console.error("Error al obtener rendimiento:", error);
        return null;
    }
}