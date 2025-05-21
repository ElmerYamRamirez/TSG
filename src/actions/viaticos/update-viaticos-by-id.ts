'use server';

import { executeQuery } from "components/app/lib/connection";

export const updateViaticosById = async ( item: any ) => {
    try {

        let query = `
        UPDATE programacion_viaticos
        SET concepto = @concepto, cantidad = @cantidad            
        WHERE uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: item.uniqueId },{ name: 'concepto', value: item.concepto },{ name:'cantidad', value: item.cantidad }];
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