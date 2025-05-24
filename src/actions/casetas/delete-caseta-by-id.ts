'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteCasetaById = async ( id: number ) => {
    try {

        let query = `
        DELETE FROM 
            programacion_casetas 
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const casetas = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        return {
            ok: true,
            casetas: casetas,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}