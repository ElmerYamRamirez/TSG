import { createCombustible, updateCombustibleById, deleteCombustibleById} from "components/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CombustibleI } from "components/interfaces/combustibles";
import { Rendimiento } from "components/interfaces/rendimientos";
import { createRendimiento ,updateRendimientoById, getRendimientoByProgramacion} from "components/actions";
import { ReporteCombustibleI } from "components/interfaces/reporteCombustible";

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
  const response = await updateCombustibleById(combustible) ?? { ok: false, res: [] };
  const combustibles = response.res ?? [];
  return { ok: response.ok, combustibles };
}

export default function Combustibles({ combustibles, programacion, reporte }: { combustibles: CombustibleI[], programacion: number, reporte: ReporteCombustibleI }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemEditando, setItemEditando] = useState<CombustibleI | null>(null)
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)

  // Rendimiento ideal
  const [isRendimientoModalOpen, setIsRendimientoModalOpen] = useState(false);
  const [rendimientoIdeal, setRendimientoIdeal] = useState('');
  const [litrosIdeales, setLitrosIdeales] = useState('');
  const [rendimientoId, setRendimientoId] = useState<number | null>(null);

  ///Litros consumidos 
  const [isLitrosModalOpen, setIsLitrosModalOpen] = useState(false);
  const [litrosIniciales, setLitrosIniciales] = useState('');
  const [litrosFinales, setLitrosFinales] = useState('');
  const [precioPorLitro, setPrecioPorLitro] = useState('');


  // Kilometrajes
  const [isKilometrajeModalOpen, setIsKilometrajeModalOpen] = useState(false);
  const [KilometrajeInicial, setKilometrajeInicial] = useState('');
  const [KilometrajeFinal, setKilometrajeFinal] = useState('');
  
  //Modal Rendimiento
  const abrirModalRendimiento = async () => {
  try {
    const rendimientoExistente = await getRendimientoByProgramacion(programacion);
    
    if (rendimientoExistente) {
      setRendimientoId(rendimientoExistente.uniqueId);
      setRendimientoIdeal(rendimientoExistente.rendimiento_ideal?.toString() || '');
      setLitrosIdeales(rendimientoExistente.litros_ideales?.toString() || '');
    } else {
      setRendimientoId(null);
      setRendimientoIdeal('');
      setLitrosIdeales('');
    }
    
    setIsRendimientoModalOpen(true);
  } catch (error) {
    console.error("Error al cargar rendimiento:", error);
    alert("Error al cargar el rendimiento existente");
  }
};

//////Modal litros consumidos 
const abrirModalLitros = async () => {
  try {
    const rendimientoExistente = await getRendimientoByProgramacion(programacion);

    if (rendimientoExistente) {
      setRendimientoId(rendimientoExistente.uniqueId);
      setLitrosIniciales((rendimientoExistente.litros_iniciales ?? '').toString());
      setLitrosFinales((rendimientoExistente.litros_finales ?? '').toString());
      setPrecioPorLitro((rendimientoExistente.precio_litro ?? '').toString());

    } else {
      setRendimientoId(null);
      setLitrosIniciales('');
      setLitrosFinales('');
      setPrecioPorLitro('');
    }

      setIsLitrosModalOpen(true);
    } catch (error) {
      console.error("Error al cargar litros:", error);
      alert("Error al cargar los litros consumidos.");
    }
  };

  // Modal Kilometrajes
  const abrirModalKilometraje = async () => {
  try {
    const rendimientoExistente = await getRendimientoByProgramacion(programacion);
    
    if (rendimientoExistente) {
      setRendimientoId(rendimientoExistente.uniqueId);
      setKilometrajeInicial((rendimientoExistente.km_inicial ?? '').toString());
      setKilometrajeFinal((rendimientoExistente.km_final ?? '').toString());

    } else {
      setRendimientoId(null);
      setKilometrajeInicial('');
      setKilometrajeFinal('');
    }
    
    setIsKilometrajeModalOpen(true);
  } catch (error) {
    console.error("Error al cargar rendimiento:", error);
    alert("Error al cargar el rendimiento existente");
  }
};

  //Modal Combustibles
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
      comentario: '',
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

  /// Guardar litros consumidos 
  const guardarLitros = async () => {
    try {
      const rendimientoExistente = await getRendimientoByProgramacion(programacion);

      const data: Rendimiento = {
        uniqueId: rendimientoExistente?.uniqueId || 0,
        rendimiento_ideal: rendimientoExistente?.rendimiento_ideal ?? null,
        litros_ideales: rendimientoExistente?.litros_ideales ?? null,
        litros_iniciales: parseFloat(litrosIniciales),
        litros_finales: parseFloat(litrosFinales),
        precio_litro: parseFloat(precioPorLitro),
        km_inicial: rendimientoExistente?.km_inicial ?? null,
        km_final: rendimientoExistente?.km_final ?? null,
        programacion,
      };

      const response = rendimientoExistente
        ? await updateRendimientoById(data)
        : await createRendimiento(data);

      if (response?.ok) {
        setIsLitrosModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar los litros consumidos.");
      }
    } catch (error) {
      console.error("Error al guardar litros:", error);
      alert("Error al guardar los litros consumidos");
    }
  };

  // Guardar Kilometraje
  const guardarKilometraje = async () => {
  try {
    const rendimientoExistente = await getRendimientoByProgramacion(programacion);

    const data: Rendimiento = {
      uniqueId: rendimientoExistente?.uniqueId || 0,
      rendimiento_ideal: rendimientoExistente?.rendimiento_ideal ?? null,
      litros_ideales: rendimientoExistente?.litros_ideales ?? null,
      km_inicial: parseFloat(KilometrajeInicial),
      km_final: parseFloat(KilometrajeFinal),
      litros_iniciales: rendimientoExistente?.litros_iniciales ?? null,
      litros_finales: rendimientoExistente?.litros_finales ?? null,
      programacion,
    };

    const response = rendimientoExistente
      ? await updateRendimientoById(data)
      : await createRendimiento(data);

    if (response?.ok) {
      setIsKilometrajeModalOpen(false);
      router.refresh();
    } else {
      alert("Error al guardar el kilometraje.");
    }
  } catch (error) {
    console.error("Error al guardar kilometraje:", error);
    alert("Error al guardar el kilometraje");
  }
};

  //Guardar Rendimiento
 const guardarRendimiento = async () => {
  try {
    const rendimientoExistente = await getRendimientoByProgramacion(programacion);
    const rendimientoData: Rendimiento = {
      uniqueId: rendimientoId || 0, // 0 si es nuevo
      rendimiento_ideal: parseFloat(rendimientoIdeal),
      litros_ideales: parseFloat(litrosIdeales),
      programacion: programacion,
      km_inicial: rendimientoExistente?.km_inicial ?? null,
      km_final: rendimientoExistente?.km_final ?? null,
      litros_iniciales: rendimientoExistente?.litros_iniciales ?? null,
      litros_finales: rendimientoExistente?.litros_finales ?? null,
      
    };

    let response;
    
      if (rendimientoId) {
        // Actualizar rendimiento existente
        response = await updateRendimientoById(rendimientoData);
      } else {
        // Crear nuevo rendimiento
        response = await createRendimiento(rendimientoData);
      }

      if (response?.ok) {
        setIsRendimientoModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar el rendimiento ideal.");
      }
    } catch (error) {
      console.error("Error al guardar rendimiento:", error);
      alert("Error al guardar el rendimiento");
    }
  };

  //Guardar Carga de Combustible
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

      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reporte Consumo</h3>
        
        <div className="flex space-x-2">
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalLitros}
        >
           <span>Agregar Litros Consumidos</span>
        </button>

          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalKilometraje}
          >
            <span>Agregar Kilometraje</span>
          </button>
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalRendimiento}
          >
            <span>Agregar Rendimiento</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio Total</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">km Final</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">km Inicial</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">KM Recorridos</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Rend Real</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Rend Ideal</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Ideal</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Dif litros</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Costo de FI</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Variacion</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.total}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.litros}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.km_final}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.km_inicial}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.km_recorridos}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.rendimiento_real}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.rendimiento_ideal}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.litros_ideal}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.diferencia_litros}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.precio}</td>
                <td className="px-2 py-1 text-xs text-gray-700">{reporte.costo_fi}</td>
                <td className="px-2 py-1 text-xs text-gray-700">%{reporte.variacion}</td>
              </tr>
            </tbody>
        </table>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Listado de Cargas</h3>
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
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Comentario</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio Total</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 space-x-2">
              {(combustibles || []).map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-2 py-1 text-xs text-gray-700">{item.fecha ? new Date(item.fecha).toISOString().split("T")[0] : "Sin fecha"}</td>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.comentario}</td>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.litros}</td>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.precio}</td>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.precio_total}</td>
                  
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

       {/* Modal Litros consumidos  */}
       {isLitrosModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Litros Consumidos</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros Iniciales</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={litrosIniciales}
                onChange={(e) => setLitrosIniciales(e.target.value)}
                placeholder="Litros Iniciales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros Finales</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={litrosFinales}
                onChange={(e) => setLitrosFinales(e.target.value)}
                placeholder="Litros Finales"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio por Litro</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={precioPorLitro}
                onChange={(e) => setPrecioPorLitro(e.target.value)}
                placeholder="Precio por Litro"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={() => setIsLitrosModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarLitros}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kilometraje */}
      {isKilometrajeModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Kilometraje</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje Inicial</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={KilometrajeInicial}
                onChange={(e) => setKilometrajeInicial(e.target.value)}
                placeholder="Kilometraje Incial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje Final</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={KilometrajeFinal}
                onChange={(e) => setKilometrajeFinal(e.target.value)}
                placeholder="Kilometraje Final"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={() => setIsKilometrajeModalOpen(false)}
              >
                Cancelar
              </button>
             <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarKilometraje}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rendimiento ideal */}
      {isRendimientoModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Rendimiento Ideal</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rendimiento Ideal</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={rendimientoIdeal}
                onChange={(e) => setRendimientoIdeal(e.target.value)}
                placeholder="Rendimiento Ideal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros Ideales</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={litrosIdeales}
                onChange={(e) => setLitrosIdeales(e.target.value)}
                placeholder="Litros Ideales"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={() => setIsRendimientoModalOpen(false)}
              >
                Cancelar
              </button>
             <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarRendimiento}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Viatico' : 'Agregar Carga de Combustible'}</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.comentario || ''}
                onChange={e => setItemEditando({ ...itemEditando, comentario: e.target.value })}
                placeholder="Agrega un comentario opcional"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.litros === 0 ? '' : itemEditando.litros?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const litros = value === '' ? 0 : parseFloat(value);
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
                value={itemEditando.precio === 0 ? '' : itemEditando.precio?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const precio = value === '' ? 0 : parseFloat(value);
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