'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleI } from "components/interfaces/combustibles";

export const createCombustible = async ( item: CombustibleI ) => {
    try {

        const query = `
        INSERT INTO carga_diesel ( uniqueId, Bit_Activo, Fec_Alta, fecha, litros, precio, precio_total, programacion, comentario )
        VALUES(
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM carga_diesel),
            1,
            @Fec_Alta,
            @fecha,
            @litros,
            @precio,
            @precio_total,
            @programacion,
            @comentario)
        `;

        const paramsList = [{ name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'fecha', value: item.fecha = new Date().toISOString()},
                {name: 'litros', value: item.litros},
                {name: 'precio', value: item.precio},
                {name: 'precio_total', value: item.precio_total},
                {name: 'programacion', value: item.programacion},
                {name: 'comentario', value: item.comentario}];
                
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