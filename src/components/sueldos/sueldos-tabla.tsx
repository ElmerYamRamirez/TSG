'use client';

import { deleteSueldoById, updateSueldoById, createSueldo } from "components/actions";
import { Sueldo } from "components/interfaces/sueldo";
import { OperadorI } from "components/interfaces/operador";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Adelanto } from "components/interfaces/adelanto";
import { Prestamo } from "components/interfaces/prestamo";
import { ProgramacionI } from "components/interfaces/programacion";

const handleCreate = async (item: Sueldo) => {
  const response = await createSueldo(item) ?? { ok: false };
  return response;
};

const handleEdit = async (sueldo: Sueldo) => {
  const response = await updateSueldoById(sueldo) ?? { ok: false, res: [] };
  const combustibles = response.res ?? [];
  return { ok: response.ok, combustibles };
}

const handleDarDeBaja = async (sueldo: Sueldo) => {
  console.log('Dar de baja:', sueldo.codigo);
  if (confirm(`¿Estás seguro de eliminar: ${sueldo.operador_name}?`)) {
    const { ok } = await deleteSueldoById(sueldo) ?? { ok: false, sueldo: [] };
    if (!ok) {
      alert("Hubo un error al eliminar la programación.");
    }
  }
}

// Calcular el total de deducciones
const calcularTotalDeducciones = (item: Sueldo): number => {
  return (
    (item.Prestamo_Infonavit__CF_ || 0) +
    (item.Prestamo_infonavit__FD_ || 0) +
    (item.Prestamo_Infonavit__PORC_ || 0) +
    (item.Subs_al_Empleo__mes_ || 0) +
    (item.I_S_R___mes_ || 0) +
    (item.I_M_S_S_ || 0) +
    (item.Ajuste_al_neto || 0) +
    (item.Pension_Alimenticia || 0)
  );
};

export default function UserTable({ sueldos, operadores, adelantos, prestamos, programaciones }: { sueldos: Sueldo[], operadores: OperadorI[], adelantos: Adelanto[], prestamos: Prestamo[], programaciones: ProgramacionI[]}) {
  const [itemEditando, setItemEditando] = useState<Sueldo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const abrirModalEditar = (item: Sueldo) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      Percepcion_total: 0,
      Sueldo: null,
      Septimo_dia: null,
      Prestamo_infonavit__FD_: 0,
      Total_de_deducciones: 0,
      Prestamo_Infonavit__CF_: 0,
      Prestamo_Infonavit__PORC_: 0,
      Subs_al_Empleo__mes_: 0,
      I_S_R___mes_: 0,
      I_M_S_S_: 0,
      Ajuste_al_neto: 0,
      NETO: 0,
      Pension_Alimenticia: 0,
      codigo: 0,
      Empleado: '',
      Sueldo_Real: 0,
      Extra: 0,
      Bono_Puntualidad: null,
      Rebaje: 0,
      Sueldo_Real_Total: 0,
      operador_name: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleChange = (field: keyof Sueldo, value: string) => {
    if (!itemEditando) return;

    const numericValue = value === '' ? 0 : parseFloat(value);
    const updatedItem = { ...itemEditando, [field]: numericValue };

    // Recalcular Percepcion_total
    if (field === 'Sueldo' || field === 'Septimo_dia') {
      updatedItem.Percepcion_total = (updatedItem.Sueldo || 0) + (updatedItem.Septimo_dia || 0);
    }

    // Recalcular Sueldo_Real_Total
    if (field === 'Sueldo_Real' || field === 'Rebaje') {
      updatedItem.Sueldo_Real_Total = (updatedItem.Sueldo_Real || 0) - (updatedItem.Rebaje || 0);
    }

    // Recalcular las deducciones y el NETO
    updatedItem.Total_de_deducciones = calcularTotalDeducciones(updatedItem);
    updatedItem.NETO = (updatedItem.Percepcion_total || 0) - (updatedItem.Total_de_deducciones || 0);

    setItemEditando(updatedItem);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;

    if (isEditing) {
      const response = await handleEdit(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert('Error al guardar');
      }
    } else {
      const response = await handleCreate(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert(response.message || 'Error al crear');
      }
    }

    setIsModalOpen(false);
  };

  const deletesueldo = async (item: Sueldo) => {
    await handleDarDeBaja(item);
    router.refresh();
  }

    const fusionSueldosAdelantos = () => {
      return sueldos.map((sueldo) => {
        const adelantosEmpleado = adelantos.filter(a => a.Nombre === sueldo.Empleado)
        const prestamosEmpleado = prestamos.filter(p => p.Nombre === sueldo.Empleado)
        const viajesDelOperador = programaciones?.filter((v) => v.Operador === Number(sueldo.Empleado)) || [];
        const totalViajes = viajesDelOperador.reduce((acc, v) => acc + (v.Sueldo ?? 0), 0);

        const sueldoDelOperador = sueldos.filter( (s)=> s.Empleado === sueldo.Empleado) || [];
        const primerSueldo = sueldoDelOperador[0]
        const sueldoChofer = primerSueldo ? (totalViajes > primerSueldo.Percepcion_total ? totalViajes : primerSueldo.Sueldo_Real) : 0;
        return {
          ...sueldo,
          sueldo : sueldoChofer,
          adelantos: adelantosEmpleado,
          prestamos: prestamosEmpleado,
          rebaje: ((adelantosEmpleado.reduce((acc, a) => acc + (a.Cantidad ?? 0), 0) ?? 0) + (prestamosEmpleado?.reduce((acc2, p) => acc2 + (p.Descuento_por_semana ?? 0), 0 ) ?? 0))
        };
      });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-end">
          <button
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={abrirModalCrear}
          >
            <span>Agregar Sueldo</span>
          </button>
        </div>
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Codigo</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Empleado</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Septimo dia</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Bono de Puntualidad</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit FD</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit CF</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit PORC</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Subs</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">I.S.R</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">I.M.S.S</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Ajuste Neto</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Pension</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Total Percibido</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Total Deducciones</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">NETO</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo Real</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Rebaje</th>
              {/*<th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Rebaje2</th>*/}
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo Real Total</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Extra</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fusionSueldosAdelantos().map((sueldo, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.codigo}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.operador_name}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Sueldo}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Septimo_dia}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Bono_Puntualidad}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Prestamo_infonavit__FD_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Prestamo_Infonavit__CF_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Prestamo_Infonavit__PORC_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Subs_al_Empleo__mes_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.I_S_R___mes_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.I_M_S_S_}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Ajuste_al_neto}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Pension_Alimenticia}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Percepcion_total}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Total_de_deducciones}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.NETO}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Sueldo_Real}</td>
                {/*<td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Rebaje}</td>*/}
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.rebaje}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Sueldo_Real_Total - sueldo.rebaje}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Extra}</td>
                <td className="px-1 text-xs text-indigo-600 font-medium">
                  <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(sueldo)}>
                    Editar
                  </button>
                  <button
                    onClick={() => deletesueldo(sueldo)}
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-2">
              <div className="flex items-center justify-center">
                <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Sueldo' : 'Agregar Sueldo'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Codigo</label>
                  <input
                    type="number"
                    value={itemEditando.codigo === null ? '' : itemEditando.codigo.toString() ?? ''}
                    onChange={e => setItemEditando({ ...itemEditando, codigo: Number(e.target.value) })}
                    className="border rounded px-3 py-2 w-full text-xs"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Empleado</label>
                  <select
                    value={itemEditando.Empleado}
                    onChange={e => setItemEditando({ ...itemEditando, Empleado: e.target.value })}
                    className="border rounded px-3 py-2 w-full text-xs"
                  >
                    <option value="">Selecciona un empleado</option>
                    {operadores.map(operador => (
                      <option key={operador.uniqueId} value={operador.uniqueId}>
                        {operador.Nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sueldo</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Sueldo === null ? '' : itemEditando.Sueldo?.toString() ?? ''}
                    onChange={(e) => handleChange('Sueldo', e.target.value)}
                    placeholder="Sueldo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Septimo Dia</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Septimo_dia === null ? '' : itemEditando.Septimo_dia?.toString() ?? ''}
                    onChange={(e) => handleChange('Septimo_dia', e.target.value)}
                    placeholder="Septimo Dia"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bono de Puntualidad</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    onChange={e => {
                      const valor = e.target.value;
                      setItemEditando({
                        ...itemEditando,
                        Bono_Puntualidad: valor === '' ? null : Number(valor)
                      });
                    }}
                    value={itemEditando.Bono_Puntualidad ?? ''}
                    placeholder="Total"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prestamo Infonavit (FD)</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Prestamo_infonavit__FD_ === 0 ? '' : itemEditando.Prestamo_infonavit__FD_?.toString() ?? ''}
                    onChange={(e) => handleChange('Prestamo_infonavit__FD_', e.target.value)}
                    placeholder="Prestamo Infonavit (FD)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prestamo Infonavit (CF)</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Prestamo_Infonavit__CF_ === 0 ? '' : itemEditando.Prestamo_Infonavit__CF_?.toString() ?? ''}
                    onChange={(e) => handleChange('Prestamo_Infonavit__CF_', e.target.value)}
                    placeholder="Prestamo Infonavit (CF)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prestamo Infonavit (PORC)</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Prestamo_Infonavit__PORC_ === 0 ? '' : itemEditando.Prestamo_Infonavit__PORC_?.toString() ?? ''}
                    onChange={(e) => handleChange('Prestamo_Infonavit__PORC_', e.target.value)}
                    placeholder="Prestamo Infonavit (PORC)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subs al empleo (Mes)</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Subs_al_Empleo__mes_ === 0 ? '' : itemEditando.Subs_al_Empleo__mes_?.toString() ?? ''}
                    onChange={(e) => handleChange('Subs_al_Empleo__mes_', e.target.value)}
                    placeholder="Subs al empleo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">I.S.R (Mes)</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.I_S_R___mes_ === 0 ? '' : itemEditando.I_S_R___mes_?.toString() ?? ''}
                    onChange={(e) => handleChange('I_S_R___mes_', e.target.value)}
                    placeholder="I.S.R"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">I.M.S.S</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.I_M_S_S_ === 0 ? '' : itemEditando.I_M_S_S_?.toString() ?? ''}
                    onChange={(e) => handleChange('I_M_S_S_', e.target.value)}
                    placeholder="IMSS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ajuste al Neto</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Ajuste_al_neto === 0 ? '' : itemEditando.Ajuste_al_neto?.toString() ?? ''}
                    onChange={(e) => handleChange('Ajuste_al_neto', e.target.value)}
                    placeholder="Ajuste al Neto"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pension Alimenticia</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Pension_Alimenticia === 0 ? '' : itemEditando.Pension_Alimenticia?.toString() ?? ''}
                    onChange={(e) => handleChange('Pension_Alimenticia', e.target.value)}
                    placeholder="Pension Alimenticia"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total Percibido</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs bg-gray-100 cursor-not-allowed"
                    value={itemEditando.Percepcion_total?.toFixed(2) ?? ''}
                    readOnly
                    placeholder="Total Percibido"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total de Deducciones</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs bg-gray-100 cursor-not-allowed"
                    value={itemEditando.Total_de_deducciones?.toFixed(2) ?? ''}
                    readOnly
                    placeholder="Total de deducciones"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">NETO</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs bg-gray-100 cursor-not-allowed"
                    value={itemEditando.NETO?.toFixed(2) ?? ''}
                    readOnly
                    placeholder="NETO"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sueldo Real</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    value={itemEditando.Sueldo_Real === 0 ? '' : itemEditando.Sueldo_Real?.toString() ?? ''}
                    onChange={(e) => handleChange('Sueldo_Real', e.target.value)}
                    placeholder="Sueldo Real"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sueldo Real Total</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs bg-gray-100 cursor-not-allowed"
                    value={itemEditando.Sueldo_Real_Total?.toFixed(2) ?? ''}
                    readOnly
                    placeholder="Sueldo Real Total"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Extra</label>
                  <input
                    type="number"
                    className="border rounded px-3 py-2 w-full text-xs"
                    onChange={e => {
                      const valor = e.target.value;
                      setItemEditando({
                        ...itemEditando,
                        Extra: valor === '' ? 0 : Number(valor)
                      });
                    }}
                    value={itemEditando.Extra ?? ''}
                    placeholder="Total"
                  />
                </div>
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
        </div>
      )}
    </>
  );
}