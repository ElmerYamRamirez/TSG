'use client';

import { updateProgramacionById } from "components/actions";
import { ProgramacionI } from "components/interfaces/programacion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const handleEdit = async (programacion: ProgramacionI) => {
    const response = await updateProgramacionById(programacion) ?? { ok: false, res: [] };
    const combustibles = response.res ?? [];
    return { ok: response.ok, combustibles };
}

export default function SueldosTable({ nominas }:
    { nominas: {} }) {

    const [itemEditando, setItemEditando] = useState<ProgramacionI | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const opcionesStatus = ['Programado', 'Despachado', 'Finalizado', ''];
    const opcionesPapeleria = ['Pendiente', 'Entregada', ''];
    const router = useRouter();
    //Modal Combustibles
    const abrirModalEditar = (item: ProgramacionI) => {
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
            //const responce = await handleCreate(itemEditando);

            //if (responce.ok) {
            //router.refresh()
            //} else {
            //alert('Error al guardar')
            //}
        }
        setIsModalOpen(false)
    }

    return (
        <>

            <div className="overflow-x-auto">
                <table className="table-auto mx-auto divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Empleado</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Viajes</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">ISR/IMSS/PENSION</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Prestamo</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Adelanto</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Extras</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 1</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 2</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Total</th>
                            <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {nominas.map((nomina, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.nombre}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.totalViajes}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.Infonavit}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.isrImssPension}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.totalPrestamos}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.totalAdelantos}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.sueldo}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.extras}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.deposito1}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.deposito2}</td>
                                <td className="px-1 lg:py-1 text-xs text-gray-700">{nomina.total}</td>
                                <td className="px-1 text-xs text-indigo-600 font-medium">
                                    <button className="text-2xs bg-blue-500 text-white px-1 rounded hover:bg-blue-600" onClick={() => abrirModalEditar(nomina)}>
                                        Generar Nomina
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
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Unidad</label>
                                    <select
                                        value={itemEditando.Unidad}
                                        onChange={e => setItemEditando({ ...itemEditando, Unidad: Number(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        <option value="">Selecciona una unidad</option>
                                        {unidades.map(unidad => (
                                            <option key={unidad.uniqueId} value={unidad.uniqueId}>
                                                {unidad.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-700 mb-1">Operador</label>
                                    <select
                                        value={itemEditando.Operador}
                                        onChange={e => setItemEditando({ ...itemEditando, Operador: Number(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        <option value="">Selecciona un operador</option>
                                        {operadores.map(operador => (
                                            <option key={operador.uniqueId} value={operador.uniqueId}>
                                                {operador.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        value={itemEditando.Fecha_programada ? new Date(itemEditando.Fecha_programada).toISOString().split("T")[0] : ""}
                                        onChange={e => setItemEditando({ ...itemEditando, Fecha_programada: e.target.value })}
                                        placeholder="Fecha"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        value={itemEditando.Hora_programada || ''}
                                        onChange={e => setItemEditando({ ...itemEditando, Hora_programada: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Destino</label>
                                    <select
                                        value={itemEditando.Destino_de_la_unidad}
                                        onChange={e => setItemEditando({ ...itemEditando, Destino_de_la_unidad: Number(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        <option value="">Selecciona un destino</option>
                                        {destinosList.map(destino => (
                                            <option key={destino.uniqueId} value={destino.uniqueId}>
                                                {destino.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                                    <select
                                        value={itemEditando.Cliente}
                                        onChange={e => setItemEditando({ ...itemEditando, Cliente: Number(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        <option value="">Selecciona un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.uniqueId} value={cliente.uniqueId}>
                                                {cliente.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Comentario</label>
                                    <textarea
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        value={itemEditando.Comentario || ''}
                                        onChange={e => setItemEditando({ ...itemEditando, Comentario: e.target.value })}
                                        placeholder="Agrega un comentario opcional"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Estado de envio</label>
                                    <select
                                        value={itemEditando.status_programacion}
                                        onChange={(e) =>
                                            setItemEditando({ ...itemEditando, status_programacion: e.target.value })
                                        }
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        {opcionesStatus.map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Papeleria</label>
                                    <select
                                        value={itemEditando.papeleria}
                                        onChange={(e) =>
                                            setItemEditando({ ...itemEditando, papeleria: e.target.value })
                                        }
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        {opcionesPapeleria.map((status, index) => (
                                            <option key={index} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Sueldo</label>
                                    <input
                                        type="number"
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        onChange={e => {
                                            const valor = e.target.value;
                                            setItemEditando({
                                                ...itemEditando,
                                                Sueldo: valor === '' ? null : Number(valor)
                                            });
                                        }}
                                        value={itemEditando.Sueldo ?? ''}
                                        placeholder="Total"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Se cobró</label>
                                    <input
                                        type="number"
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        onChange={e => {
                                            const valor = e.target.value;
                                            setItemEditando({
                                                ...itemEditando,
                                                cantidad_cobrada: valor === '' ? null : Number(valor)
                                            });
                                        }}
                                        value={itemEditando.cantidad_cobrada ?? ''}
                                        placeholder="Total"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Papeleria</label>
                                    <input
                                        type="date"
                                        className="border rounded px-3 py-2 w-full text-xs"
                                        value={itemEditando.fecha_entrega_papeleria ? new Date(itemEditando.fecha_entrega_papeleria).toISOString().split("T")[0] : ""}
                                        onChange={e => setItemEditando({ ...itemEditando, fecha_entrega_papeleria: e.target.value })}
                                        placeholder="Fecha"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Vendedor</label>
                                    <select
                                        value={itemEditando.vendedor}
                                        onChange={e => setItemEditando({ ...itemEditando, vendedor: (e.target.value) })}
                                        className="border rounded px-3 py-2 w-full text-xs"
                                    >
                                        <option value="">Selecciona un vendedor</option>
                                        {vendedores.map(vendedor => (
                                            <option key={vendedor.uniqueId} value={vendedor.uniqueId}>
                                                {vendedor.nombre}
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