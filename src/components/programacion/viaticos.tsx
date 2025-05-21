import { updateViaticosById } from "components/actions";
import { deleteViaticosById } from "components/actions/viaticos/delete-viaticos-by-id";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Viatico } from "components/interfaces/viaticos";

// interface viaticos{
//     viatico:viatico[]
// }

// interface viatico{
//     concepto: string,
//     monto: number
// }

const handleDarDeBaja = async(viatico: any) => {
  const elmer = 12;
  console.log('Dar de baja:', viatico);
  // Ejemplo: confirmar y hacer una petición a una API
  if (confirm(`¿Estás seguro de eliminar: ${viatico.concepto}?`)) {
    //llamar server action to delete
    // fetch('/api/vehiculos/baja', { method: 'POST', body: JSON.stringify({ id: vehiculo.id }) });
    const { ok, viaticos} = await deleteViaticosById(viatico.uniqueId) ?? { ok: false, viaticos: [] };
  }
}

const handleCreate = async(viatico: any) => {
  if (confirm(`¿Estás seguro de eliminar: ${viatico.concepto}?`)) {
    //llamar server action to create
    //const { ok, viaticos} = await deleteViaticosById(viatico.uniqueId) ?? { ok: false, viaticos: [] };
  }
}

const handleEdit = async (viatico: Viatico) => {
  const { ok, viaticos } = await updateViaticosById(viatico) ?? { ok: false, viaticos: [] };
  return {ok, viaticos}
}

export default function Viaticos({ viaticos }: { viaticos: Viatico[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viaticosList, setViaticosList] = useState<Viatico[]>(viaticos)
  const [itemEditando, setItemEditando] = useState<Viatico | null>(null)
  const router = useRouter();

  const abrirModal = (item: any) => {
    setItemEditando(item)
    setIsModalOpen(true)
  }

  const deleteViatico = async (item: any) => {
    const responce = await handleDarDeBaja(item);
    router.refresh();
  }

  const createViatico = async (item: any) => {
    const responce = await handleCreate(item);
    router.refresh();
  }

  const editViaticos = async () => {
    if (!itemEditando) return

    const responce = await handleEdit(itemEditando);

    if (responce.ok) {
      router.refresh()
      setIsModalOpen(false)
    } else {
      alert('Error al guardar')
    }
  }


  return (
    <div className="p-6 bg-white rounded-lg shadow">

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded px-3 py-1 w-64" />
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            Buscar
          </button>
        </div>
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
        >
          <span>Agregar</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Concepto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 space-x-2">
            {viaticos.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-xs text-gray-700">{item.concepto}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.cantidad}</td>
                <td className="px-1 py-2 space-x-2 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModal(item)}>
                    Editar
                  </button>
                  <button
                    onClick={() => deleteViatico(item)}
                    className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Editar Viatico</h2>
            <input
              type="text"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.concepto}
              onChange={e => setItemEditando({ ...itemEditando, concepto: e.target.value })}
              placeholder="Concepto"
            />
            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.cantidad}
              onChange={e => setItemEditando({ ...itemEditando, cantidad: e.target.value })}
              placeholder="Monto"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={editViaticos}>
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
