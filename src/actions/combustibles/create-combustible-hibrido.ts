'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleHibrido } from "components/interfaces/combustible_hibrido";

export const createCombustibleHibrido = async ( item: CombustibleHibrido ) => {
    try {

        const query = `
        INSERT INTO carga_hibrido ( uniqueId, Bit_Activo, Fec_Alta, Fecha_Carga, Litros_T1, Litros_T2, Litros_T3, Litros_T4, Litros_TG, programacion )
        VALUES(
            (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM carga_hibrido),
            1,
            @Fec_Alta,
            @Fecha_Carga,
            @Litros_T1,
            @Litros_T2,
            @Litros_T3,
            @Litros_T4,
            @Litros_TG,
            @programacion)
        `;

        const paramsList = [{ name: 'Fec_Alta', value: item.Fec_Alta = new Date().toISOString()},
                {name: 'Fecha_Carga', value: item.Fecha_Carga = new Date().toISOString()},
                {name: 'Litros_T1', value: item.Litros_T1},
                {name: 'Litros_T2', value: item.Litros_T2},
                {name: 'Litros_T3', value: item.Litros_T3},
                {name: 'Litros_T4', value: item.Litros_T4},
                {name: 'Litros_TG', value: item.Litros_TG},
                {name: 'programacion', value: item.programacion}];
                
                
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