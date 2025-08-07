import { type NextRequest, NextResponse  } from 'next/server'
import { poolPromise } from 'components/app/lib/connection';

const ALLOWED_TABLES = ['nomina', 'adelanto', 'prestamo']; // por seguridad
 
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const table = searchParams.get('obj')

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json(
      { error: "Tabla no válida" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(` SELECT MAX(uniqueId) as folio FROM ${table}`);
    console.log(result);
    const folio = result.recordset[0]?.folio ?? 0;

    return NextResponse.json({ folio });
  } catch (error) {
    console.error('Error al obtener el folio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}