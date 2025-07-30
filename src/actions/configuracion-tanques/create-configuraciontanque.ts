'use server';

import { executeQuery } from "components/app/lib/connection";
import { ConfiguracionTanquesI } from "components/interfaces/configuracion_tanques";

export const createConfiguracionTanques = async (item: ConfiguracionTanquesI ) => {
  try {
    const query = `INSERT INTO configuracion_tanques (uniqueId,Bit_Activo, Fec_Alta,litros_maximos_t1,litros_maximos_t2, litros_maximos_t3,litros_maximos_t4,litros_maximos_tg,unidad ) 
    VALUES (
        (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM configuracion_tanques),
        1,
        @Fec_Alta,
        @litros_maximos_t1,
        @litros_maximos_t2,
        @litros_maximos_t3,
        @litros_maximos_t4,
        @litros_maximos_tg,
        @unidad
      )
    `;

    const paramsList = [ { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
      { name: 'litros_maximos_t1', value: item.litros_maximos_t1 },
      { name: 'litros_maximos_t2', value: item.litros_maximos_t2 },
      { name: 'litros_maximos_t3', value: item.litros_maximos_t3 },
      { name: 'litros_maximos_t4', value: item.litros_maximos_t4 },
      { name: 'litros_maximos_tg', value: item.litros_maximos_tg },
      { name: 'unidad', value: item.unidad }];

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
};
