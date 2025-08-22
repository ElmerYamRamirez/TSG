'use server';

import { executeQuery } from "components/app/lib/connection";
import { Sueldo } from "components/interfaces/sueldo";

export const createSueldo = async (item: Sueldo) => {
  try {
    const paramsCheck = [
      { name: "codigo", value: item.codigo },
      { name: "Empleado", value: item.Empleado }
    ];

    // 1. Buscar registro inactivo para restaurar (solo activar Bit_Activo)
    const queryCheckInactive = `
      SELECT TOP 1 uniqueId
      FROM Sueldos
      WHERE (codigo = @codigo OR Empleado = @Empleado) AND Bit_Activo = 0
    `;
    const inactiveResult = await executeQuery(queryCheckInactive, paramsCheck);

    if (inactiveResult.length > 0) {

      const queryRestore = `
        UPDATE Sueldos
        SET 
          Bit_Activo = 1,
          Fec_Alta = @Fec_Alta,
          Percepcion_total = @Percepcion_total,
          Sueldo = @Sueldo,
          Septimo_dia = @Septimo_dia,
          Prestamo_infonavit__FD_ = @Prestamo_infonavit__FD_,
          Total_de_deducciones = @Total_de_deducciones,
          Prestamo_Infonavit__CF_ = @Prestamo_Infonavit__CF_,
          Prestamo_Infonavit__PORC_ = @Prestamo_Infonavit__PORC_,
          Subs_al_Empleo__mes_ = @Subs_al_Empleo__mes_,
          I_S_R___mes_ = @I_S_R___mes_,
          I_M_S_S_ = @I_M_S_S_,
          Ajuste_al_neto = @Ajuste_al_neto,
          NETO = @NETO,
          Pension_Alimenticia = @Pension_Alimenticia,
          codigo = @codigo,
          Empleado = @Empleado,
          Sueldo_Real = @Sueldo_Real,
          Extra = @Extra,
          Bono_Puntualidad = @Bono_Puntualidad,
          Rebaje = @Rebaje,
          Sueldo_Real_Total = @Sueldo_Real_Total
        WHERE uniqueId = @uniqueId
`;

      const paramsUpdate = [
        { name: 'uniqueId', value: item.uniqueId ?? 1 },
        { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
        { name: 'Percepcion_total', value: item.Percepcion_total ?? 0 },
        { name: 'Sueldo', value: item.Sueldo },
        { name: 'Septimo_dia', value: item.Septimo_dia },
        { name: 'Prestamo_infonavit__FD_', value: item.Prestamo_infonavit__FD_ ?? 0 },
        { name: 'Total_de_deducciones', value: item.Total_de_deducciones ?? 0 },
        { name: 'Prestamo_Infonavit__CF_', value: item.Prestamo_Infonavit__CF_ ?? 0 },
        { name: 'Prestamo_Infonavit__PORC_', value: item.Prestamo_Infonavit__PORC_ ?? 0 },
        { name: 'Subs_al_Empleo__mes_', value: item.Subs_al_Empleo__mes_ ?? 0 },
        { name: 'I_S_R___mes_', value: item.I_S_R___mes_ ?? 0 },
        { name: 'I_M_S_S_', value: item.I_M_S_S_ ?? 0 },
        { name: 'Ajuste_al_neto', value: item.Ajuste_al_neto ?? 0 },
        { name: 'NETO', value: item.NETO ?? 0 },
        { name: 'Pension_Alimenticia', value: item.Pension_Alimenticia ?? 0 },
        { name: 'codigo', value: item.codigo },
        { name: 'Empleado', value: item.Empleado },
        { name: 'Sueldo_Real', value: item.Sueldo_Real ?? 0 },
        { name: 'Extra', value: item.Extra ?? 0 },
        { name: 'Bono_Puntualidad', value: item.Bono_Puntualidad },
        { name: 'Rebaje', value: item.Rebaje ?? 0 },
        { name: 'Sueldo_Real_Total', value: item.Sueldo_Real_Total ?? 0 },
      ];

      await executeQuery(queryRestore, paramsUpdate);

      return {
        ok: true,
        message: "Registro restaurado correctamente con sus datos originales",
      };
    }

    // 2. Validar que no exista registro activo duplicado
    const queryCheckActive = `
      SELECT COUNT(*) AS total
      FROM Sueldos
      WHERE (codigo = @codigo OR Empleado = @Empleado) AND Bit_Activo = 1
    `;
    const [activeResult] = await executeQuery(queryCheckActive, paramsCheck);

    if (activeResult.total > 0) {
      return {
        ok: false,
        message: "El código o el empleado ya están asignados en un registro activo",
      };
    }

    // 3. Insertar nuevo registro
    const paramsInsert = [
      { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
      { name: 'Percepcion_total', value: item.Percepcion_total ?? 0 },
      { name: 'Sueldo', value: item.Sueldo },
      { name: 'Septimo_dia', value: item.Septimo_dia },
      { name: 'Prestamo_infonavit__FD_', value: item.Prestamo_infonavit__FD_ ?? 0 },
      { name: 'Total_de_deducciones', value: item.Total_de_deducciones ?? 0 },
      { name: 'Prestamo_Infonavit__CF_', value: item.Prestamo_Infonavit__CF_ ?? 0 },
      { name: 'Prestamo_Infonavit__PORC_', value: item.Prestamo_Infonavit__PORC_ ?? 0 },
      { name: 'Subs_al_Empleo__mes_', value: item.Subs_al_Empleo__mes_ ?? 0 },
      { name: 'I_S_R___mes_', value: item.I_S_R___mes_ ?? 0 },
      { name: 'I_M_S_S_', value: item.I_M_S_S_ ?? 0 },
      { name: 'Ajuste_al_neto', value: item.Ajuste_al_neto ?? 0 },
      { name: 'NETO', value: item.NETO ?? 0 },
      { name: 'Pension_Alimenticia', value: item.Pension_Alimenticia ?? 0 },
      { name: 'codigo', value: item.codigo },
      { name: 'Empleado', value: item.Empleado },
      { name: 'Sueldo_Real', value: item.Sueldo_Real ?? 0 },
      { name: 'Extra', value: item.Extra ?? 0 },
      { name: 'Bono_Puntualidad', value: item.Bono_Puntualidad },
      { name: 'Rebaje', value: item.Rebaje ?? 0 },
      { name: 'Sueldo_Real_Total', value: item.Sueldo_Real_Total ?? 0 },
    ];

    const queryInsert = `
      INSERT INTO Sueldos (uniqueId, Bit_Activo, Fec_Alta, Percepcion_total, Sueldo, Septimo_dia, Prestamo_infonavit__FD_, Total_de_deducciones, Prestamo_Infonavit__CF_,
      Prestamo_Infonavit__PORC_, Subs_al_Empleo__mes_, I_S_R___mes_, I_M_S_S_, Ajuste_al_neto, NETO, Pension_Alimenticia, codigo, Empleado, Sueldo_Real, Extra, Bono_Puntualidad,
      Rebaje, Sueldo_Real_Total)
      VALUES (
        (SELECT ISNULL(MAX(uniqueId), 0) + 1 FROM Sueldos),
        1,
        @Fec_Alta,
        @Percepcion_total,
        @Sueldo,
        @Septimo_dia,
        @Prestamo_infonavit__FD_,
        @Total_de_deducciones,
        @Prestamo_Infonavit__CF_,
        @Prestamo_Infonavit__PORC_,
        @Subs_al_Empleo__mes_,
        @I_S_R___mes_,
        @I_M_S_S_,
        @Ajuste_al_neto,
        @NETO,
        @Pension_Alimenticia,
        @codigo,
        @Empleado,
        @Sueldo_Real,
        @Extra,
        @Bono_Puntualidad,
        @Rebaje,
        @Sueldo_Real_Total
      )
    `;

    const insertResult = await executeQuery(queryInsert, paramsInsert);

    return {
      ok: true,
      insertResult,
    };

  } catch (error) {
    console.error("API Error:", error);
    return {
      ok: false,
      message: "Error interno del servidor",
    };
  }
};
