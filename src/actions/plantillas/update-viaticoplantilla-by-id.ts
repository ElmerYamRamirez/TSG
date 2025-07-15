'use server';

import { executeQuery } from "components/app/lib/connection";
import { ViaticoPlantilla } from "components/interfaces/viatico_plantilla";

export const updateViaticoPlantillaById = async ( item: ViaticoPlantilla ) => {
    try {

        const query = `
        UPDATE viaticos
        SET nombre = @nombre, cantidad = @cantidad
        WHERE uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: item.uniqueId },{ name: 'nombre', value: item.nombre },{ name:'cantidad', value: item.cantidad }];
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