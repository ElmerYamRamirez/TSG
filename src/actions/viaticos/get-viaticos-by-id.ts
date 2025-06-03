'use server';

import { executeQuery } from "components/app/lib/connection";

export const getViaticosById = async ( id: string ) => {
    try {

        const query = `
        SELECT 
            v.*
        FROM 
            programacion_viaticos v
        `;

        const paramsList = [{ name: 'id', value: id }];
        const viaticos = await executeQuery(query, paramsList);

        console.log(viaticos)
        //return NextResponse.json(envios);
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

