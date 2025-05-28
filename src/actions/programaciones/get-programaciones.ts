'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramaciones = async () => {
    try {

        /* Parametros para obtener por Id y fecha
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "ID requerido" }, { status: 400 });
        }
        */

        let query = `
        SELECT 
            PE.*, 
            D.Nombre AS Nombre_destino,
            c.Nombre AS cliente_name,
            o.Nombre AS operador_name
        FROM 
            Programacion_de_envio PE
        INNER JOIN 
            Destino D ON PE.Destino_de_la_unidad = D.uniqueId
        INNER JOIN
            Cliente c ON PE.Cliente = c.uniqueId
        INNER JOIN
            Operador o ON PE.Operador = o.uniqueId
        `;

        const paramsList = [{ name: "id", value: 1 }];

        query += " ORDER BY Fecha_programada, Hora_programada";

        const programaciones = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        return {
            ok: true,
            programaciones: programaciones,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}

