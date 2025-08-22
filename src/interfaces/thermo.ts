export interface ThermoI{
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  litros: number;
  precio_litro: number;
  total: number;
  fecha_inicio: string;
  Fecha_final: string;
  horas_uso_thermo: number;
  programacion: number;
}