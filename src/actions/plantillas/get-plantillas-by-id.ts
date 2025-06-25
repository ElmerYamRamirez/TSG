'use server';
import { executeQuery } from "components/app/lib/connection";

export async function getDestinoPagination(page: number, pageSize: number, search: string) {
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT 
      Nombre,
      Municipio,
      Folio,
      NombreDestino
    FROM Destino
    WHERE Nombre LIKE @search
    ORDER BY Folio
    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
  `;
  const values = [
    { name: "search", value: `%${search}%` },
    { name: "pageSize", value: pageSize },
    { name: "offset", value: offset }
  ];
  const destinos = await executeQuery(query, values);

  return {
    ok: true,
    destinos,
  };
}