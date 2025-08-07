export interface Rendimiento {
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  rendimiento_ideal: number | null;
  litros_ideales: number | null;
  programacion: number;
  litros_iniciales?: number | null;
  litros_finales?: number | null;
  precio_litro?: number | null;
  km_inicial?: number | null;
  km_final?: number | null;
}
