'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillasPagination = async (page: number, pageSize = 15, search = "") => {
    try {
        const offset = (page - 1) * pageSize;
        const paramsList = [
            { name: "search", value: `%${search}%` },
            { name: "offset", value: offset },
            { name: "pageSize", value: pageSize }
        ];

        const query = `
            SELECT 
                Nombre,
                Municipio,
                Folio,
                NombreDestino
            FROM Destino
            WHERE Nombre LIKE @search
            ORDER BY Folio
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY;
        `;

        const plantillas = await executeQuery(query, paramsList);

        return {
            ok: true,
            plantillas
        };

    } catch (error) {
        console.error("API Error:", error);
        return {
            ok: false,
            plantillas: [],
            error: "Internal Server Error"
        };
    }
}