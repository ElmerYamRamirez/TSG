'use client';

import { deleteSueldoById, updateSueldoById } from "components/actions";
import { Sueldo } from "components/interfaces/sueldo";
import { OperadorI } from "components/interfaces/operador";
import { useRouter } from "next/navigation";
import { useState } from "react";

const handleEdit = async (programacion: Sueldo) => {
    const response = await updateSueldoById(programacion) ?? { ok: false, res: [] };
    const combustibles = response.res ?? [];
    return { ok: response.ok, combustibles };
}

const handleDarDeBaja = async (programacion: Sueldo) => {
    console.log('Dar de baja:', programacion.codigo);
    // Ejemplo: confirmar y hacer una petición a una API
    if (confirm(`¿Estás seguro de eliminar: ${programacion.Empleado}?`)) {
        //llamar server action to delete
        const { ok } = await deleteSueldoById(programacion) ?? { ok: false, programacion: [] };

        if (!ok) {
            alert("Hubo un error al eliminar la programación.");
        }
    }
}

export default function UserTable({ sueldos,operadores}:{ sueldos: Sueldo[], operadores: OperadorI[]}) {
    const [itemEditando, setItemEditando] = useState<Sueldo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const opcionesStatus = ['Programado', 'Despachado', 'Finalizado', ''];
    const opcionesPapeleria = ['Pendiente', 'Entregada', ''];
    const router = useRouter(); 

    const abrirModalEditar = (item: Sueldo) => {
        setItemEditando(item);
        setIsEditing(true);
        setIsModalOpen(true);
    };

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
            //const responce = await handleCreate(itemEditando);

            //if (responce.ok) {
            //router.refresh()
            //} else {
            //alert('Error al guardar')
            //}
        }
        setIsModalOpen(false)
    }

    const deleteProgramacion = async (item: Sueldo) => {
        await handleDarDeBaja(item);
        router.refresh();
    }

    return (
        <>
            <div className="overflow-x-auto">
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
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo Real Total</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Extra</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sueldos.map((programacion, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.codigo}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Empleado}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Sueldo}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Septimo_dia}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Bono_Puntualidad}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Prestamo_infonavit__FD_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Prestamo_Infonavit__CF_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Prestamo_Infonavit__PORC_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Subs_al_Empleo__mes_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.I_S_R___mes_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.I_M_S_S_}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Ajuste_al_neto}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Pension_Alimenticia}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Percepcion_total}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Total_de_deducciones}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.NETO}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Sueldo_Real}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Rebaje}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Sueldo_Real_Total}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Extra}</td>
                                <td className="px-1 text-xs text-indigo-600 font-medium">
                                    <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(programacion)}>
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteProgramacion(programacion)}
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
                                <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Programación' : 'Agregar Programación'}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/*
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Codigo</label>
                                    <input
                                        value={itemEditando.codigo}
                                        onChange={e => setItemEditando({ ...itemEditando,codigo: Number(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                    </input>
                                </div>
                                */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Empleado</label>
                                    <select
                                        value={itemEditando.Empleado}
                                        onChange={e => setItemEditando({ ...itemEditando, Empleado: (e.target.value) })}
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
        </>);
}