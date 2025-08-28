import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from '../../../lib/connection';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } =  await params;

    if (!id) {
      return NextResponse.json(
        { message: 'ID requerido' },
        { status: 400 }
      );
    }

    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diasHastaViernes = (5 - diaSemana + 7) % 7;
    const fechaFinCorte = new Date(hoy);
    fechaFinCorte.setDate(hoy.getDate() + diasHastaViernes);
    const fechaFinCorteStr = fechaFinCorte.toISOString().split("T")[0];

    await executeQuery(
      `UPDATE Adelanto
       SET Status = 'DESCONTADO'
       WHERE nombre = @id
         AND Status = 'PENDIENTE'
         AND Fecha_Finalizacion IS NOT NULL
         AND Fecha_Finalizacion <= @FechaFinCorte`,
      [
        { name: "id", value: id },
        { name: "FechaFinCorte", value: fechaFinCorteStr }
      ]
    );

    const adelantos = await executeQuery(
      `SELECT *
       FROM Adelanto
       WHERE nombre = @id
         AND Status IN ('PENDIENTE', 'RECURRENTE')
       ORDER BY Fec_Alta DESC`,
      [{ name: "id", value: id }]
    );

    if (!adelantos || adelantos.length === 0) {
      return NextResponse.json(
        { message: 'Adelanto no encontrado' },
        { status: 200 }
      );
    }

    return NextResponse.json(adelantos);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("PUT Request - ID:", id, "Body:", body);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: "ID de adelanto inválido" },
        { status: 400 }
      );
    }

    const fechaActual = new Date(); // Se puede usar new Date().toISOString() si quieren UTC

    const updateQuery = `
      UPDATE Adelanto
      SET 
          Total_Actual = ISNULL(Total_Actual, 0) + Cantidad,
          Status = CASE 
                      WHEN Fecha_Finalizacion <= @fechaActual THEN 'DESCONTADO' 
                      ELSE Status 
                  END
      WHERE uniqueId = @id;
    `;

    const result = await executeQuery(updateQuery, [
      { name: "id", value: id },
      { name: "fechaActual", value: fechaActual },
    ]);

    console.log("Update result:", result);

    return NextResponse.json(
      { success: true, message: "Adelanto descontado y Total_Actual actualizado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar adelanto" },
      { status: 500 }
    );
  }
}
