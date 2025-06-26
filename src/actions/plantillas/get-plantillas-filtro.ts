'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillasFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const search = `%${searchTerm.trim()}%`;

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
      { name: "searchTerm", value: search },
    ];

    const query = `
      SELECT 
        P.Folio,
        P.Nombre,
        P.Municipio,
        P.NombreDestino
      FROM 
        Plantillas P
      WHERE 
        P.Folio LIKE @searchTerm
        OR P.Nombre LIKE @searchTerm
        OR P.Municipio LIKE @searchTerm
        OR P.NombreDestino LIKE @searchTerm
      ORDER BY 
        P.Folio DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const plantillas = await executeQuery(query, paramsList);

    return {
      ok: true,
      plantillas: plantillas
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      plantillas: []
    };
  }
};