import { createViaticoPlantilla, updateViaticoPlantillaById, deleteViaticoPlantillaById} from "components/actions";
import { ViaticoPlantilla } from "components/interfaces/viatico_plantilla";
import { useRouter } from "next/navigation";
import { useState } from "react";


const handleDarDeBaja = async (viatico: ViaticoPlantilla) => {
  if (confirm(`¿Estás seguro de eliminar: ${viatico.nombre}?`)) {
    //llamar server action to delete
    const { ok } = await deleteViaticoPlantillaById (viatico.uniqueId) ?? { ok: false, viaticos: [] };

    if (!ok) {
      alert("Hubo un error al eliminar la viático.");
    }
  }
}

const handleCreate = async (viatico: ViaticoPlantilla) => {
  //llamar server action to create
  const { ok, res } = await createViaticoPlantilla(viatico) ?? { ok: false, res: [] }
  return { ok, res }
}


const handleEdit = async (viatico: ViaticoPlantilla) => {
  const { ok, viaticos } = await updateViaticoPlantillaById(viatico) ?? { ok: false, viaticos: [] };
  return { ok, viaticos }
}


export default function Viaticos({ viaticos, plantilla }: { viaticos: ViaticoPlantilla[], plantilla: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  //const [casetasList, setCasetasList] = useState<CasetaI[]>(casetas)
  const [itemEditando, setItemEditando] = useState<ViaticoPlantilla | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const abrirModalEditar = (item: ViaticoPlantilla) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  }

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      cantidad: 0,
      nombre: '',
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString(),
    })
    setIsEditing(false);
    setIsModalOpen(true);
  }

  const deleteViatico = async (item: ViaticoPlantilla) => {
    //const responce = await handleDarDeBaja(item);
    await handleDarDeBaja(item);
    router.refresh();
  }

  const guardarCambios = async () => {
    if (!itemEditando) return

    if (isEditing) {
      //call server action to edit
      const responce = await handleEdit(itemEditando);

      if (responce.ok) {
        router.refresh()
      } else {
        alert('Error al guardar')
      }

    } else {
      //call server action to create
      console.log(itemEditando)
      const responce = await handleCreate(itemEditando);

      if (responce.ok) {
        router.refresh()
      } else {
        alert('Error al guardar')
      }
    }

    setIsModalOpen(false)
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
        <button className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalCrear}>
          <span>Agregar</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {(viaticos || []).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-xs text-gray-700">{item.nombre}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.cantidad}</td>
                <td className="px-1 py-2 space-x-1 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600"
                    onClick={() => abrirModalEditar(item)}>
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

      {/* Modal de edición y creacion */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Caseta' : 'Agregar Caseta'}</h2>
            <input
              type="text"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.nombre}
              onChange={e => setItemEditando({ ...itemEditando, nombre: e.target.value })}
              placeholder="Concepto"
            />
            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.cantidad}
              onChange={e => setItemEditando({ ...itemEditando, cantidad: parseFloat(e.target.value) })}
              placeholder="Monto"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarCambios}>
                {isEditing ? 'Guardar' : 'Crear'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
