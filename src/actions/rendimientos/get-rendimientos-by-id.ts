'use server';

import { executeQuery } from "components/app/lib/connection";
import { Rendimiento } from "components/interfaces/rendimientos";

export const getRendimientoByProgramacion = async (programacionId: number): Promise<Rendimiento | null> => {
    try {
        const query = `
        SELECT TOP 1 *
        FROM reporte_rendimiento
        WHERE programacion = @programacion
        `;

        const paramsList = [{ name: 'programacion', value: programacionId }];
        const result = await executeQuery(query, paramsList);

        // Asumimos que executeQuery devuelve un array de resultados
        if (result && result.length > 0) {
            return result[0] as Rendimiento;
        }
        
        return null;
        
    } catch (error) {
        console.error("Error al obtener rendimiento:", error);
        return null;
    }
}