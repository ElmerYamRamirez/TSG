'use server';

import { executeQuery } from "components/app/lib/connection";
import { ProgramacionI } from "components/interfaces/programacion";

export const updateProgramacionById = async (item: ProgramacionI) => {
    try {
        const query = `
        UPDATE Programacion_de_envio
        SET
            Cliente = @cliente,
            Operador = @operador,
            Unidad = @unidad,
            Comentario = @comentario,
            Destino_de_la_unidad = @destino,
            Fecha_programada = @fecha_programada,
            Hora_programada = @hora_programada,
            Sueldo = @sueldo,
            nomina = @nomina,
            folio = @folio,
            status_programacion = @status,
            papeleria = @papeleria,
            cantidad_cobrada = @cantidad_cobrada,
            fecha_entrega_papeleria = @fecha_entrega_papeleria,
            vendedor = @vendedor
        WHERE uniqueId = @uniqueId and Bit_Activo = 1
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
            { name: 'uniqueId', value: item.uniqueId },
            { name: 'cliente' , value: item.Cliente }, 
            { name: 'operador' , value: item.Operador }, 
            { name: 'unidad' , value: item.Unidad }, 
            { name: 'comentario' , value: item.Comentario }, 
            { name: 'destino' , value: item.Destino_de_la_unidad }, 
            { name: 'fecha_programada' , value: item.Fecha_programada }, 
            { name: 'hora_programada' , value: item.Hora_programada }, 
            { name: 'sueldo' , value: item.Sueldo }, 
            { name: 'nomina' , value: item.nomina }, 
            { name: 'folio' , value: item.folio }, 
            { name: 'status' , value: item.status_programacion }, 
            { name: 'papeleria' , value: item.papeleria }, 
            { name: 'cantidad_cobrada' , value: item.cantidad_cobrada }, 
            { name: 'fecha_entrega_papeleria' , value: item.fecha_entrega_papeleria }, 
            { name: 'vendedor' , value: item.vendedor }, 
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
