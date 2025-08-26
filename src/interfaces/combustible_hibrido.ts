export interface CombustibleHibrido{
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  Fecha_Carga: string;
  Litros_T1: number;
  Litros_T2: number;
  Litros_T3: number;
  Litros_T4: number;
  Litros_TG: number;
  precio_litro_gas: number;
  precio_litro_gasolina: number;
  programacion: number;
}