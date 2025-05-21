'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteViaticosById = async ( id: number ) => {
    try {

        let query = `
        DELETE FROM 
            programacion_viaticos 
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const viaticos = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(viaticos);
        return {
            ok: true,
            viaticos: viaticos,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}