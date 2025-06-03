'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramacionesById = async (id:string) => {
    try {
        
        const paramsList = [{ name: "id", value: id }];

        const query = `
        SELECT 
            pe.*, 
            D.Nombre AS nombre_destino,
            c.Nombre AS cliente_name,
            o.Nombre AS operador_name
        FROM 
            Programacion_de_envio pe
        INNER JOIN 
            Destino D ON PE.Destino_de_la_unidad = D.uniqueId
        INNER JOIN
            Cliente c ON PE.Cliente = c.uniqueId
        INNER JOIN
            Operador o ON PE.Operador = o.uniqueId
        WHERE pe.uniqueId = @id;
        `;
        const programacion = await executeQuery(query, paramsList);

        const query2 = `
        SELECT *
        FROM programacion_viaticos p
        WHERE p.programacion = @id;
        `;
        const viaticos = await executeQuery(query2, paramsList);

        const query3 = `
        SELECT *
        FROM programacion_casetas p
        WHERE p.folio_programacion = @id;
        `;
        const casetas = await executeQuery(query3, paramsList);


        //return NextResponse.json(envios);
         return {
             ok: true,
             programacion: {
                 ...programacion[0],
                 viaticos,
                 casetas
             },
         };


    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}

