'use server';

import { executeQuery } from "components/app/lib/connection";
import { RendimientoHibrido } from "components/interfaces/rendimiento_hibrido";

export const getRendimientoHibridoByProgramacion = async (programacionId: number): Promise<RendimientoHibrido | null> => {
    try {
        const query = `
        SELECT TOP 1 *
        FROM reporte_rendimiento_hibrido
        WHERE programacion = @programacion
        `;

        const paramsList = [{ name: 'programacion', value: programacionId }];
        const result = await executeQuery(query, paramsList);

        if (result && result.length > 0) {
            return result[0] as RendimientoHibrido;
        }
        
        return null;
        
    } catch (error) {
        console.error("Error al obtener rendimiento:", error);
        return null;
    }
}