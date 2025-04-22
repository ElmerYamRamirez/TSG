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

    const adelantos = await executeQuery(
      'SELECT * FROM Adelanto WHERE nombre = @id and Status = \'pendiente\' ORDER BY Fec_Alta DESC', 
      [{ name: 'id', value: id }]
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

    console.log('PUT Request - ID:', id, 'Body:', body);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'ID de adelanto inválido' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Adelanto
      SET Status = 'DESCONTADO'
      WHERE uniqueId = @id
    `;

    const result = await executeQuery(updateQuery, [
      { name: 'id', value: id }
    ]);

    console.log('Update result:', result);

    return NextResponse.json(
      { success: true, message: 'Adelanto actualizado' },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar adelanto' },
      { status: 500 }
    );
  }
}