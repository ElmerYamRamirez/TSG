'use client';

import { updateProgramacionById } from "components/actions";
import { ProgramacionI } from "components/interfaces/programacion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const handleEdit = async (programacion: any) => {
  const response = await updateProgramacionById(programacion) ?? { ok: false, res: [] };
  const combustibles = response.res ?? [];
  return { ok: response.ok, combustibles };
}

export default function UserTable({ programaciones }: { programaciones: ProgramacionI[] }) {

    const [itemEditando, setItemEditando] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    //Modal Combustibles
    const abrirModalEditar = (item: any) => {
        setItemEditando(item);
        setIsEditing(true);
        setIsModalOpen(true);
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
        <>

            <div className="overflow-x-auto">
                <table className="table-auto mx-auto divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Folio</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Unidad</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Operador</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Hora</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Destino</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Cliente</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Comentario</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Estado Envio</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Papeleria</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Se cobro</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Fecha Papeleria</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Vendedor</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {programaciones.map((programacion, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.folio}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.unidad_name}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.operador_name}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">
                                    {new Date(programacion.Fecha_programada).toLocaleDateString("es-MX", {
                                        timeZone: "UTC",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    })}
                                </td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Hora_programada}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Nombre_destino}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.cliente_name}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Comentario}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.status_programacion}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.papeleria}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Sueldo}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.cantidad_cobrada}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.fecha_entrega_papeleria}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.vendedor}</td>
                                <td className="px-1 text-xs text-indigo-600 font-medium">
                                    <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(programacion)}>
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
                        <h2 className="text-lg font-bold mb-2">{isEditing ? 'Editar Programación' : 'Agregar Programación'}</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                            <input
                                type="date"
                                className="border rounded px-3 py-2 w-full"
                                value={itemEditando.fecha ? new Date(itemEditando.fecha).toISOString().split("T")[0] : ""}
                                onChange={e => setItemEditando({ ...itemEditando, fecha: e.target.value })}
                                placeholder="Fecha"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Operador</label>
                            <input
                                type="date"
                                className="border rounded px-3 py-2 w-full"
                                value={itemEditando.fecha ? new Date(itemEditando.fecha).toISOString().split("T")[0] : ""}
                                onChange={e => setItemEditando({ ...itemEditando, fecha: e.target.value })}
                                placeholder="Fecha"
                            />
                        </div>

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
        </>);
}