export interface Sueldo {
    uniqueId?: string;
    Bit_Activo?: number;
    Usu_Alta?: string;
    Fec_Alta?: string;
    Percepcion_total: number;
    Sueldo: number | null;
    Septimo_dia: number | null;
    Prestamo_infonavit__FD_: number;
    Total_de_deducciones: number; 
    Prestamo_Infonavit__CF_: number;
    Prestamo_Infonavit__PORC_: number;
    Subs_al_Empleo__mes_: number;
    I_S_R___mes_: number;
    I_M_S_S_: number;
    Ajuste_al_neto: number;
    NETO: number;
    Pension_Alimenticia: number;
    codigo: number;
    Empleado: string;
    Sueldo_Real: number;
    Extra: number;
    Bono_Puntualidad: number | null;
    Rebaje: number;
    Sueldo_Real_Total: number;
    operador_name?: string;
}