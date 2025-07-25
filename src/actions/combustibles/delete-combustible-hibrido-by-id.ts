'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteCombustibleHibridoById = async ( id: number ) => {
    try {

        const query = `
        DELETE FROM 
            carga_hibrido
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const combustible_hibrido = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(combustible_hibrido);
        return {
            ok: true,
            combustible_hibrido: combustible_hibrido,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}