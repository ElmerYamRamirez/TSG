import { NextResponse } from "next/server";
import { executeQuery } from "../../../lib/connection";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "ID requerido" }, { status: 400 });
    }

    const query = `
      SELECT * FROM Prestamo
      WHERE Nombre = @id and Status in ('en vigor', 'pendiente') ORDER BY Fec_Alta DESC
    `;

    const prestamos = await executeQuery(query, [{ name: "id", value: id }]);

    if (!prestamos || prestamos.length === 0) {
      return NextResponse.json(
        { message: "Sueldo no encontrado" },
        { status: 200 }
      );
    }

    return NextResponse.json(prestamos);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
        { message: "ID de préstamo inválido" },
        { status: 400 }
      );
    }

    const { Saldo, Status, Numero_de_pagos } = body;

    if (Saldo === undefined || Status === undefined || Numero_de_pagos === undefined) {
      return NextResponse.json(
        { message: "Faltan datos en el cuerpo de la solicitud" },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Prestamo
      SET Saldo = @Saldo,
          Status = @Status,
          Numero_de_pagos = @Numero_de_pagos
      WHERE uniqueId = @id
    `;

    const result = await executeQuery(updateQuery, [
      { name: "Saldo", value: Saldo },
      { name: "Status", value: Status },
      { name: "Numero_de_pagos", value: Numero_de_pagos },
      { name: "id", value: id },
    ]);

    console.log("Update result:", result);

    return NextResponse.json(
      { success: true, message: "Préstamo actualizado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar préstamo" },
      { status: 500 }
    );
  }
}