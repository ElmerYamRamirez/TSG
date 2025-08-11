'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = "",
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
          su.*
      FROM 
          Sueldos su
      LEFT JOIN
          Operador O ON su.Empleado = O.uniqueId
      WHERE 
        ( O.Nombre LIKE @searchTerm
        )
        AND su.Bit_Activo = 1
      ORDER BY 
        su.uniqueId DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const sueldos = await executeQuery(query, paramsList);

    return {
      ok: true,
      sueldos: sueldos
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      programaciones: []
    };
  }
};