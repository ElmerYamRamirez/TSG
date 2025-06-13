import { createCombustible, updateCombustibleById, deleteCombustibleById} from "components/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CombustibleI } from "components/interfaces/combustibles";


const handleDarDeBaja = async(combustible: CombustibleI) => {
  console.log('Dar de baja:', combustible);
  // Ejemplo: confirmar y hacer una petición a una API
  if (confirm(`¿Estás seguro de eliminar: ${combustible.fecha}?`)) {
    //llamar server action to delete
    const { ok } = await deleteCombustibleById(combustible.uniqueId) ?? { ok: false, combustibles: [] };

    if (!ok) {
      alert("Hubo un error al eliminar la carga.");
    }
  }
}

const handleCreate = async (combustible: CombustibleI) => {
  //llamar server action to create
  const { ok, res } = await createCombustible(combustible) ?? { ok: false, res: [] }
  return { ok, res }
}

const handleEdit = async (combustible: CombustibleI) => {
  const { ok, combustibles } = await updateCombustibleById(combustible) ?? { ok: false, combustibles: [] };
  return {ok, combustibles}
}

export default function Combustibles({ combustibles, programacion }: { combustibles: CombustibleI[], programacion: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemEditando, setItemEditando] = useState<CombustibleI | null>(null)
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)

  const abrirModalEditar = (item: CombustibleI) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      fecha: new Date().toISOString().split("T")[0],
      litros: 0,
      precio: 0,
      precio_total: 0,
      kilometraje_actual: 0,
      programacion: programacion,
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString(),
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const deleteViatico = async (item: CombustibleI) => {
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
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Tipo</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio Total</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Kilometraje</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 space-x-2">
            {(combustibles || []).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-xs text-gray-700"></td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.fecha ? new Date(item.fecha).toISOString().split("T")[0] : "Sin fecha"}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.litros}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.precio}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.precio_total}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.kilometraje_actual}</td>
                <td className="px-1 py-2 space-x-2 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(item)}>
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
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Viatico' : 'Agregar Viatico'}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.fecha ? new Date(itemEditando.fecha).toISOString().split("T")[0] : ""}
                onChange={e => setItemEditando({ ...itemEditando, fecha: e.target.value })}
                placeholder="Fecha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={Number.isNaN(itemEditando.litros) ? '' : itemEditando.litros ?? ''}
                onChange={e => {
                  const litros = parseFloat(e.target.value) || 0;
                  const precio = itemEditando?.precio || 0;
                  setItemEditando({
                    ...itemEditando,
                    litros,
                    precio_total: litros * precio
                  });
                }}
                placeholder="Litros"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio por Litro</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={Number.isNaN(itemEditando.precio) ? '' : itemEditando.precio ?? ''}
                onChange={e => {
                  const precio = parseFloat(e.target.value) || 0;
                  const litros = itemEditando?.litros || 0;
                  setItemEditando({
                    ...itemEditando,
                    precio,
                    precio_total: litros * precio
                  });
                }}
                placeholder="Precio"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
                value={itemEditando.precio_total?.toFixed(2) ?? ''}
                readOnly
                placeholder="Total"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje Actual</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={Number.isNaN(itemEditando.kilometraje_actual) ? '' : itemEditando.kilometraje_actual ?? ''}
                onChange={e => setItemEditando({ ...itemEditando, kilometraje_actual: parseFloat(e.target.value) || 0 })}
                placeholder="Kilometraje"
              />
            </div>

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
