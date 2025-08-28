import { createThermo, updateThermoById, deleteThermoById, getRendimientoThermoByProgramacion, updateRendimientoThermoById, createRendimientoThermo } from "components/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThermoI } from "components/interfaces/thermo";
import { RendimientoThermo } from "components/interfaces/rendimiento_thermo";
import { ReporteThermo } from "components/interfaces/reporte_thermo";

const handleDarDeBaja = async(thermo: ThermoI) => {
  console.log('Dar de baja:', thermo);
  // Ejemplo: confirmar y hacer una petición a una API
  if (confirm(`¿Estás seguro de eliminar: ${thermo.litros}?`)) {
    //llamar server action to delete
    const { ok } = await deleteThermoById(thermo.uniqueId) ?? { ok: false, thermos: [] };

    if (!ok) {
      alert("Hubo un error al eliminar la carga.");
    }
  }
}

const handleCreate = async (thermo: ThermoI) => {
  //llamar server action to create
  const { ok, res } = await createThermo(thermo) ?? { ok: false, res: [] }
  return { ok, res }
}

const handleEdit = async (thermo: ThermoI) => {
  const response = await updateThermoById(thermo) ?? { ok: false, res: [] };
  const thermos = response.res ?? [];
  return { ok: response.ok, thermos };
}


export default function CombustiblesThermos({ thermos, programacion, reporte_thermo}: {thermos: ThermoI[], programacion: number, reporte_thermo: ReporteThermo }) {
const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemEditando, setItemEditando] = useState<ThermoI | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();
  const reporte = reporte_thermo ?? {};

  ////Litros
  const [isLitrosModalOpen, setIsLitrosModalOpen] = useState(false);
  const [litrosIniciales, setLitrosIniciales] = useState('');
  const [litrosFinales, setLitrosFinales] = useState('');
  const [precioLitroInicial, setPrecioLitroInicial] = useState('');
 // Fechas
   const [isFechasModalOpen, setIsFechasModalOpen] = useState(false);
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');

//////Modal litros thermo
const abrirModalLitros = async () => {
    try {
      const existente = await getRendimientoThermoByProgramacion(programacion);
      if (existente) {
        setLitrosIniciales(existente.litros_iniciales?.toString() ?? '');
        setLitrosFinales(existente.litros_finales?.toString() ?? '');
        setPrecioLitroInicial(existente.precio_litro_inicial?.toString() ?? '');

      } else {
        setLitrosIniciales('');
        setLitrosFinales('');
        setPrecioLitroInicial('');

      }

      setIsLitrosModalOpen(true);
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      alert("Error al abrir el modal de litros .");
    }
  };

  const abrirModalFechas = async () => {
  try {
    const existente = await getRendimientoThermoByProgramacion(programacion);

    if (existente) {
      if (fechaInicial === '') {
        setFechaInicial(formatDateTimeLocal(existente.fecha_inicial) ?? '');
      }
      if (fechaFinal === '') {
        setFechaFinal(formatDateTimeLocal(existente.fecha_final) ?? '');
      }
    }
    setIsFechasModalOpen(true);
  } catch (error) {
    console.error("Error al abrir el modal:", error);
    alert("Error al abrir el modal de fechas.");
  }
};

  // Modal cargas thermo
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
      programacion,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };
  const deleteThermoById = async (item: ThermoI) => {
      await handleDarDeBaja(item);
      router.refresh();
    }

    ///Guardar litros thermo
    const guardarLitros = async () => {
    try {
    
      const existente = await getRendimientoThermoByProgramacion(programacion);

      const datos: RendimientoThermo = {
        ...existente,
        uniqueId: existente ? existente.uniqueId : 0,
        Bit_Activo: 1,
        Fec_Alta: new Date().toISOString(),
        ////precio litros 
       /* precio_litro_gas: parseFloat(precioLitroGas) || 0,*/
        litros_iniciales: parseFloat(litrosIniciales) || 0,
        litros_finales: parseFloat(litrosFinales) || 0,
        precio_litro_inicial: parseFloat(precioLitroInicial) || 0,
        programacion: programacion,
      };

      let response;

      if (existente) {
        response = await updateRendimientoThermoById(datos);
      } else {
        response = await createRendimientoThermo(datos);
      }

      if (response.ok) {
        alert("Litros guardados.");
        setIsLitrosModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar litros.");
      }

    } catch (error) {
      console.error("Error al guardar litros:", error);
      alert("Error inesperado.");
    }
  };

  const guardarFechas = async () => {
    try {
    
      const existente = await getRendimientoThermoByProgramacion(programacion);

      const datos: RendimientoThermo = {
        ...existente,
        uniqueId: existente ? existente.uniqueId : 0,
        Bit_Activo: 1,
        Fec_Alta: new Date().toISOString(),
        fecha_inicial: toSQLDateTimeLocal(fechaInicial),
        fecha_final: toSQLDateTimeLocal(fechaFinal),
        programacion: programacion,
      };

      let response;

      if (existente) {
        response = await updateRendimientoThermoById(datos);
      } else {
        response = await createRendimientoThermo(datos);
      }

      if (response.ok) {
        alert("Fechas guardadas.");
        setIsFechasModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar horas.");
      }

    } catch (error) {
      console.error("Error al guardar horas:", error);
      alert("Error inesperado.");
    }
  };
///////Guardar cambios thermo
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
////HORAS
const formatDateTimeLocal = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16); 
};

const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(dateString).toLocaleString("es-MX", options); 
};

const toSQLDateTimeLocal = (date: string | null | undefined): string | undefined => {
  if (!date || date.trim() === "") return undefined;
  return date.replace("T", " ") + ":00";
};

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reporte Thermo</h3>
        <div className="flex space-x-2">
           
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalLitros}
        >
          <span>Agregar Litros</span>
        </button>
        <button
          className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
          onClick={abrirModalFechas}
        >
          <span>Agregar Fechas</span>
        </button>
      </div>
      </div>

      {/* Reporte thermo */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Iniciales</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Finales</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros Consumidos</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Precio por Litro</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha Inicial</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha Final</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Horas de Uso</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Costo por Litro</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Costo Consumido total</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Rendimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.litros_iniciales ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.litros_finales ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.litros_consumidos ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.precio_litro_inicial ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{formatDateTime(reporte.fecha_inicial) ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{formatDateTime(reporte.fecha_final) ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.horas_uso_thermo ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.costo_por_litro ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.costo_consumido ?? ""}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte.rendimiento ?? ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
      

      {/* Listado cargas */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold text-gray-700">Cargas Thermos</h3>
        <button
          className="bg-emerald-500 text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-600"
          onClick={abrirModalCrear}
        >
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-15 py-2 text-left text-xs font-semibold text-gray-900">Litros</th>
              <th className="px-15 py-2 text-left text-xs font-semibold text-gray-900">Precio</th>
              <th className="px-15 py-2 text-left text-xs font-semibold text-gray-900">Total</th>
              <th className="px-20 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 space-x-2 ">
            {(thermos || []).map((item) => (
              <tr key={item.uniqueId}>
                <td className="px-16 py-2 text-xs text-gray-700">{item.litros}</td>
                <td className="px-16 py-2 text-xs text-gray-700">{item.precio_litro}</td>
                <td className="px-16 py-2 text-xs text-gray-700">{item.total}</td>
                <td className="px-20 py-2 space-x-2 flex">
                  <button
                    className="bg-blue-500 text-white px-2 py-0.5 text-xs rounded hover:bg-blue-600"
                    onClick={() => abrirModalEditar(item)}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteThermoById(item)}
                    className="bg-red-100 px-2 py-0.5 text-xs text-red-600 border border-red-400 rounded hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Modal Litros */}
        {isLitrosModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
              <h2 className="text-lg font-bold mb-2">Agregar Litros</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Litros iniciales</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full"
                  value={litrosIniciales}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setLitrosIniciales(val);
                      return;
                    }
                    const numVal = Number(val);
                    if (numVal >= 0 && numVal <= 100) {
                      setLitrosIniciales(val);
                    }
                  }}
                  placeholder="Litros iniciales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Litros finales</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full"
                  value={litrosFinales}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setLitrosFinales(val);
                      return;
                    }
                    const numVal = Number(val);
                    if (numVal >= 0 && numVal <= 100) {
                      setLitrosFinales(val);
                    }
                  }}
                  placeholder="Litros finales"
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Litro</label>
              <input
               type="number"
               step="0.01"
               className="border rounded px-3 py-2 w-full"
               value={precioLitroInicial}
               onChange={(e) => setPrecioLitroInicial(e.target.value)}
               placeholder="Precio Litro "
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


{/* Modal Horas */}
        {isFechasModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
              <h2 className="text-lg font-bold mb-2">Agregar Fechas</h2>
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
                  <input
                    type="datetime-local"
                    className="border rounded px-3 py-2 w-full"
                    value={fechaInicial}
                    onChange={(e) => setFechaInicial(e.target.value)}
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
                <input
                  type="datetime-local"
                  className="border rounded px-3 py-2 w-full"
                  value={fechaFinal}
                  onChange={(e) => setFechaFinal(e.target.value)}
                />
              </div>


              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                  onClick={() => setIsFechasModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={guardarFechas}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
          </div>
        )}

      {/* Modal de edicion */}
      {isModalOpen && itemEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Carga Thermo' : 'Agregar Carga Thermo'}</h2>

            <div>
              <label>Litros</label>
              <input type="number" className="border rounded px-3 py-2 w-full"
                value={itemEditando.litros}
                onChange={(e) => {
                  const litros = parseFloat(e.target.value) || 0;
                  setItemEditando({ ...itemEditando, litros, total: litros * itemEditando.precio_litro });
                }}
              />
            </div>

            <div>
              <label>Precio Litro</label>
              <input type="number" className="border rounded px-3 py-2 w-full"
                value={itemEditando.precio_litro}
                onChange={(e) => {
                  const precio_litro = parseFloat(e.target.value) || 0;
                  setItemEditando({ ...itemEditando, precio_litro, total: itemEditando.litros * precio_litro });
                }}
              />
            </div>

            <div>
              <label>Total</label>
              <input type="number" className="border rounded px-3 py-2 w-full" value={itemEditando.total} readOnly />
            </div>

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
