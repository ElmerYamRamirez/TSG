export interface Rendimiento {
  uniqueId?: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  rendimiento_ideal: number;
  litros_ideales: number;
  litros_iniciales: number | null;
  litros_finales: number | null;
  km_inicial: number | null;
  km_final: number | null;
  programacion: number;
  
}
