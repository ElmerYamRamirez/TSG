'use server';

import { executeQuery } from "components/app/lib/connection";

export const getCombustibleHibridoById = async ( id: string ) => {
    try {
        const paramsList = [{ name: 'id', value: id }];

        const query = `
        SELECT *
        FROM carga_hibrido c
        WHERE c.programacion = @id;
        `;

        const combustible_hibrido = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
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
