import { NextResponse, NextRequest } from "next/server";
import { sql, poolPromise } from "components/app/lib/connection";

//Funcion para guardar nominas
/* Uso: POST /nominas */
export async function POST(req: NextRequest) {
    const pool = await poolPromise;
    const body = await req.json()

    const {
        operador,
        fecha_inicio,
        fecha_final,
        fecha_generada,
        total_deducciones,
        total_percepciones,
        total_neto,
        deducciones = [],
        percepciones = [],
        prestamo_pagos = [],
        nomina_prestamos = [],
        envios = []
    } = body;

    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        const uniqueIdNomina = await request.query('SELECT MAX(uniqueId) AS id FROM nomina');
        const uniqueIdPercepciones = await request.query('SELECT MAX(uniqueId) AS id FROM nomina_percepciones');
        const uniqueIdDeducciones = await request.query('SELECT MAX(uniqueId) AS id FROM nomina_deducciones');
        const uniqueIdPrestamoPagos = await request.query('SELECT MAX(uniqueId) AS id FROM prestamo_pagos');
        const lastUniqueNominaPrestamos = await request.query('SELECT MAX(uniqueId) as id FROM nomina_prestamo')

        const nominaInsert = await request
            .input('uniqueId', sql.Int, (uniqueIdNomina.recordset[0].id + 1))
            .input('Bit_Activo', sql.Int, 1)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_final', sql.Date, fecha_final)
            .input('fecha_generada', sql.Date, fecha_generada)
            .input('operador', sql.Int, operador)
            .input('total_deducciones', sql.Decimal(10, 2), total_deducciones)
            .input('total_percepciones', sql.Decimal(10, 2), total_percepciones)
            .input('total_neto', sql.Decimal(10, 2), total_neto)
            .query(`
        INSERT INTO nomina (
          uniqueId, Bit_Activo,
          fecha_inicio, fecha_final, fecha_generada,
          operador, total_deducciones, total_percepciones, total_neto
        )
        OUTPUT INSERTED.uniqueId
        VALUES (
          @uniqueId, @Bit_Activo,
          @fecha_inicio, @fecha_final, @fecha_generada,
          @operador, @total_deducciones, @total_percepciones, @total_neto
        )
      `);

        const idNomina = nominaInsert.recordset[0].uniqueId;
        let idDeducciones = uniqueIdDeducciones.recordset[0].id;
        let idPercepciones = uniqueIdPercepciones.recordset[0].id;
        let idPrestamoPagos = uniqueIdPrestamoPagos.recordset[0].id;
        let idNominaPrestamos = lastUniqueNominaPrestamos.recordset[0].id;

        for (const deduccion of deducciones) {
            await new sql.Request(transaction)
                .input('uniqueId', sql.Int, (idDeducciones =  (idDeducciones + 1)))
                .input('Bit_Activo', sql.Int, 1)
                .input('nomina', sql.Int, idNomina)
                .input('nombre', sql.VarChar, deduccion.nombre)
                .input('monto', sql.Decimal(10, 2), deduccion.monto)
                .query(`
          INSERT INTO nomina_deducciones ( uniqueId, Bit_Activo, nomina, nombre, monto)
          VALUES (@uniqueId, @Bit_Activo, @nomina, @nombre, @monto)
        `);
        }

        for (const percepcion of percepciones) {
            await new sql.Request(transaction)
                .input('uniqueId', sql.Int, (idPercepciones = (idPercepciones + 1)))
                .input('Bit_Activo', sql.Int, 1)
                .input('nomina', sql.Int, idNomina)
                .input('nombre', sql.VarChar, percepcion.nombre)
                .input('monto', sql.Decimal(10, 2), percepcion.monto)
                .query(`
          INSERT INTO nomina_percepciones (uniqueId, Bit_Activo, nomina, nombre, monto)
          VALUES (@uniqueId, @Bit_Activo,@nomina, @nombre, @monto)
        `);
        }

        for (const pagos of prestamo_pagos) {
            await new sql.Request(transaction)
                .input('uniqueId', sql.Int, (idPrestamoPagos = (idPrestamoPagos + 1)))
                .input('Bit_Activo', sql.Int, 1)
                .input('nomina', sql.Int, idNomina)
                .input('saldo', sql.Decimal(10, 2), pagos.saldo)
                .input('fecha', sql.Date, pagos.fecha)
                .input('numero_pago', sql.VarChar, pagos.numero_pago)
                .input('status', sql.VarChar, pagos.status)
                .input('prestamo', sql.Int, pagos.prestamo)
                .query(`
          INSERT INTO prestamo_pagos (uniqueId, Bit_Activo, nomina, saldo, fecha, numero_pago, status, prestamo)
          VALUES (@uniqueId, @Bit_Activo, @nomina, @saldo, @fecha, @numero_pago, @status, @prestamo)
        `);
        }

        for (const nomina_prestamo of nomina_prestamos) {
            await new sql.Request(transaction)
                .input('uniqueId', sql.Int, (idNominaPrestamos = (idNominaPrestamos + 1)))
                .input('Bit_Activo', sql.Int, 1)
                .input('nomina', sql.Int, idNomina)
                .input('prestamo', sql.Int, nomina_prestamo.prestamo)
                .query(`
          INSERT INTO nomina_prestamo (uniqueId, Bit_Activo, nomina, prestamo)
          VALUES (@uniqueId, @Bit_Activo, @nomina, @prestamo)
        `);
        }

        for (const envio of envios) {
            await new sql.Request(transaction)
            .input('nomina', sql.Int, idNomina)
            .input('uniqueId', sql.Int, envio.uniqueId)
            .query('UPDATE Programacion_de_envio SET nomina = @nomina WHERE uniqueId = @uniqueId ');
        }

        await transaction.commit();
        return NextResponse.json({ message: 'Nómina creada con éxito', idNomina }, { status: 201 });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return NextResponse.json({ error: 'Error al crear la nomina' }, { status: 500 })
    }
}


/* export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const nombre = searchParams.get('nombre');
    const fecha = searchParams.get('fecha');

    const pool = await poolPromise;

    let query = `
      SELECT n.*, o.nombre as operador_nombre, td.nombre AS deduccion_nombre, td.monto AS deduccion_monto
      FROM nomina n
      JOIN operador o ON o.id = n.id_operador
      LEFT JOIN ticket_deducciones td ON td.idNomina = n.id
      WHERE 1=1
    `;
    if (id) {
        query += ` AND n.id = ${id}`;
    }
    if (nombre) {
        query += ` AND o.nombre LIKE '%${nombre}%'`;
    }
    if (fecha) {
        query += ` AND CAST(n.fecha_inicio AS DATE) <= '${fecha}' AND CAST(n.fecha_final AS DATE) >= '${fecha}'`;
    }

    try {
        const result = await pool.request().query(query);

        const nominasMap = {};
        for (const row of result.recordset) {
            if (!nominasMap[row.id]) {
                nominasMap[row.id] = {
                    id: row.id,
                    id_operador: row.id_operador,
                    operador_nombre: row.operador_nombre,
                    fecha_inicio: row.fecha_inicio,
                    fecha_final: row.fecha_final,
                    fecha_generada: row.fecha_generada,
                    id_pagosPrestamo: row.id_pagosPrestamo,
                    status_prestamo: row.status_prestamo,
                    total_deducciones: row.total_deducciones,
                    total_percepciones: row.total_percepciones,
                    total_neto: row.total_neto,
                    deducciones: []
                };
            }
            if (row.deduccion_nombre) {
                nominasMap[row.id].deducciones.push({
                    nombre: row.deduccion_nombre,
                    monto: row.deduccion_monto
                });
            }
        }

        return NextResponse.json(Object.values(nominasMap));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al obtener las nóminas' }, { status: 500 });
    }
}*/