'use server';

import { executeQuery } from "components/app/lib/connection";

export const getReporteHibridoFiltro = async (
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
    RH.*,
    D.NombreDestino AS rutaNombre,
    U.Nombre AS unidadNombre
FROM PC_Rep_ReporteHibrido RH
LEFT JOIN Destino D ON RH.ruta = D.NombreDestino
LEFT JOIN Unidad U ON RH.unidad = U.Nombre
WHERE
    (D.NombreDestino LIKE @searchTerm OR U.Nombre LIKE @searchTerm)
ORDER BY
    RH.uniqueId DESC
OFFSET @offset ROWS
FETCH NEXT @pageSize ROWS ONLY;
`;


    const reportes = await executeQuery(query, paramsList);

    return {
      ok: true,
      rendimientos: reportes
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      rendimientos: []
    };
  }
};
