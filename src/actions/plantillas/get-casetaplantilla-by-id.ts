'use server';

import { executeQuery } from "components/app/lib/connection";

export const getCasetaPlantillaById = async ( id: string ) => {
    try {

        const query = `
        SELECT 
            v.*
        FROM 
            casetas v
        `;

        const paramsList = [{ name: 'id', value: id }];
        const casetas = await executeQuery(query, paramsList);

        console.log(casetas)
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

