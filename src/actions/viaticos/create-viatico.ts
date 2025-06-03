'use server';

import { executeQuery } from "components/app/lib/connection";
import { Viatico } from "components/interfaces/viaticos";

export const createViatico = async ( item: Viatico ) => {
    try {

        const query = `
        INSERT INTO programacion_viaticos ( uniqueId, Bit_Activo, Fec_Alta, cantidad, programacion, concepto )
	    VALUES(
    	    (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM programacion_viaticos),
    	    1,
    	    @fecha_alta,
    	    @monto,
    	    @programacion,
    	    @concepto)
        `;

        const paramsList = [{ name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'monto', value: item.cantidad},
                {name: 'programacion', value: item.programacion},
                {name: 'concepto', value: item.concepto}];
                
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