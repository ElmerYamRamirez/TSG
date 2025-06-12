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
      precioLitro: 0,
      total: 0,
      kilometraje: 0,
      programacion: programacion, // Aquí el programacion desde URL
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
                <td className="px-1 py-2 text-xs text-gray-700">{item.fecha}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.litros}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.precioLitro}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.total}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.kilometraje}</td>
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
            <input
              type="text"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.fecha}
              onChange={e => setItemEditando({ ...itemEditando, fecha: e.target.value })}
              placeholder="Fecha"
            />
            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.litros}
              onChange={e => setItemEditando({ ...itemEditando, litros: parseFloat(e.target.value) })}
              placeholder="Litros"
            />
            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.precioLitro}
              onChange={e => setItemEditando({ ...itemEditando, precioLitro: parseFloat(e.target.value) })}
              placeholder="Precio"
            />
            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.total}
              onChange={e => setItemEditando({ ...itemEditando, total: parseFloat(e.target.value) })}
              placeholder="Precio Litro"
            />
            <label className="block text-sm font-medium text-gray-700">Programación</label>
<input
  type="number"
  disabled
  className="border rounded px-3 py-1 w-full bg-gray-100 text-gray-600"
  value={itemEditando.programacion}
/>

            <input
              type="number"
              className="border rounded px-3 py-1 w-full"
              value={itemEditando.kilometraje}
              onChange={e => setItemEditando({ ...itemEditando, kilometraje: parseFloat(e.target.value) })}
              placeholder="Kilometraje"
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
