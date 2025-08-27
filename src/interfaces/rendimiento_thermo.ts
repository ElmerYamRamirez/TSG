export interface RendimientoThermo {
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  litros_iniciales?: number | null;
  litros_finales?: number | null;
  precio_litro_inicial?: number | null;
  fecha_inicial?: string ;
  fecha_final?: string ;
  programacion: number | null;
}
