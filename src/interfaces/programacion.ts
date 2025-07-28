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
  Sueldo: number | null;
  nomina: number;
  folio: string;
  status_programacion: string;
  papeleria: string;
  cantidad_cobrada: number | null;
  fecha_entrega_papeleria: string;
  vendedor: string;
  unidad_name: string;
  operador_name: string;
  Nombre_destino: string;
  cliente_name: string;
}