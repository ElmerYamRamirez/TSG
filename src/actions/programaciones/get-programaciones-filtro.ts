'use server';

import { executeQuery } from "components/app/lib/connection";

export const getProgramacionesFiltro = async (
  page: number,
  pageSize = 15,
  searchTerm = ""
) => {
  try {
    const offset = (page - 1) * pageSize;
    const search = `%${searchTerm.trim()}%`;
    const isDateSearch = /^\d{2}\/\d{2}\/\d{2}$/.test(searchTerm.trim());

    const paramsList = [
      { name: "offset", value: offset },
      { name: "pageSize", value: pageSize },
      { name: "searchTerm", value: search },
    ];

    let dateCondition = "";
    if (isDateSearch) {
      const [day, month, year] = searchTerm.trim().split('/');
      const isoDate = `20${year}-${month}-${day}`;
      dateCondition = `OR (PE.Fecha_programada >= '${isoDate}' AND PE.Fecha_programada < DATEADD(day, 1, '${isoDate}'))`;
    }

    const query = `
      SELECT 
          PE.*, 
          D.Nombre AS Nombre_destino,
          C.Nombre AS cliente_name,
          O.Nombre AS operador_name,
          U.Nombre AS unidad_name
      FROM 
          Programacion_de_envio PE
      LEFT JOIN 
          Destino D ON PE.Destino_de_la_unidad = D.uniqueId
      LEFT JOIN
          Cliente C ON PE.Cliente = C.uniqueId
      LEFT JOIN
          Operador O ON PE.Operador = O.uniqueId
      LEFT JOIN
            Unidad U ON PE.Unidad = U.uniqueId
      WHERE 
        (PE.folio LIKE @searchTerm
        OR D.Nombre LIKE @searchTerm
        OR C.Nombre LIKE @searchTerm
        OR O.Nombre LIKE @searchTerm
        ${dateCondition || `OR FORMAT(PE.Fecha_programada, 'dd/MM/yy') LIKE @searchTerm`})
        AND PE.Bit_Activo = 1
      ORDER BY 
        PE.Fecha_programada DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `;

    const programacion = await executeQuery(query, paramsList);

    return {
      ok: true,
      programaciones: programacion
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      programaciones: []
    };
  }
};