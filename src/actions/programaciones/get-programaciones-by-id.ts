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
            o.Nombre AS operador_name,
            u.Nombre AS unidad_name,
            u.combustible AS combustible
        FROM 
            Programacion_de_envio pe
        INNER JOIN 
            Destino D ON PE.Destino_de_la_unidad = D.uniqueId
        INNER JOIN
            Cliente c ON PE.Cliente = c.uniqueId
        INNER JOIN
            Operador o ON PE.Operador = o.uniqueId
        INNER JOIN
            Unidad u ON PE.Unidad = u.uniqueId
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

        const query4 = `
        SELECT *
        FROM carga_diesel c
        WHERE c.programacion = @id;
        `;
        const combustibles = await executeQuery(query4, paramsList);

        const query5 = `
        SELECT 
            rep.*
        FROM 
            PC_Rep_RendimientosNew rep
        WHERE 
            rep.uniqueId = @id
        `;
        const reporte = await executeQuery(query5, paramsList);

        //return NextResponse.json(envios);
         return {
            ok: true,
           programacion: {
            ...programacion[0],
            viaticos,
            casetas,
            combustibles,
            reporte: {
                ...reporte[0],
            },
            }

            };

    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}

