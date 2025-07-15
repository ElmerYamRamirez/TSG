import { createCasetaPlantilla, updateCasetaPlantillaById, deleteCasetaPlantillaById, checkCaseta, deleteCasetasVinculadas, getCasetasVinculadas } from "components/actions";
import { CasetaPlantilla } from "components/interfaces/caseta_plantilla";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function Casetas({ casetas, plantilla }: { casetas: CasetaPlantilla[], plantilla: number }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<CasetaPlantilla | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const cargarSelectedIds = useCallback(async () => {
    const { ok, casetasVinculadas } = await getCasetasVinculadas(plantilla) ?? { ok: false, casetasVinculadas: [] };
    if (ok) {
      setSelectedIds(casetasVinculadas);
    } else {
      console.error("Error al cargar las casetas vinculadas.");
    }
  }, [plantilla]);

  useEffect(() => {
    cargarSelectedIds();
  }, [cargarSelectedIds]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(selectedIds.length === casetas.length ? [] : casetas.map(c => c.uniqueId));
  }, [casetas, selectedIds]);

  const abrirModalEditar = useCallback((item: CasetaPlantilla) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  }, []);

  const abrirModalCrear = useCallback(() => {
    setItemEditando({
      uniqueId: 0,
      precio: 0,
      nombre: '',
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString()
    });
    setIsEditing(false);
    setIsModalOpen(true);
  }, []);

  const handleDarDeBaja = useCallback(async (caseta: CasetaPlantilla) => {
    if (confirm(`¿Estás seguro de eliminar: ${caseta.nombre}?`)) {
      const { ok } = await deleteCasetaPlantillaById(caseta.uniqueId) ?? { ok: false };
      if (!ok) alert("Hubo un error al eliminar la caseta.");
      return ok;
    }
    return false;
  }, []);

  const deleteCaseta = useCallback(async (item: CasetaPlantilla) => {
    const deleted = await handleDarDeBaja(item);
    if (deleted) router.refresh();
  }, [handleDarDeBaja, router]);

  const handleCreate = useCallback(async (caseta: CasetaPlantilla) => {
    return await createCasetaPlantilla(caseta) ?? { ok: false, res: [] };
  }, []);

  const handleEdit = useCallback(async (caseta: CasetaPlantilla) => {
    return await updateCasetaPlantillaById(caseta) ?? { ok: false, casetas: [] };
  }, []);

  const guardarCambios = useCallback(async () => {
    if (!itemEditando) return;
    const response = isEditing ? await handleEdit(itemEditando) : await handleCreate(itemEditando);
    if (response.ok) router.refresh();
    else alert('Error al guardar');
    setIsModalOpen(false);
  }, [handleCreate, handleEdit, isEditing, itemEditando, router]);

  const guardarPlantilla = useCallback(async () => {
    if (selectedIds.length === 0) return alert("Selecciona al menos una caseta");

    // Eliminar las casetas vinculadas existentes
    const { ok: deleted } = await deleteCasetasVinculadas(plantilla);
    if (!deleted) return alert("Error al limpiar casetas anteriores.");

    // Vincular las nuevas casetas
    for (const casetaId of selectedIds) {
      const item = { 
        caseta: casetaId, 
        destino: plantilla, 
        Fec_Alta: new Date().toISOString() };
      const { ok } = await checkCaseta(item) ?? { ok: false };
      if (!ok) return alert("Error al guardar alguna caseta.");
    }

    alert("Plantilla actualizada correctamente.");
    router.refresh();
  }, [plantilla, selectedIds]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <input type="text" placeholder="Buscar..." className="border rounded px-3 py-1 w-64" />
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Buscar</button>
        </div>
        <div className="flex space-x-2">
          <button onClick={guardarPlantilla} className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1">
            <span>Guardar Plantilla</span>
          </button>
          <button onClick={abrirModalCrear} className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1">
            <span>Agregar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === casetas.length && casetas.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {casetas.map((item, index) => (
              <tr key={item.uniqueId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.uniqueId)}
                    onChange={() => toggleSelect(item.uniqueId)}
                  />
                </td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.nombre}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.precio}</td>
                <td className="px-1 py-2 space-x-1 text-xs text-indigo-600 font-medium">
                  <button onClick={() => abrirModalEditar(item)} className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600">Editar</button>
                  <button onClick={() => deleteCaseta(item)} className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              value={itemEditando.precio}
              onChange={e => setItemEditando({ ...itemEditando, precio: parseFloat(e.target.value) })}
              placeholder="Monto"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={guardarCambios} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditing ? 'Guardar' : 'Crear'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}