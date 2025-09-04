'use client';
import { deleteConfiguracionTanqueById, updateConfiguracionTanqueById, createConfiguracionTanques } from "components/actions";
import { ConfiguracionTanquesI } from "components/interfaces/configuracion_tanques";
import { UnidadI } from "components/interfaces/unidad";
import { useRouter } from "next/navigation";
import { useState } from "react";

const handleCreate = async (item: ConfiguracionTanquesI) => {
  const response = await createConfiguracionTanques(item) ?? { ok: false };
  return response;
};

const handleEdit = async (configuracionTanques: ConfiguracionTanquesI) => {
  const response = await updateConfiguracionTanqueById(configuracionTanques) ?? { ok: false, res: [] };
  return { ok: response.ok };
};

const handleDarDeBaja = async (configuracionTanques: ConfiguracionTanquesI) => {
  if (confirm("¿Estás seguro de eliminar esta configuración?")) {
    const { ok } = await deleteConfiguracionTanqueById(configuracionTanques.uniqueId!) ?? { ok: false };
    if (!ok) {
      alert("Hubo un error al eliminar la configuración.");
    }
  }
};

export default function ConfiguracionTable({ configuracionTanques, unidades }: { configuracionTanques: ConfiguracionTanquesI[]; unidades: UnidadI[]; }) {
  const [itemEditando, setItemEditando] = useState<ConfiguracionTanquesI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const abrirModalEditar = (item: ConfiguracionTanquesI) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      litros_maximos_t1: 0,
      litros_maximos_t2: 0,
      litros_maximos_t3: 0,
      litros_maximos_t4: 0,
      litros_maximos_tg: 0,
      unidad: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;

    if (isEditing) {
      const response = await handleEdit(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al guardar cambios");
      }
    } else {
      const response = await handleCreate(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al crear configuración de tanques");
      }
    }

    setIsModalOpen(false);
  };

  const deleteConfiguracionTanqueById = async (item: ConfiguracionTanquesI) => {
    await handleDarDeBaja(item);
    router.refresh();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-2">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600"
            onClick={abrirModalCrear}
          >
            Agregar Configuración Tanque
          </button>
        </div>
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Unidad</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Tanque 1</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Tanque 2</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Tanque 3</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Tanque 4</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">TG</th>
              <th className="px-12 py-1 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {configuracionTanques.map((c, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-1 text-xs text-gray-700">{unidades.find((u) => u.uniqueId === c.unidad)?.Nombre ?? c.unidad}</td>
                <td className="px-15 py-1 text-xs text-gray-700">{c.litros_maximos_t1}</td>
                <td className="px-15 py-1 text-xs text-gray-700">{c.litros_maximos_t2}</td>
                <td className="px-15 py-1 text-xs text-gray-700">{c.litros_maximos_t3}</td>
                <td className="px-15 py-1 text-xs text-gray-700">{c.litros_maximos_t4}</td>
                <td className="px-12 py-1 text-xs text-gray-700">{c.litros_maximos_tg}</td>
                <td className="px-1 py-1 text-xs text-indigo-600 font-medium space-x-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600"
                    onClick={() => abrirModalEditar(c)}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteConfiguracionTanqueById(c)}
                    className="bg-red-100 hover:bg-red-200 px-2 py-0.5 text-red-500 border border-red-400 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-4">
              <h2 className="text-lg font-bold text-center">
                {isEditing ? "Editar Configuración" : "Agregar Configuración"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">UNIDAD</label>
                  <select
                    value={itemEditando.unidad ?? ""}
                    onChange={(e) => setItemEditando({ ...itemEditando, unidad: Number(e.target.value) })}
                    className="border rounded px-3 py-2 w-full text-xs"
                  >
                    <option value="">Selecciona unidad</option>
                    {unidades
                      .filter((u) => u.combustible === "Gas/Gasolina")
                      .filter((u) => !configuracionTanques.some((c) => c.unidad === u.uniqueId))
                      .map((u) => (
                        <option key={u.uniqueId} value={u.uniqueId}>
                          {u.Nombre}
                        </option>
                      ))}
                  </select>
                </div>
                {(["litros_maximos_t1", "litros_maximos_t2", "litros_maximos_t3", "litros_maximos_t4", "litros_maximos_tg"] as (keyof ConfiguracionTanquesI)[]).map(
                  (field, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {field.replace("litros_maximos_", "Litros maximos ").toUpperCase()}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="border rounded px-3 py-2 w-full text-xs"
                        value={itemEditando[field] === 0 ? "" : itemEditando[field]?.toString() ?? ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                          setItemEditando({ ...itemEditando, [field]: value });
                        }}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={guardarCambios}
                >
                  {isEditing ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
