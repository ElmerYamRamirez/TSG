'use client';

import { deleteAdelantoById, updateAdelantoById, createAdelanto } from "components/actions";
import { Adelanto } from "components/interfaces/adelanto";
import { OperadorI } from "components/interfaces/operador";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserTable({ adelantos, operadores }: { adelantos: Adelanto[], operadores: OperadorI[] }) {
  const [itemEditando, setItemEditando] = useState<Adelanto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleCreate = async (item: Adelanto) => await createAdelanto(item) ?? { ok: false };
  
  const handleEdit = async (adelanto: Adelanto) => {
    const response = await updateAdelantoById(adelanto) ?? { ok: false, res: [] };
    return { ok: response.ok };
  };
  
  const handleDarDeBaja = async (adelanto: Adelanto) => {
    if (confirm(`¿Estás seguro de eliminar: ${adelanto.operador_name}?`)) {
      const { ok } = await deleteAdelantoById(adelanto) ?? { ok: false };
      if (!ok) alert("Hubo un error al eliminar el adelanto.");
    }
  };

  const abrirModalEditar = (item: Adelanto) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;
    const response = isEditing 
      ? await handleEdit(itemEditando) 
      : await handleCreate(itemEditando);

    if (response.ok) {
      router.refresh();
      setIsModalOpen(false);
    } else {
      alert('Hubo un error al guardar');
    }
  };

  const deleteAdelanto = async (item: Adelanto) => {
    await handleDarDeBaja(item);
    router.refresh();
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = String(d.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleChange = (field: keyof Adelanto, value: any) => {
    setItemEditando(prev => prev ? { ...prev, [field]: value === '' ? null : value } : null);
  };

  return (
    <>
      <div className="overflow-x-auto mb-2">
        <div className="flex justify-end">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600"
            onClick={() => { 
              setItemEditando({} as Adelanto); 
              setIsEditing(false); 
              setIsModalOpen(true); 
            }}
          >
            Agregar Adelanto
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Empleado</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Cantidad</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Comentario</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Fecha de Inicio</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Fecha de Finalización</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adelantos.map((adelanto, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-1 text-xs">{adelanto.operador_name}</td>
                <td className="px-1 py-1 text-xs">{adelanto.Cantidad}</td>
                <td className="px-1 py-1 text-xs">{adelanto.Status}</td>
                <td className="px-1 py-1 text-xs">{adelanto.Comentario}</td>
                <td className="px-1 py-1 text-xs">{formatDate(adelanto.Fecha_Inicio)}</td>
                <td className="px-1 py-1 text-xs">{formatDate(adelanto.Fecha_Finalizacion)}</td>
                <td className="px-1 py-1 text-xs space-x-1">
                  <button 
                    className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" 
                    onClick={() => abrirModalEditar(adelanto)}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => deleteAdelanto(adelanto)} 
                    className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
              <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Adelanto' : 'Agregar Adelanto'}</h2>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Empleado</label>
                <select
                  value={itemEditando.Nombre ?? ''}
                  onChange={e => handleChange('Nombre', parseInt(e.target.value, 10))}
                  className="border rounded px-3 py-2 w-full text-xs"
                >
                  <option value="">Selecciona un Empleado</option>
                  {operadores.map(op => 
                    <option key={op.uniqueId} value={op.uniqueId}>
                      {op.Nombre}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
                <input 
                  type="number" 
                  value={itemEditando.Cantidad ?? ''} 
                  onChange={e => handleChange('Cantidad', e.target.value)} 
                  className="border rounded px-3 py-2 w-full text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={itemEditando.Status ?? ''}
                  onChange={e => handleChange('Status', e.target.value)}
                  className="border rounded px-3 py-2 w-full text-xs"
                >
                  <option value="">Selecciona un Status</option>
                  <option value="RECURRENTE">RECURRENTE</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="DESCONTADO">DESCONTADO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Comentario</label>
                <textarea 
                  value={itemEditando.Comentario ?? ''} 
                  onChange={e => handleChange('Comentario', e.target.value)} 
                  className="border p-2 w-full rounded text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-full text-xs"
                  value={
                    itemEditando.Fecha_Inicio && !isNaN(new Date(itemEditando.Fecha_Inicio).getTime())
                      ? new Date(itemEditando.Fecha_Inicio).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={e =>
                    setItemEditando({
                      ...itemEditando,
                      Fecha_Inicio: e.target.value === "" ? null : e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de Finalizacion</label>
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-full text-xs"
                  value={
                    itemEditando.Fecha_Finalizacion && !isNaN(new Date(itemEditando.Fecha_Finalizacion).getTime())
                      ? new Date(itemEditando.Fecha_Finalizacion).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={e =>
                    setItemEditando({
                      ...itemEditando,
                      Fecha_Finalizacion: e.target.value === "" ? null : e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={guardarCambios}
                >
                  {isEditing ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
