export interface CombustibleI {
  uniqueId: number;
  tipo: 'Gasolina' | 'Diesel' | 'Otros';
  fecha: string;
  litros?: number;
  precioLitro?: number;
  total?: number;
  kilometraje: number;
}