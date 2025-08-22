'use server';

import { executeQuery } from "components/app/lib/connection";
import { ThermoI } from "components/interfaces/thermo";

export const updateThermoById = async (item: ThermoI) => {
    try {
        const query = `
        UPDATE carga_thermo
        SET
            Bit_Activo = @Bit_Activo,
            Fec_Alta = @Fec_Alta,
            litros = @litros,
            precio_litro = @precio_litro,
            total = @total,
            fecha_inicio = @fecha_inicio,
            Fecha_final = @Fecha_final,
            horas_uso_thermo = @horas_uso_thermo,
            programacion = @programacion

        WHERE uniqueId = @uniqueId
        `;

        const paramsList = [
            { name: 'Bit_Activo', value: item.Bit_Activo || 1 },
            { name: 'Fec_Alta', value: item.Fec_Alta || new Date().toISOString() },
            {name: 'litros', value: item.litros},
            {name: 'precio_litro', value: item.precio_litro},
            {name: 'total', value: item.total},
            {name: 'fecha_inicio', value: item.fecha_inicio = new Date().toISOString()},
            {name: 'Fecha_final', value: item.Fecha_final = new Date().toISOString()},
            {name: 'horas_uso_thermo', value: item.horas_uso_thermo},
            {name: 'programacion', value: item.programacion},
            { name: 'uniqueId', value: item.uniqueId }];

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