'use server';

import { executeQuery } from "components/app/lib/connection";

export const updateViaticosById = async ( id: string ) => {
    try {

        let query = `
        UPDATE 
            programacion_viaticos
        SET 
            column1 = value1, column2 = value2, ... 
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const viaticos = await executeQuery(query, paramsList);

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