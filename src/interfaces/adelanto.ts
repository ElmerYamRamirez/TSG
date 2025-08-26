export interface Adelanto {
    Bit_Activo: number;
    Cantidad: number;
    Comentario: string;
    Fec_Alta: string;
    Nombre: string;
    Status: string;
    uniqueId: string;
    Usuario: string;
    Usu_Alta: string;
    Fecha_Finalizacion: string | null;
    Fecha_Inicio: string | null;
    Total_Actual: number;
    operador_name?: string;
}