'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosFiltro = async (
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
          Su.*,
          O.Nombre AS operador_name
      FROM 
          Sueldos Su
      LEFT JOIN 
          Operador O ON Su.Empleado = O.uniqueId
      WHERE 
          (
            CAST(Su.codigo AS VARCHAR) LIKE @searchTerm
            OR CAST(Su.Empleado AS VARCHAR) LIKE @searchTerm
            OR O.Nombre LIKE @searchTerm
          )
          AND Su.Bit_Activo = 1
      ORDER BY Su.Fec_Alta DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      sueldos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      sueldos: []
    };
  }
};
