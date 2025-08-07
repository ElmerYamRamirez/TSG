'use server';

import { executeQuery } from "components/app/lib/connection";
import { checkCasetaPlantilla } from "components/interfaces/check_caseta";

export const checkCaseta = async ( item: checkCasetaPlantilla ) => {
    try {

        const query = `
        INSERT INTO plantilla_casetas ( uniqueId, Bit_Activo, Fec_Alta, caseta, destino )
        VALUES(
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM plantilla_casetas),
            1,
            @fecha_alta,
            @caseta,
            @destino)
        `;

        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'caseta', value: item.caseta},
                {name: 'destino', value: item.destino}];
                
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