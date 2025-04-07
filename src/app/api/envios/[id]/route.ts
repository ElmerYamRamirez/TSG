import { NextResponse } from "next/server";
import { executeQuery } from "../../../lib/connection";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "ID requerido" }, { status: 400 });
    }

    let query = `
    SELECT 
        PE.*, 
        D.Nombre AS Nombre_destino
    FROM 
        Programacion_de_envio PE
    INNER JOIN 
        Destino D ON PE.Destino_de_la_unidad = D.uniqueId
    WHERE 
        PE.operador = @id
    `;

    const paramsList = [{ name: "id", value: id }];

    if (startDate && endDate) {
      query += " AND Fecha_programada BETWEEN @startDate AND @endDate";
      paramsList.push(
        { name: "startDate", value: startDate },
        { name: "endDate", value: endDate }
      );
    }

    query += " ORDER BY Fecha_programada, Hora_programada";

    const envios = await executeQuery(query, paramsList);

    return NextResponse.json(envios);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
