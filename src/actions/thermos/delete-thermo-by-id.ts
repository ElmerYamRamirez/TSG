'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteThermoById = async ( id: number ) => {
    try {

        const query = `
        DELETE FROM 
            carga_thermo
        WHERE
            uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: id }];
        const combustible_thermo = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(combustible_thermo);
        return {
            ok: true,
            combustible_thermo: combustible_thermo,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}