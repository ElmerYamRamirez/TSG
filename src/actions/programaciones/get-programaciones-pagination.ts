'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramacionesPagination = async (page: number, pageSize = 15) => {
    try {
        const offset = (page - 1) * pageSize;
        const paramsList = [{ name: "offset", value: offset }, { name: "pageSize", value: pageSize }];

        const query = `
        SELECT 
            PE.*, 
            D.Nombre AS Nombre_destino,
            C.Nombre AS cliente_name,
            O.Nombre AS operador_name
        FROM 
            Programacion_de_envio PE
        INNER JOIN 
            Destino D ON PE.Destino_de_la_unidad = D.uniqueId
        INNER JOIN
            Cliente C ON PE.Cliente = C.uniqueId
        INNER JOIN
            Operador O ON PE.Operador = O.uniqueId
        ORDER BY PE.Fecha_programada DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY;
        `;

        const programacion = await executeQuery(query, paramsList);


        //return NextResponse.json(envios);
        console.log(JSON.stringify(programacion));
        return {
            ok: true,
            programaciones: programacion
        };


    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}

