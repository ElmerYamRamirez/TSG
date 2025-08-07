'use server';

import { executeQuery } from "components/app/lib/connection";
import { ViaticoPlantilla } from "components/interfaces/viatico_plantilla";

export const createViaticoPlantilla = async ( item: ViaticoPlantilla ) => {
    try {

        const query = `
        INSERT INTO viaticos ( uniqueId, Bit_Activo, Fec_Alta, cantidad, nombre )
        VALUES(
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM viaticos),
            1,
            @fecha_alta,
            @cantidad,
            @nombre)
        `;

        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'cantidad', value: item.cantidad},
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