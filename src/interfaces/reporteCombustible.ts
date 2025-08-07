export interface ReporteCombustibleI {
    uniqueId: number;
    nombre: string;
    unidad: string;
    folio: string;
    total: number;
    litros: number;
    km_final: number;
    km_inicial: number;
    km_recorridos: number;
    rendimiento_real: number;
    rendimiento_ideal: number;
    litros_ideal: number;
    diferencia_litros: number;
    precio_diferencia_litros: number;
    variacion: number;
    precio: number;
    costo_fi: number;
}