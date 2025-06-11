'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleI } from "components/interfaces/combustibles";

export const createCombustible = async ( item: CombustibleI ) => {
    try {

        const now = new Date().toISOString();

        const query = `
        INSERT INTO carga_diesel ( uniqueId, Bit_Activo, Fec_Alta, fecha, litros, precio, precio_total, programacion, kilometraje_actual)
        VALUES (
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM carga_diesel),
    	    1,
            @fecha_alta,
            @fecha,
            @litros,
            @precioLitro,
            @total,
            @kilometraje,
            @tipo,
            
        )
        `;

        const paramsList = [
        { name: 'fecha_alta', value: item.Fec_Alta = new Date().toISOString()},
        { name: 'fecha', value: item.fecha },
        { name: 'litros', value: item.litros ?? null },
        { name: 'precioLitro', value: item.precioLitro ?? null },
        { name: 'total', value: item.total ?? null },
        { name: 'kilometraje', value: item.kilometraje },

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