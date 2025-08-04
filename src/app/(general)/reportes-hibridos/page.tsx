import { getReporteHibridoFiltro } from "components/actions";
import { getReporteHibridoPagination } from "components/actions";
import { ReporteHibrido } from "components/interfaces/reporte_hibrido";
import Link from "next/link";
import React from "react";

export default async function ReportesHibrido({ searchParams, }: { searchParams: Promise<{ page?: string; search?: string; desde?: string; hasta?: string }>; }) {

    const resolvedParams = await searchParams;
    const { page: pageParam, search: searchTermParam, desde, hasta } = resolvedParams;

    const page = pageParam ? parseInt(pageParam) : 1;
    const searchTerm = searchTermParam || "";
    const pageSize = 15;

    const response =
        searchTerm || desde || hasta
            ? await getReporteHibridoFiltro(page, pageSize, searchTerm, desde, hasta)
            : await getReporteHibridoPagination(page, pageSize);


    const rendimientos = response?.rendimientos ?? [];
    const hayMasResultados = rendimientos.length === pageSize;

    return (
        <div className="px-2 py-2 max-w-7xl mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-700">Reporte Híbrido</h1>
                <p className="text-sm text-gray-600">Lista de reportes híbridos</p>
            </div>

            <div className="flex justify-center mb-4">
                <form className="w-full max-w-4xl flex flex-wrap gap-2 items-end" method="GET">
                    <input
                        type="text"
                        name="search"
                        defaultValue={searchTerm}
                        placeholder="Buscar por unidad..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                    />

                    <div className="flex flex-col">
                        <label htmlFor="desde" className="text-xs text-gray-500">Fecha Creación Desde</label>
                        <input
                            type="date"
                            name="desde"
                            defaultValue={desde || ""}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="hasta" className="text-xs text-gray-500">Fecha Creación Hasta</label>
                        <input
                            type="date"
                            name="hasta"
                            defaultValue={hasta || ""}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Buscar
                    </button>

                    {(searchTerm || desde || hasta) && (
                        <Link
                            href="/reportes-hibridos"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Limpiar
                        </Link>

                    )}
                </form>
            </div>

            {/* Tabla */}
            {response?.ok === false ? (
                <p className="text-center text-red-500">Error al cargar los reportes.</p>
            ) : rendimientos.length === 0 ? (
                <div className="text-center text-gray-600 mt-6">
                    <p>No se encontraron reportes de consumo con los filtros aplicados.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="table-auto mx-auto divide-y divide-gray-300 text-xs">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Programacion</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Unidad</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Km inicial</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Km final</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros iniciales T1</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros iniciales T2</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros iniciales T3</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros iniciales T4</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros iniciales TG</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros finales T1</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros finales T2</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros finales T3</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros finales T4</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros finales TG</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos T1</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos T2</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos T3</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos T4</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos TG</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros consumidos total gas</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Km recorridos</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Km recorridos gasolina</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Km recorridos gas</th>
                                    <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Rendimiento</th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rendimientos.map((r: ReporteHibrido, i: number) => (
                                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.programacion}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.unidad}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.Km_Inicial}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.Km_Final}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_iniciales_t1}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_iniciales_t2}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_iniciales_t3}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_iniciales_t4}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_iniciales_tg}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_finales_t1}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_finales_t2}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_finales_t3}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_finales_t4}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_finales_tg}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_t1}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_t2}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_t3}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_t4}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_tg}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.litros_consumidos_total_gas}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.km_recorridos}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.km_rec_gasolina}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.km_rec_gas}</td>
                                        <td className="px-1 lg:py-1 text-gray-700">{r.rendimiento}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    <div className="flex justify-center mt-4">
                        {page > 1 && (
                            <Link
                                href={`?page=${page - 1}${searchTerm ? `&search=${searchTerm}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
                                className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                            >
                                Anterior
                            </Link>
                        )}
                        {hayMasResultados && (
                            <Link
                                href={`?page=${page + 1}${searchTerm ? `&search=${searchTerm}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
                                className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                            >
                                Siguiente
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}