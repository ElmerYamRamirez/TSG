'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramacionesById = async (id:string) => {
    try {
        
        const paramsList = [{ name: "id", value: id }];

        let query = `
        SELECT *
        FROM Programacion_de_envio p
        WHERE p.uniqueId = @id;
        `;
        const programacion = await executeQuery(query, paramsList);

        let query2 = `
        SELECT *
        FROM programacion_viaticos p
        WHERE p.programacion = @id;
        `;
        const viaticos = await executeQuery(query2, paramsList);

        let query3 = `
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

