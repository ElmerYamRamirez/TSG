import { createCombustible} from "components/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CombustibleI } from "components/interfaces/combustibles";
import React from 'react';

const handleCreate = async (combustibles: CombustibleI) => {
  //llamar server action to create
  const { ok, res } = await createCombustible(combustibles) ?? { ok: false, res: [] }
  return { ok, res }
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

export default function Combustibles({ combustibles, programacion }: { combustibles: CombustibleI[], programacion: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<CombustibleI | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      tipo: '',
      fecha: new Date().toISOString().split('T')[0],
      litros: 0,
      precioLitro: 0,
      total: 0,
      kilometraje: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <input type="text" placeholder="Buscar..." className="border rounded px-3 py-1 w-64" />
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Buscar</button>
        </div>
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalCrear}
        >
          <span>Agregar</span>
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

      {/* Modal fuera de la tabla */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Combustible' : 'Agregar Combustible'}</h2>

            <input type="text" className="border rounded px-3 py-1 w-full" value={itemEditando.tipo} onChange={e => setItemEditando({ ...itemEditando, tipo: e.target.value })} placeholder="Tipo" />
            <input type="date" className="border rounded px-3 py-1 w-full" value={itemEditando.fecha} onChange={e => setItemEditando({ ...itemEditando, fecha: e.target.value })} placeholder="Fecha" />
            <input type="number" className="border rounded px-3 py-1 w-full" value={itemEditando.litros} onChange={e => setItemEditando({ ...itemEditando, litros: parseFloat(e.target.value) || 0 })} placeholder="Litros" />
            <input type="number" className="border rounded px-3 py-1 w-full" value={itemEditando.precioLitro} onChange={e => setItemEditando({ ...itemEditando, precioLitro: parseFloat(e.target.value) || 0 })} placeholder="Precio por litro" />
            <input type="number" className="border rounded px-3 py-1 w-full" value={itemEditando.total} onChange={e => setItemEditando({ ...itemEditando, total: parseFloat(e.target.value) || 0 })} placeholder="Total" />
            <input type="number" className="border rounded px-3 py-1 w-full" value={itemEditando.kilometraje} onChange={e => setItemEditando({ ...itemEditando, kilometraje: parseFloat(e.target.value) || 0 })} placeholder="Kilometraje" />

            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={async () => {
                  if (itemEditando) {
                    const { ok } = await handleCreate(itemEditando);
                    if (ok) {
                      setIsModalOpen(false);
                      router.refresh();
                    } else {
                      alert("Error al guardar.");
                    }
                  }
                }}
              >
                {isEditing ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

          