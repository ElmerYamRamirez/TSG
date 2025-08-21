'use server';

import { executeQuery } from "components/app/lib/connection";
import { Adelanto } from "components/interfaces/adelanto";

export const createAdelanto = async (item: Adelanto) => {
  try {
    const paramsCheck = [
      { name: "uniqueId", value: item.uniqueId },
      { name: "Nombre", value: item.Nombre }
    ];

    // 1. Buscar registro inactivo para restaurar
    const queryCheckInactive = `
      SELECT TOP 1 uniqueId
      FROM Adelanto
      WHERE (uniqueId = @uniqueId OR Nombre = @Nombre) AND Bit_Activo = 0
    `;
    const inactiveResult = await executeQuery(queryCheckInactive, paramsCheck);

    if (inactiveResult.length > 0) {
      const queryRestore = `
        UPDATE Adelanto
        SET 
          Bit_Activo = 1,
          Fec_Alta = @Fec_Alta,
          Cantidad = @Cantidad,
          Status = @Status,
          Comentario = @Comentario,
          Nombre = @Nombre,
          Fecha_Finalizacion = @Fecha_Finalizacion,
          Fecha_Inicio = @Fecha_Inicio
        WHERE uniqueId = @uniqueId
      `;

      const paramsUpdate = [
        { name: 'uniqueId', value: item.uniqueId ?? null },
        { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
        { name: 'Cantidad', value: item.Cantidad ?? null },
        { name: 'Status', value: item.Status ?? null },
        { name: 'Comentario', value: item.Comentario ?? null },
        { name: 'Nombre', value: item.Nombre ?? null },
        { name: 'Fecha_Finalizacion', value: item.Fecha_Finalizacion ?? null },
        { name: 'Fecha_Inicio', value: item.Fecha_Inicio ?? null },
      ];

      await executeQuery(queryRestore, paramsUpdate);

      return { ok: true, message: "Registro restaurado correctamente" };
    }

    // 2. Validar duplicados activos
    const queryCheckActive = `
      SELECT COUNT(*) AS total
      FROM Adelanto
      WHERE (uniqueId = @uniqueId OR Nombre = @Nombre) AND Bit_Activo = 1
    `;
    const [activeResult] = await executeQuery(queryCheckActive, paramsCheck);

    if (activeResult.total > 0) {
      return {
        ok: false,
        message: "El código o el empleado ya están asignados en un registro activo",
      };
    }

    // 3. Insertar nuevo registro
    const queryInsert = `
      INSERT INTO Adelanto (
        uniqueId,
        Bit_Activo,
        Fec_Alta,
        Cantidad,
        Status,
        Comentario,
        Nombre,
        Fecha_Finalizacion,
        Fecha_Inicio
      )
      VALUES (
        @uniqueId,
        1,
        @Fec_Alta,
        @Cantidad,
        @Status,
        @Comentario,
        @Nombre,
        @Fecha_Finalizacion,
        @Fecha_Inicio
      )
    `;

    const paramsInsert = [
      { name: 'uniqueId', value: item.uniqueId ?? null },
      { name: 'Fec_Alta', value: item.Fec_Alta ?? new Date().toISOString() },
      { name: 'Cantidad', value: item.Cantidad ?? null },
      { name: 'Status', value: item.Status ?? null },
      { name: 'Comentario', value: item.Comentario ?? null },
      { name: 'Nombre', value: item.Nombre ?? null },
      { name: 'Fecha_Finalizacion', value: item.Fecha_Finalizacion ?? null },
      { name: 'Fecha_Inicio', value: item.Fecha_Inicio ?? null },
    ];

    const insertResult = await executeQuery(queryInsert, paramsInsert);

    return { ok: true, insertResult };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      error: "Internal Server Error"
    };
  }
};
