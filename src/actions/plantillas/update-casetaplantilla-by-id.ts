'use server';

import { executeQuery } from "components/app/lib/connection";
import { CasetaPlantilla } from "components/interfaces/caseta_plantilla";

export const updateCasetaPlantillaById = async ( item: CasetaPlantilla ) => {
    try {

        const query = `
        UPDATE casetas
        SET nombre = @nombre, precio = @precio
        WHERE uniqueId = @id;
        `;

        const paramsList = [{ name: 'id', value: item.uniqueId },{ name: 'nombre', value: item.nombre },{ name:'precio', value: item.precio }];
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