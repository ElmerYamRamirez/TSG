import { Envio } from "./envio";
import { deduccion } from "./deduccion";
import { percepcion } from "./percepcion";
import { nomina_prestamo } from "./nomina_prestamo";
import { prestamo_pago } from "./prestamo_pago";

export interface nomina {
    Bit_Activo?: number;
    operador: number;
    fecha_inicio: Date;
    fecha_final: Date;
    fecha_generada: Date;
    deducciones: deduccion[];
    percepciones: percepcion[];
    prestamo_pagos: prestamo_pago[];
    nomina_prestamos: nomina_prestamo[];
    envios: Envio[]; //duda por que solo necesito id
    total_percepciones: number;
    total_deducciones: number;
    total_neto: number;
}