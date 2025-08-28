'use server';

import { executeQuery } from "components/app/lib/connection";
import { RendimientoThermo } from "components/interfaces/rendimiento_thermo";

export const getRendimientoThermoByProgramacion = async (programacionId: number): Promise<RendimientoThermo | null> => {
    try {
        const query = `
        SELECT TOP 1 *
        FROM reporte_rendimiento_thermo
        WHERE programacion = @programacion
        `;

        const paramsList = [{ name: 'programacion', value: programacionId }];
        const result = await executeQuery(query, paramsList);

        if (result && result.length > 0) {
            return result[0] as RendimientoThermo;
        }
        
        return null;
        
    } catch (error) {
        console.error("Error al obtener rendimiento:", error);
        return null;
    }
}