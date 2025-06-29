'use server';

import { executeQuery } from "components/app/lib/connection";
import { CasetaPlantilla } from "components/interfaces/caseta_plantilla";

export const createCasetaPlantilla = async ( item: CasetaPlantilla ) => {
    try {

        const query = `
        INSERT INTO casetas ( uniqueId, Bit_Activo, Fec_Alta, precio, nombre )
	    VALUES(
    	    (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM casetas),
    	    1,
    	    @fecha_alta,
    	    @precio,
    	    @nombre)
        `;

        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'precio', value: item.precio},
                {name: 'nombre', value: item.nombre}];
                
        const responce = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(responce);
        return {
            ok: true,
            res: responce,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}