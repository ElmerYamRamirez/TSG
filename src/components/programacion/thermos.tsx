import { createThermo, updateThermoById} from "components/actions";
import { deleteThermoById} from "components/actions";
import { useRouter } from "next/navigation";
import { useState} from 'react';
import { ThermoI } from "components/interfaces/thermo";
import { RendimientoThermo } from "components/interfaces/rendimiento_thermo";
import { ReporteThermo } from "components/interfaces/reporte_thermo";
import {getRendimientoThermoByProgramacion,updateRendimientoThermoById,createRendimientoThermo} from "components/actions";

export default function CombustiblesThermos({ thermos, programacion, reporte_thermo, rendimiento_thermo}: { thermos: ThermoI[], programacion: number, reporte_thermo: ReporteThermo, rendimiento_thermo: RendimientoThermo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<ThermoI | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Estado para el modal de RendimientoThermo
  const [isRendimientoThermoModalOpen, setIsRendimientoThermoModalOpen] = useState(false);
  const [litrosIniciales, setLitrosIniciales] = useState<string>(rendimiento_thermo?.litros_iniciales?.toString() ?? '');
  const [litrosFinales, setLitrosFinales] = useState<string>(rendimiento_thermo?.litros_finales?.toString() ?? '');

  // Abrir modal de rendimiento
  const abrirModalRendimientoThermo = () => {
    setLitrosIniciales(rendimiento_thermo?.litros_iniciales?.toString() ?? '');
    setLitrosFinales(rendimiento_thermo?.litros_finales?.toString() ?? '');
    setIsRendimientoThermoModalOpen(true);
  };

  // Guardar rendimiento
  const guardarRendimientoThermo = async () => {
    const datos: RendimientoThermo = {
      ...rendimiento_thermo,
      uniqueId: rendimiento_thermo?.uniqueId ?? 0,
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString(),
      litros_iniciales: litrosIniciales === '' ? null : parseFloat(litrosIniciales),
      litros_finales: litrosFinales === '' ? null : parseFloat(litrosFinales),
      programacion: programacion,
    };

    let response;
    if (rendimiento_thermo && rendimiento_thermo.uniqueId) {
      response = await updateRendimientoThermoById(datos);
    } else {
      response = await createRendimientoThermo(datos);
    }

    if (response.ok) {
      alert("Rendimiento guardado.");
      setIsRendimientoThermoModalOpen(false);
      router.refresh();
    } else {
      alert("Error al guardar rendimiento.");
    }
  };

  // Modal Combustibles
  const abrirModalEditar = (item: ThermoI) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      litros: 0,
      precio_litro: 0,
      total: 0,
      fecha_inicio: new Date().toISOString().split("T")[0],
      Fecha_final: new Date().toISOString().split("T")[0],
      horas_uso_thermo: 0,
      programacion: programacion,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCreate = async (item: ThermoI) => {
    return await createThermo(item);
  };

  const handleEdit = async (item: ThermoI) => {
    return await updateThermoById(item);
  };

  const handleDelete = async (item: ThermoI) => {
    if (confirm(`¿Eliminar carga del ${item.fecha_inicio}?`)) {
      await deleteThermoById(item.uniqueId);
      router.refresh();
    }
  };

  // Guardar Carga de Combustible
  const guardarCambios = async () => {
    if (!itemEditando) return;

    let response;
    if (isEditing) {
      response = await handleEdit(itemEditando);
    } else {
      response = await handleCreate(itemEditando);
    }

    if (response && response.ok) {
      router.refresh();
    } else {
      alert('Error al guardar');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reporte Thermo</h3>
        <div className="flex space-x-2">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalRendimientoThermo}
          >
            <span>Editar Litros Iniciales/Finales</span>
          </button>
        </div>
      </div>

      {/* Tabla de RendimientoThermo */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Iniciales</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Finales</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Horas Uso Thermo</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio Litro</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Cargados</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Costo cargas</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Rendimiento</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Costo consumido total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-xs text-gray-700">{rendimiento_thermo?.litros_iniciales ?? ''}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{rendimiento_thermo?.litros_finales ?? ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    <div className="border-t border-gray-300 my-4"></div>

     <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Listado de Cargas Hibrido</h3>
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalCrear}
        >
          <span>Agregar</span>
        </button>
      </div>

      {/* Tabla de cargas */}
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha Inicio</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha Final</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio Litro</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Total</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Horas Uso</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(thermos || []).map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-1 text-xs text-gray-700">{item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : ''}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.Fecha_final ? new Date(item.Fecha_final).toLocaleDateString() : ''}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.litros}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.precio_litro}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.total}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{item.horas_uso_thermo}</td>
                <td className="px-2 py-1 space-x-2 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(item)}>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal RendimientoThermo */}
      {isRendimientoThermoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Editar Litros Iniciales y Finales</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros Iniciales</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={litrosIniciales}
                onChange={e => setLitrosIniciales(e.target.value)}
                placeholder="Litros Iniciales"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros Finales</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={litrosFinales}
                onChange={e => setLitrosFinales(e.target.value)}
                placeholder="Litros Finales"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsRendimientoThermoModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarRendimientoThermo}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Carga Thermo' : 'Agregar Carga Thermo'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.fecha_inicio}
                 onChange={(e) =>
            setItemEditando({ ...itemEditando, fecha_inicio: e.target.value })
          }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Fecha_final}
                 onChange={(e) =>
            setItemEditando({ ...itemEditando, Fecha_final: e.target.value })
          }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.litros}
                onChange={(e) => { const litros = parseFloat(e.target.value) || 0; setItemEditando({  ...itemEditando,litros, total: litros * itemEditando.precio_litro, }); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Litro</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.precio_litro}
                onChange={(e) => {
            const precio_litro = parseFloat(e.target.value) || 0;
            setItemEditando({
              ...itemEditando,
              precio_litro,
              total: itemEditando.litros * precio_litro,
            });
          }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.total}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas Uso Thermo</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.horas_uso_thermo}
                onChange={(e) =>
            setItemEditando({
              ...itemEditando,
              horas_uso_thermo: parseInt(e.target.value) || 0,
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
        )}
    </div>
  );
}