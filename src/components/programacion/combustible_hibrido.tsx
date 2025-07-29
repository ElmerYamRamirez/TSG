import { createCombustibleHibrido, updateCombustibleHibridoById, deleteCombustibleHibridoById} from "components/actions";
import { createRendimientoHibrido, getRendimientoHibridoByProgramacion, updateRendimientoHibridoById} from "components/actions";
import { useRouter } from "next/navigation";
import { useState} from 'react';
import { CombustibleHibrido } from "components/interfaces/combustible_hibrido";
import { RendimientoHibrido } from "components/interfaces/rendimiento_hibrido";
import { ReporteHibrido } from "components/interfaces/reporte_hibrido";

const handleDarDeBaja = async(combustible: CombustibleHibrido) => {
  console.log('Dar de baja:', combustible);
  // Ejemplo: confirmar y hacer una petición a una API
  if (confirm(`¿Estás seguro de eliminar: ${combustible.Fecha_Carga}?`)) {
    //llamar server action to delete
    const { ok } = await deleteCombustibleHibridoById(combustible.uniqueId) ?? { ok: false, combustibles: [] };

    if (!ok) {
      alert("Hubo un error al eliminar la carga.");
    }
  }
}

const handleCreate = async (combustible: CombustibleHibrido) => {
  //llamar server action to create
  const { ok, res } = await createCombustibleHibrido(combustible) ?? { ok: false, res: [] }
  return { ok, res }
}

const handleEdit = async (combustible: CombustibleHibrido) => {
  const response = await updateCombustibleHibridoById(combustible) ?? { ok: false, res: [] };
  const combustibles = response.res ?? [];
  return { ok: response.ok, combustibles };
}

export default function CombustiblesHibrido({ combustibles, programacion, reporte_hibrido}: { combustibles: CombustibleHibrido[], programacion: number, reporte_hibrido: ReporteHibrido }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemEditando, setItemEditando] = useState<CombustibleHibrido | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  //Porcentajes Iniciales
  const [isPorcentajesInicialesModalOpen, setIsPorcentajesInicialesModalOpen] = useState(false);
  const [PorcentajeInicialT1, setPorcentajeInicialT1] = useState('');
  const [PorcentajeInicialT2, setPorcentajeInicialT2] = useState('');
  const [PorcentajeInicialT3, setPorcentajeInicialT3] = useState('');
  const [PorcentajeInicialT4, setPorcentajeInicialT4] = useState('');
  const [PorcentajeInicialTG, setPorcentajeInicialTG] = useState('');

  //Porcentajes Finales
  const [isPorcentajesFinalesModalOpen, setIsPorcentajesFinalesModalOpen] = useState(false);
  const [PorcentajeFinalT1, setPorcentajeFinalT1] = useState('');
  const [PorcentajeFinalT2, setPorcentajeFinalT2] = useState('');
  const [PorcentajeFinalT3, setPorcentajeFinalT3] = useState('');
  const [PorcentajeFinalT4, setPorcentajeFinalT4] = useState('');
  const [PorcentajeFinalTG, setPorcentajeFinalTG] = useState('');

  //Kilometrajes
  const [isKilometrajesModalOpen, setIsKilometrajesModalOpen] = useState(false);
  const [KilometrajeInicial, setKilometrajeInicial] = useState('');
  const [KilometrajeFinal, setKilometrajeFinal] = useState('');

  //Modal Porcentajes Iniciales
  const abrirModalPorcentajesIniciales = async () => {
    try {
      const existente = await getRendimientoHibridoByProgramacion(programacion);
      if (existente) {
        setPorcentajeInicialT1(existente.Porcentaje_Inicial_T1?.toString() ?? '');
        setPorcentajeInicialT2(existente.Porcentaje_Inicial_T2?.toString() ?? '');
        setPorcentajeInicialT3(existente.Porcentaje_Inicial_T3?.toString() ?? '');
        setPorcentajeInicialT4(existente.Porcentaje_Inicial_T4?.toString() ?? '');
        setPorcentajeInicialTG(existente.Porcentaje_Inicial_TG?.toString() ?? '');
      } else {
        setPorcentajeInicialT1('');
        setPorcentajeInicialT2('');
        setPorcentajeInicialT3('');
        setPorcentajeInicialT4('');
        setPorcentajeInicialTG('');
      }

      setIsPorcentajesInicialesModalOpen(true);
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      alert("Error al abrir el modal de porcentajes iniciales.");
    }
  };

  //Modal Porcentajes Finales
  const abrirModalPorcentajesFinales = async () => {
    try {
      const existente = await getRendimientoHibridoByProgramacion(programacion);
      if (existente) {
        setPorcentajeFinalT1(existente.Porcentaje_Final_T1?.toString() ?? '');
        setPorcentajeFinalT2(existente.Porcentaje_Final_T2?.toString() ?? '');
        setPorcentajeFinalT3(existente.Porcentaje_Final_T3?.toString() ?? '');
        setPorcentajeFinalT4(existente.Porcentaje_Final_T4?.toString() ?? '');
        setPorcentajeFinalTG(existente.Porcentaje_Final_TG?.toString() ?? '');
      } else {
        setPorcentajeFinalT1('');
        setPorcentajeFinalT2('');
        setPorcentajeFinalT3('');
        setPorcentajeFinalT4('');
        setPorcentajeFinalTG('');
      }

      setIsPorcentajesFinalesModalOpen(true);
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      alert("Error al abrir el modal de porcentajes finales.");
    }
  };

  //Modal Kilometrajes
  const abrirModalKilometraje = async () => {
    try {
      const existente = await getRendimientoHibridoByProgramacion(programacion);
      if (existente) {
        setKilometrajeInicial(existente.Km_Inicial?.toString() ?? '');
        setKilometrajeFinal(existente.Km_Final?.toString() ?? '');
      } else {
        setKilometrajeInicial('');
        setKilometrajeFinal('');
      }

      setIsKilometrajesModalOpen(true);
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      alert("Error al abrir el modal de kilometrajes.");
    }
  };

  //Modal Combustibles
  const abrirModalEditar = (item: CombustibleHibrido) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      uniqueId: 0,
      Fecha_Carga: new Date().toISOString().split("T")[0],
      Litros_T1: 0,
      Litros_T2: 0,
      Litros_T3: 0,
      Litros_T4: 0,
      Litros_TG: 0,
      programacion: programacion,
      Bit_Activo: 1,
      Fec_Alta: new Date().toISOString(),
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const deleteCombustibleHibrido = async (item: CombustibleHibrido) => {
    await handleDarDeBaja(item);
    router.refresh();
  }

  // Guardar Porcentajes Iniciales 
  const guardarPorcentajesIniciales = async () => {
    try {
    
      const existente = await getRendimientoHibridoByProgramacion(programacion);

      const datos: RendimientoHibrido = {
        ...existente,
        uniqueId: existente ? existente.uniqueId : 0,
        Bit_Activo: 1,
        Fec_Alta: new Date().toISOString(),
        Porcentaje_Inicial_T1: parseFloat(PorcentajeInicialT1) || 0,
        Porcentaje_Inicial_T2: parseFloat(PorcentajeInicialT2) || 0,
        Porcentaje_Inicial_T3: parseFloat(PorcentajeInicialT3) || 0,
        Porcentaje_Inicial_T4: parseFloat(PorcentajeInicialT4) || 0,
        Porcentaje_Inicial_TG: parseFloat(PorcentajeInicialTG) || 0,
        programacion: programacion,
      };

      let response;

      if (existente) {
        response = await updateRendimientoHibridoById(datos);
      } else {
        response = await createRendimientoHibrido(datos);
      }

      if (response.ok) {
        alert("Porcentajes iniciales guardados.");
        setIsPorcentajesInicialesModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar porcentajes iniciales.");
      }

    } catch (error) {
      console.error("Error al guardar porcentajes iniciales:", error);
      alert("Error inesperado.");
    }
  };

  // Guardar Porcentajes Finales
  const guardarPorcentajesFinales = async () => {
    try {
    
      const existente = await getRendimientoHibridoByProgramacion(programacion);

      const datos: RendimientoHibrido = {
        ...existente,
        uniqueId: existente ? existente.uniqueId : 0,
        Bit_Activo: 1,
        Fec_Alta: new Date().toISOString(),
        Porcentaje_Final_T1: parseFloat(PorcentajeFinalT1) || 0,
        Porcentaje_Final_T2: parseFloat(PorcentajeFinalT2) || 0,
        Porcentaje_Final_T3: parseFloat(PorcentajeFinalT3) || 0,
        Porcentaje_Final_T4: parseFloat(PorcentajeFinalT4) || 0,
        Porcentaje_Final_TG: parseFloat(PorcentajeFinalTG) || 0,
        programacion: programacion,
      };

      let response;

      if (existente) {
        response = await updateRendimientoHibridoById(datos);
      } else {
        response = await createRendimientoHibrido(datos);
      }

      if (response.ok) {
        alert("Porcentajes finales guardados.");
        setIsPorcentajesFinalesModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar porcentajes finales.");
      }

    } catch (error) {
      console.error("Error al guardar porcentajes finales:", error);
      alert("Error inesperado.");
    }
  };
 
  // Guardar Kilometrajes
  const guardarKilometrajes = async () => {
    try {
    
      const existente = await getRendimientoHibridoByProgramacion(programacion);

      const datos: RendimientoHibrido = {
        ...existente,
        uniqueId: existente ? existente.uniqueId : 0,
        Bit_Activo: 1,
        Fec_Alta: new Date().toISOString(),
        Km_Inicial: parseFloat(KilometrajeInicial) || 0,
        Km_Final: parseFloat(KilometrajeFinal) || 0,
        programacion: programacion,
      };

      let response;

      if (existente) {
        response = await updateRendimientoHibridoById(datos);
      } else {
        response = await createRendimientoHibrido(datos);
      }

      if (response.ok) {
        alert("Kilometrajes guardados.");
        setIsKilometrajesModalOpen(false);
        router.refresh();
      } else {
        alert("Error al guardar kilometrajes.");
      }

    } catch (error) {
      console.error("Error al guardar kilometrajes:", error);
      alert("Error inesperado.");
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
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reporte Consumo Hibrido</h3>
        
        <div className="flex space-x-2">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalKilometraje}
          >
            <span>Agregar Kilometrajes</span>
          </button>

          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalPorcentajesIniciales}
          >
            <span>Agregar Porcentajes Iniciales</span>
          </button>

          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalPorcentajesFinales}
          >
            <span>Agregar Porcentajes Finales</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">km Inicial</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">km Final</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Km_Recorridos</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Km_Rec_Gasolina</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Km_Rec_Gas</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Rendimiento</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_T1</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_T2</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_T3</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_T4</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_Total</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Consumo_TG</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.Km_Inicial}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.Km_Final}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.km_recorridos}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.km_rec_gasolina}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.km_rec_gas}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.rendimiento}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_t1}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_t2}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_t3}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_t4}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_total_gas}</td>
              <td className="px-2 py-1 text-xs text-gray-700">{reporte_hibrido.litros_consumidos_tg}</td>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Fecha de Carga</th>
              <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Litros T1</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros T2</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros T3</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros T4</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Litros TG</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 space-x-2">
            {(combustibles || []).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1 text-xs text-gray-700">{item.Fecha_Carga ? new Date(item.Fecha_Carga).toISOString().split("T")[0] : "Sin fecha"}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.Litros_T1}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.Litros_T2}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.Litros_T3}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.Litros_T4}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.Litros_TG}</td>
                <td className="px-1 py-2 space-x-2 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(item)}>
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCombustibleHibrido(item)}
                    className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Modal Porcentajes Iniciales*/}
       {isPorcentajesInicialesModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Porcentajes Iniciales</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 1</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeInicialT1}
                onChange={(e) => setPorcentajeInicialT1(e.target.value)}
                placeholder="Porcentaje T1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 2</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeInicialT2}
                onChange={(e) => setPorcentajeInicialT2(e.target.value)}
                placeholder="Porcentaje T2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 3</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeInicialT3}
                onChange={(e) => setPorcentajeInicialT3(e.target.value)}
                placeholder="Porcentaje T3"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 4</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeInicialT4}
                onChange={(e) => setPorcentajeInicialT4(e.target.value)}
                placeholder="Porcentaje T4"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque TG</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeInicialTG}
                onChange={(e) => setPorcentajeInicialTG(e.target.value)}
                placeholder="Porcentaje TG"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={() => setIsPorcentajesInicialesModalOpen(false)}
                >
                Cancelar
                </button>
                <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarPorcentajesIniciales}
                >
                Guardar
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Modal Porcentajes Finales*/}
        {isPorcentajesFinalesModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Porcentajes Finales</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 1</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeFinalT1}
                onChange={(e) => setPorcentajeFinalT1(e.target.value)}
                placeholder="Porcentaje T1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 2</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeFinalT2}
                onChange={(e) => setPorcentajeFinalT2(e.target.value)}
                placeholder="Porcentaje T2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 3</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeFinalT3}
                onChange={(e) => setPorcentajeFinalT3(e.target.value)}
                placeholder="Porcentaje T3"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque 4</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeFinalT4}
                onChange={(e) => setPorcentajeFinalT4(e.target.value)}
                placeholder="Porcentaje T4"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanque TG</label>
                <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={PorcentajeFinalTG}
                onChange={(e) => setPorcentajeFinalTG(e.target.value)}
                placeholder="Porcentaje TG"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
                onClick={() => setIsPorcentajesFinalesModalOpen(false)}
                >
                Cancelar
                </button>
                <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarPorcentajesFinales}
                >
                Guardar
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Modal Kilometraje */}
      {isKilometrajesModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold mb-2">Agregar Kilometrajes</h2>
            
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
                onClick={() => setIsKilometrajesModalOpen(false)}
              >
                Cancelar
              </button>
             <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarKilometrajes}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Carga</label>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Fecha_Carga ? new Date(itemEditando.Fecha_Carga).toISOString().split("T")[0] : ""}
                onChange={e => setItemEditando({ ...itemEditando, Fecha_Carga: e.target.value })}
                placeholder="Fecha_Carga"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros T1</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Litros_T1 === 0 ? '' : itemEditando.Litros_T1?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const Litros_T1 = value === '' ? 0 : parseFloat(value);
                  setItemEditando({
                    ...itemEditando,
                    Litros_T1,
                  });
                }}
                placeholder="Litros_T1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros T2</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Litros_T2 === 0 ? '' : itemEditando.Litros_T2?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const Litros_T2 = value === '' ? 0 : parseFloat(value);
                  setItemEditando({
                    ...itemEditando,
                    Litros_T2,
                  });
                }}
                placeholder="Litros_T2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros T3</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Litros_T3 === 0 ? '' : itemEditando.Litros_T3?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const Litros_T3 = value === '' ? 0 : parseFloat(value);
                  setItemEditando({
                    ...itemEditando,
                    Litros_T3,
                  });
                }}
                placeholder="Litros_T3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros T4</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Litros_T4 === 0 ? '' : itemEditando.Litros_T4?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const Litros_T4 = value === '' ? 0 : parseFloat(value);
                  setItemEditando({
                    ...itemEditando,
                    Litros_T4,
                  });
                }}
                placeholder="Litros_T4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Litros TG</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={itemEditando.Litros_TG === 0 ? '' : itemEditando.Litros_TG?.toString() ?? ''}
                onChange={e => {
                  const value = e.target.value;
                  const Litros_TG = value === '' ? 0 : parseFloat(value);
                  setItemEditando({
                    ...itemEditando,
                    Litros_TG,
                  });
                }}
                placeholder="Litros_TG"
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