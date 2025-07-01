'use server';

import { executeQuery } from "components/app/lib/connection";
import { checkViaticoPlantilla } from "components/interfaces/check_viatico";

export const checkViatico = async ( item: checkViaticoPlantilla ) => {
    try {

        const query = `
    INSERT INTO plantilla_viaticos ( uniqueId,Bit_Activo,Fec_Alta,descripcion,viaticos,destino,nombre)
     VALUES (
    (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM plantilla_viaticos),
    1,
    @fecha_alta,
    @viaticos,
    @destino,
    (SELECT nombre FROM destino WHERE id = @destino)
    )
    `;
        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'viaticos', value: item.viaticos},
                {name: 'destino', value: item.destino},
                { name: 'descripcion', value: item.descripcion ?? null }
            ];
                
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