'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramacionesByWeek = async (startDate: string, endDate: string) => {
    try {
        
        const paramsList = [{ name: "startDate", value: startDate },{ name: "endDate", value: endDate }];

        const query = `
        SELECT 
            PE.uniqueId,
            PE.Sueldo,
            PE.Operador
        FROM 
            Programacion_de_envio PE
            WHERE Bit_Activo = 1 AND Fecha_programada BETWEEN @startDate AND @endDate`;

        const envios = await executeQuery(query, paramsList);

         return {
            ok: true,
            programacion: envios
        };

    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}

