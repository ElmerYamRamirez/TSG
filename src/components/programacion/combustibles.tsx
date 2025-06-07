
import { CombustibleI } from "components/interfaces/combustibles";
import React from 'react';

interface CombustibleProps {
  combustible: CombustibleI[];
  programacion: number;
}

const initialCombustible: CombustibleI[] = [
  {
    uniqueId: 1,
    tipo: "Gasolina",
    fecha: "2023-01-01",
    litros: 20,
    precioLitro: 21.5,
    total: 430,
    kilometraje: 15000,
  },
  {
    uniqueId: 2,
    tipo: "Diesel",
    fecha: "2023-01-15",
    litros: 15,
    precioLitro: 23,
    total: 345,
    kilometraje: 15500,
  },
  {
    uniqueId: 3,
    tipo: "Otros",
    fecha: "2023-02-01",
    litros: 10,
    precioLitro: 25,
    total: 250,
    kilometraje: 16000,
  },
];

export default function CombustibleInterface() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <button
           className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={() => alert("Funcionalidad no disponible")}
        >
          Agregar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Tipo</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Precio/Litro</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Total</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Kilometraje</th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialCombustible.map((item, i) => (
              <tr key={item.uniqueId} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1 text-xs text-gray-700">{item.tipo}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.fecha}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.litros}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.precioLitro}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.total}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.kilometraje}</td>
                <td className="px-2 py-1 space-x-2 text-xs text-indigo-600 font-medium">
                  <button
                    className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
                    onClick={() => alert("Editar no disponible")}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 px-2 text-red-500 border border-red-400 rounded"
                    onClick={() => alert("Eliminar no disponible")}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
