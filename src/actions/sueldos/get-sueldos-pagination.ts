'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosPagination = async (page: number, pageSize = 15) => {
    try {
        const offset = (page - 1) * pageSize;
        const paramsList = [{ name: "offset", value: offset }, { name: "pageSize", value: pageSize }];

        const query = `
        SELECT 
            su.*
        FROM 
            Sueldos su
        WHERE 
            su.Bit_Activo = 1
        ORDER BY su.uniqueId DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY;
        `;

        const [sueldos] = await Promise.all([
            executeQuery(query, paramsList)
        ]);
        return {
            ok: true,
            sueldos: sueldos,
        };


    } catch (error) {
        console.error("API Error:", error);
        //return NextResponse.json(
        //  { message: "Internal Server Error" },
        //{ status: 500 }
        //);
    }
}

