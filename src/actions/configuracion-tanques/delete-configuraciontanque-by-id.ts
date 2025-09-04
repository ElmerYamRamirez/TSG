'use server';

import { executeQuery } from "components/app/lib/connection";

export const deleteConfiguracionTanqueById = async (id: number) => {
    try {
        const query = `
        DELETE FROM configuracion_tanques
        WHERE uniqueId = @id;
`;

        const paramsList = [{ name: 'id', value: id }];
        const configuracion_tanques = await executeQuery(query, paramsList);

        //return NextResponse.json(envios);
        console.log(configuracion_tanques);
        return {
            ok: true,
            configuracionTanques: configuracion_tanques,
        };


    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}