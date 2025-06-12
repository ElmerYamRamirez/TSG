'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteCombustibleById = async ( id: number ) => {
    try {

        const query = `
        DELETE FROM 
            carga_diesel
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const combustibles = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(combustibles);
        return {
            ok: true,
            combustibles: combustibles,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}