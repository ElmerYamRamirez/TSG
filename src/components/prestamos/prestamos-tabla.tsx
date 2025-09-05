'use client';

import { deletePrestamoById, updatePrestamoById, createPrestamo } from "components/actions";
import { Prestamo } from "components/interfaces/prestamo";
import { OperadorI } from "components/interfaces/operador";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";

export default function UserTable({ prestamos, operadores }: { prestamos: Prestamo[], operadores: OperadorI[] }) {
  const [itemEditando, setItemEditando] = useState<Prestamo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");


  const handleCreate = async (item: Prestamo) => await createPrestamo(item) ?? { ok: false };
  
  const handleEdit = async (prestamo: Prestamo) => {
    const response = await updatePrestamoById(prestamo) ?? { ok: false, res: [] };
    return { ok: response.ok };
  };
  
  const handleDarDeBaja = async (prestamo: Prestamo) => {
    if (confirm(`¿Estás seguro de eliminar: ${prestamo.operador_name}?`)) {
      const { ok } = await deletePrestamoById(prestamo) ?? { ok: false };
      if (!ok) alert("Hubo un error al eliminar el prestamo.");
    }
  };

  const abrirModalEditar = (item: Prestamo) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;
    const response = isEditing ? await handleEdit(itemEditando) 
      : await handleCreate(itemEditando)
    if (response.ok) {
   router.refresh();
  setIsModalOpen(false);
    } else {
      alert('Hubo un error al guardar');
    }
  };

  const deletePrestamo = async (item: Prestamo) => {
    await handleDarDeBaja(item);
    router.refresh();
  };

  const handleChange = (field: keyof Prestamo, value: Prestamo[keyof Prestamo]) => {
    setItemEditando(prev => {
        if (!prev) return null;

        const updated = { ...prev, [field]: value === '' ? null : value };

        const monto = Number(updated.Monto_de_prestamo) || 0;
        const pagos = Number(updated.Numero_de_pagos) || 0;
        const descuento = Number(updated.Descuento_por_semana) || 0;

        updated.Saldo = monto - (pagos * descuento);

        return updated;
    });
    };

  return (
    <>
      <div className="overflow-x-auto mb-2">
        <div className="flex justify-end">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600"
            onClick={() => { 
              setItemEditando({} as Prestamo); 
              setIsEditing(false); 
              setIsModalOpen(true); 
            }}
          >
            Agregar Prestamo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Empleado</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Descuento por Semana</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Monto de Prestamo</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Pagos Realizados</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Saldo</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Status</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Comentario</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Acciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prestamos.map((prestamo, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-1 text-xs">{prestamo.operador_name}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Descuento_por_semana}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Monto_de_prestamo}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Numero_de_pagos}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Saldo}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Status}</td>
                <td className="px-1 py-1 text-xs">{prestamo.Comentario}</td>
                <td className="px-1 py-1 text-xs space-x-1">
                  <button 
                    className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" 
                    onClick={() => abrirModalEditar(prestamo)}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => deletePrestamo(prestamo)} 
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
                <Select
                  options={operadores.map(op => ({
                    value: op.uniqueId,
                    label: op.Nombre,
                  }))}
                  value={
                    operadores
                      .map(op => ({ value: op.uniqueId, label: op.Nombre }))
                      .find(option => option.value === Number(itemEditando?.Nombre)) || null
                  }
                  onChange={(selectedOption) =>
                    handleChange("Nombre", selectedOption ? selectedOption.value : "")
                  }
                  placeholder="Busca un Empleado..."
                  isSearchable
                  isClearable
                  inputValue={inputValue}
                  onInputChange={(value) => setInputValue(value)}
                  filterOption={(option, rawInput) =>
                    option.label.toLowerCase().includes(rawInput.toLowerCase())
                  }
                  noOptionsMessage={() => "No se encontró ningún empleado"}
                  className="text-xs"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descuento por Semana</label>
                <input 
                  type="number" 
                  value={itemEditando.Descuento_por_semana ?? ''} 
                  onChange={e => handleChange('Descuento_por_semana', e.target.value)} 
                  className="border rounded px-3 py-2 w-full text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Monto de Prestamo</label>
                <input 
                  type="number" 
                  value={itemEditando.Monto_de_prestamo ?? ''} 
                  onChange={e => handleChange('Monto_de_prestamo', e.target.value)} 
                  className="border rounded px-3 py-2 w-full text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Numero de Pagos</label>
                <input 
                  type="number" 
                  value={itemEditando.Numero_de_pagos ?? ''} 
                  onChange={e => handleChange('Numero_de_pagos', e.target.value)} 
                  className="border rounded px-3 py-2 w-full text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Saldo</label>
                <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs bg-gray-100 cursor-not-allowed"
                    value={itemEditando?.Saldo ?? 0}
                    readOnly
                    placeholder="Saldo calculado automáticamente"
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
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN VIGOR">EN VIGOR</option>
                  <option value="PAGADO">PAGADO</option>
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

