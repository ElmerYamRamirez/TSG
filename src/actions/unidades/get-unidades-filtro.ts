'use server';

import { executeQuery } from "components/app/lib/connection";

export const getUnidadesFiltro = async (
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
      SELECT  u.*
      FROM  Unidad u
      WHERE 
        u.Nombre LIKE @searchTerm
        OR u.Marca LIKE @searchTerm
        OR u.Modelo LIKE @searchTerm
        OR u.Placa LIKE @searchTerm
      ORDER BY 
        u.Nombre
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const unidades = await executeQuery(query, paramsList);

    return {
      ok: true,
      unidades
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      unidades: []
    };
  }
};
