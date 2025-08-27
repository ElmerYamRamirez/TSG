'use server';

import { executeQuery } from "components/app/lib/connection";
import { ThermoI } from "components/interfaces/thermo";

export const createThermo = async ( item: ThermoI ) => {
    try {

        const query = `
        INSERT INTO carga_thermo ( uniqueId, Bit_Activo, Fec_Alta, litros, precio_litro, total, fecha_inicio, Fecha_final, horas_uso_thermo, programacion )
        VALUES(
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM carga_thermo),
            1,
            @Fec_Alta,
            @litros,
            @precio_litro,
            @total,
            @fecha_inicio,
            @Fecha_final,
            @horas_uso_thermo,
            @programacion
            )
        `;

        const paramsList = [{ name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'litros', value: item.litros},
                {name: 'precio_litro', value: item.precio_litro},
                {name: 'total', value: item.total},
                {name: 'fecha_inicio', value: item.fecha_inicio},
                {name: 'Fecha_final', value: item.Fecha_final },
                {name: 'horas_uso_thermo', value: item.horas_uso_thermo},
                {name: 'programacion', value: item.programacion},
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