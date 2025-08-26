'use server';

import { executeQuery } from "components/app/lib/connection";

export const getAdelantos = async () => {
    try {
        const hoy = new Date();
        const diaSemana = hoy.getDay();
        const diasHastaViernes = (5 - diaSemana + 7) % 7;
        const fechaFinCorte = new Date(hoy);
        fechaFinCorte.setDate(hoy.getDate() + diasHastaViernes);
        const fechaFinCorteStr = fechaFinCorte.toISOString().split("T")[0];

        await executeQuery(`
            UPDATE Adelanto
            SET Status = 'DESCONTADO'
            WHERE Status = 'RECURRENTE'
                AND Fecha_Finalizacion IS NOT NULL
                AND Fecha_Finalizacion <= @FechaFinCorte`,
            [
                { name: "FechaFinCorte", value: fechaFinCorteStr }
            ]
        );

        const query = `
        SELECT * 
        FROM Adelanto
        WHERE Status IN ('PENDIENTE', 'RECURRENTE')
        AND Bit_Activo = 1
        ORDER BY Fec_Alta DESC`;

        const adelantos = await executeQuery(query, []);

        return {
            ok : true,
            adelantos : adelantos,
        };
    } catch (error) {
        console.error("API Error:", error);
    }
}