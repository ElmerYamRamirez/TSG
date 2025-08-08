'use server';

import { executeQuery } from "components/app/lib/connection";
import { Sueldo } from "components/interfaces/sueldo";

export const updateSueldoById = async (item: Sueldo) => {
    try {
        const query = `
        UPDATE Sueldos
        SET
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
        WHERE uniqueId = @uniqueId and Bit_Activo = 1
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
            { name: 'uniqueId', value: item.uniqueId },
            { name: 'Percepcion_total' , value: item.Percepcion_total }, 
            { name: 'Sueldo' , value: item.Sueldo }, 
            { name: 'Septimo_dia' , value: item.Septimo_dia }, 
            { name: 'Prestamo_infonavit__FD_' , value: item.Prestamo_infonavit__FD_}, 
            { name: 'Total_de_deducciones' , value: item.Total_de_deducciones }, 
            { name: 'Prestamo_Infonavit__CF_' , value: item.Prestamo_Infonavit__CF_ }, 
            { name: 'Prestamo_Infonavit__PORC_' , value: item.Prestamo_Infonavit__PORC_ }, 
            { name: 'Subs_al_Empleo__mes_' , value: item. Subs_al_Empleo__mes_ }, 
            { name: 'I_S_R___mes_' , value: item.I_S_R___mes_ }, 
            { name: 'I_M_S_S_' , value: item.I_M_S_S_}, 
            { name: 'Ajuste_al_neto' , value: item.Ajuste_al_neto }, 
            { name: 'NETO' , value: item.NETO }, 
            { name: 'Pension_Alimenticia' , value: item.Pension_Alimenticia }, 
            { name: 'Empleado' , value: item.Empleado },
            { name: 'codigo' , value: item.codigo },
            { name: 'Sueldo_Real' , value: item.Sueldo_Real }, 
            { name: 'Extra' , value: item.Extra}, 
            { name: 'Bono_Puntualidad' , value: item.Bono_Puntualidad }, 
            { name: 'Rebaje' , value: item.Rebaje }, 
            { name: 'Sueldo_Real_Total' , value: item.Sueldo_Real_Total }, 
        ];

        const responce = await executeQuery(query, paramsList);

        console.log(responce);
        return {
            ok: true,
            res: responce,
        };
    } catch (error) {
        console.error("API Error:", error);
        return {
            ok: false,
            error: "Internal Server Error"
        };
    }
};
