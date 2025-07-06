import { createViaticoPlantilla, updateViaticoPlantillaById, deleteViaticoPlantillaById, checkViatico, deleteViaticosVinculados} from "components/actions";
import { ViaticoPlantilla } from "components/interfaces/viatico_plantilla";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Viaticos({ viaticos, plantilla }: { viaticos: ViaticoPlantilla[], plantilla: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<ViaticoPlantilla | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const router = useRouter();

   useEffect(() => {
    const stored = localStorage.getItem(`plantilla-${plantilla}-selected`);
    if (stored) setSelectedIds(JSON.parse(stored));
  }, [plantilla]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === viaticos.length ? [] : viaticos.map((v) => v.uniqueId)
    );
  };
   const abrirModalEditar = (item: ViaticoPlantilla) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      cantidad: 0,
      nombre: '',
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString(),
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDarDeBaja = async (viatico: ViaticoPlantilla) => {
    if (confirm(`¿Estás seguro de eliminar: ${viatico.nombre}?`)) {
      const { ok } = await deleteViaticoPlantillaById(viatico.uniqueId) ?? { ok: false };
      if (!ok) alert("Hubo un error al eliminar el viático.");
    }
  };

  const deleteViatico = async (item: ViaticoPlantilla) => {
    await handleDarDeBaja(item);
    router.refresh();
  };

  const handleCreate = async (viatico: ViaticoPlantilla) => {
    const { ok, res } = await createViaticoPlantilla(viatico) ?? { ok: false, res: [] };
    return { ok, res };
  };

  const handleEdit = async (viatico: ViaticoPlantilla) => {
    const { ok, viaticos } = await updateViaticoPlantillaById(viatico) ?? { ok: false, viaticos: [] };
    return { ok, viaticos };
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;

    if (isEditing) {
      const responce = await handleEdit(itemEditando);
      if (responce.ok) router.refresh();
      else alert('Error al guardar');
    } else {
      const responce = await handleCreate(itemEditando);
      if (responce.ok) router.refresh();
      else alert('Error al guardar');
    }
    setIsModalOpen(false);
  };

    const guardarPlantilla = async () => {
    if (selectedIds.length === 0) return alert("Selecciona al menos un viático");

    const { ok: deleted } = await deleteViaticosVinculados(plantilla);
    if (!deleted) return alert("Error al limpiar viáticos anteriores.");

    for (const viaticoId of selectedIds) {
      const item = {
        viaticos: viaticoId,
        destino: plantilla,
        nombre: String(plantilla),
        descripcion: undefined,
        Fec_Alta: new Date().toISOString(),
      };

      const { ok } = (await checkViatico(item)) ?? { ok: false };
      if (!ok) return alert("Error al guardar viático.");
    }

  localStorage.setItem(`plantilla-${plantilla}-selected`, JSON.stringify(selectedIds));

    alert("Viáticos guardados correctamente en la plantilla.");
    router.refresh();
};


  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <input type="text" placeholder="Buscar..." className="border rounded px-3 py-1 w-64" />
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">  Buscar </button>
        </div>
        <div className="flex space-x-2">
          <button className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1" onClick={guardarPlantilla}  >
            <span>Guardar Plantilla</span>
          </button>
          <button className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1" onClick={abrirModalCrear} >
            <span>Agregar</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-center">
                <input type="checkbox" checked={selectedIds.length === viaticos.length && viaticos.length > 0} onChange={toggleSelectAll} />
              </th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {viaticos.map((item, index) => (
              <tr key={item.uniqueId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-center">
                  <input type="checkbox" checked={selectedIds.includes(item.uniqueId)} onChange={() => toggleSelect(item.uniqueId)}  />
                </td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.nombre}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.cantidad}</td>
                <td className="px-1 py-2 space-x-1 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600"  onClick={() => abrirModalEditar(item)} >  Editar </button>
                  <button onClick={() => deleteViatico(item)} className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded"> Eliminar  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición y creación */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">
              {isEditing ? 'Editar Caseta' : 'Agregar Caseta'}
            </h2>
            <input type="text" className="border rounded px-3 py-1 w-full" value={itemEditando.nombre} onChange={e => setItemEditando({ ...itemEditando, nombre: e.target.value })} placeholder="Concepto" />
            <input type="number" className="border rounded px-3 py-1 w-full"  value={itemEditando.cantidad}  onChange={e => setItemEditando({ ...itemEditando, cantidad: parseFloat(e.target.value) })}  placeholder="Monto"  />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded"> Cancelar  </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={guardarCambios} > {isEditing ? 'Guardar' : 'Crear'} </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
