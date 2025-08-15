export interface RendimientoHibrido {
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  Km_Inicial?: number | null;
  Km_Final?: number | null;
  Porcentaje_Inicial_T1?: number | null;
  Porcentaje_Inicial_T2?: number | null;
  Porcentaje_Inicial_T3?: number | null;
  Porcentaje_Inicial_T4?: number | null;
  Porcentaje_Inicial_TG?: number | null;
  Porcentaje_Final_T1?: number | null;
  Porcentaje_Final_T2?: number | null;
  Porcentaje_Final_T3?: number | null;
  Porcentaje_Final_T4?: number | null;
  Porcentaje_Final_TG?: number | null;
  precio_litro_gas?: number | null;
  precio_litro_gasolina?: number | null;
  programacion: number;
}
