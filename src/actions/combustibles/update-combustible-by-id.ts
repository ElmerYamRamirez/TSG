'use server';

import { executeQuery } from "components/app/lib/connection";
import { CombustibleI} from "components/interfaces/combustibles";

export const updateCombustibleById = async ( item: CombustibleI ) => {
    try {

        const query = `
        
        `;

        const paramsList = [{ name: 'id', value: item.uniqueId },{ name: 'fecha', value: item.fecha },{ name:'litros', value: item.litros}];
        const combustibles = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        return {
            ok: true,
            combustibles: combustibles,
        };
        
        
    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
          //  { message: "Internal Server Error" },
            //{ status: 500 }
        //);
    }
}