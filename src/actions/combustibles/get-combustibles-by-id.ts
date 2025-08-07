'use server';

import { executeQuery } from "components/app/lib/connection";

export const getCombustiblesById = async ( id: string ) => {
    try {

        const query = `
        SELECT 
            v.*
        FROM 
            carga_diesel v
        `;

        const paramsList = [{ name: 'id', value: id }];
        const combustibles = await executeQuery(query, paramsList);

        console.log(combustibles)
        //return NextResponse.json(envios);
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

