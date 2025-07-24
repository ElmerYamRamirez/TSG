export interface ProgramacionI {
  uniqueId: number;
  Bit_Activo?: number;
  Usu_Alta?: string;
  Fec_Alta?: string;
  Cliente: number;
  Operador: number;
  Unidad: number;
  Comentario: string;
  Destino_de_la_unidad: number;
  Fecha_programada: string;
  Hora_programada: string;
  Sueldo: number;
  nomina: number;
  folio: string;
  status_programacion: string;
  papeleria: string;
  cantidad_cobrada: number;
  fecha_entrega_papeleria: string;
  vendedor: string;
}