'use server';

import { executeQuery } from "components/app/lib/connection";

export const getThermoById = async ( id: string ) => {
    try {
        const paramsList = [{ name: 'id', value: id }];

        const query = `
        SELECT *
        FROM carga_thermo c
        WHERE c.programacion = @id;
        `;

        const thermos = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        return {
            ok: true,
            thermos: thermos,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}
