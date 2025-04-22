import { NextResponse } from "next/server";
import { executeQuery } from '../../../lib/connection';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: 'ID requerido' },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM Sueldos 
      WHERE empleado = @id
    `;
    const paramsList = [{ name: 'id', value: id }];

    const sueldo = await executeQuery(query, paramsList);

    if (!sueldo || sueldo.length === 0) {
        return NextResponse.json(
          { message: 'Sueldo no encontrado' },
          { status: 200 }
        );
    }

    return NextResponse.json(sueldo[0]);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}