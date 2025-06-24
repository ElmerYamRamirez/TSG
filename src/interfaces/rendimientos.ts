export interface Rendimiento {
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  rendimiento_ideal: number;
  litros_ideales: number;
  programacion: number;
  litros_iniciales?: number;
  litros_finales?: number;
  km_inicial?: number | null;
  km_final?: number | null;
}
