'use server';

import { executeQuery } from "components/app/lib/connection";
import { CasetaI } from "components/interfaces/caseta";

export const createCaseta = async ( item: CasetaI ) => {
    try {

        const query = `
        INSERT INTO programacion_casetas ( uniqueId, Bit_Activo, Fec_Alta, folio_programacion, precio, nombre )
	    VALUES(
    	    (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM programacion_casetas),
    	    1,
    	    @fecha_alta,
    	    @folio_programacion,
    	    @precio,
    	    @nombre)
        `;

        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'folio_programacion', value: item.folio_programacion},
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