export interface ReporteCombustibleI {
    uniqueId: number;
    nombre: string;
    unidad: string;
    folio: string;
    total: number;
    litros: number;
    km_actual: number;
    km_anterior: number;
    km_recorridos: number;
    rendimiento_real: number;
    rendimiento: number;
    litros_ideal: number;
    diferencia_litros: number;
    precio_diferencia_litros: number;
    variacion: number;
}