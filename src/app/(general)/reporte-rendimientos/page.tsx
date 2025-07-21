import { getReportesRendimientoFiltro } from "components/actions";
import { getReportesRendimientoPagination } from "components/actions";
import Link from "next/link";
import React from "react";

type Rendimiento = {
  folio: string;
  unidad: string;
  Fecha_programada: string;
  Hora_programada: string | null;
  destino: string;
  operador: string;
  litros: number;
  total: number;
  km_recorridos: number;
  rendimiento_real: number;
  rendimiento_ideal: number;
  litros_ideal: number;
  diferencia_litros: number;
  precio: number;
  costo_fi: number;
  variacion: number;
};

 export default async function ReporteRendimientos({ searchParams,}: { searchParams: Promise<{ page?: string; search?: string; desde?: string; hasta?: string }>;}) {

  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam, desde, hasta } = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

    const response =
     searchTerm || desde || hasta
    ? await getReportesRendimientoFiltro(page, pageSize, searchTerm, desde, hasta)
    : await getReportesRendimientoPagination(page, pageSize);


  const rendimientos = response?.rendimientos ?? [];
  const hayMasResultados = rendimientos.length === pageSize;

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Reporte de Consumo</h1>
        <p className="text-sm text-gray-600">Lista de reportes de consumo</p>
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
              href="/reporte-rendimientos"
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
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Folio</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Unidad</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Fecha</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900 min-w-[100px]">Hora</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Ruta</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Operador</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Precio Total</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">KM Recorridos</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Rend. Real</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Rend. Ideal</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Litros Ideal</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Dif. Litros</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Precio</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Costo FI</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Variación</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Rend. Bono</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">LTS Bono</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">LTS dif favor</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">Costo favor</th>
                  <th className="px-1 py-1 lg:py-2 text-left font-semibold text-gray-900">20%</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rendimientos.map((r: Rendimiento, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-1 lg:py-1 text-gray-700">{r.folio}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.unidad}</td>
                    <td className="px-1 lg:py-1 text-gray-700">
                      {new Date(r.Fecha_programada).toLocaleDateString("es-MX", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                    </td>
                    <td className="px-1 lg:py-1 text-gray-700">
                      {r.Hora_programada
                        ? new Date(`1970-01-01T${r.Hora_programada}`).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.destino}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.operador}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.litros}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.total}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.km_recorridos}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.rendimiento_real}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.rendimiento_ideal}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.litros_ideal}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.diferencia_litros}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.precio}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.costo_fi}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{r.variacion}%</td>
                    <td className="px-1 lg:py-1 text-gray-700">{(r.rendimiento_ideal-0.3).toFixed(2)}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{(r.km_recorridos/(r.rendimiento_ideal-0.3)).toFixed(2)}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{(r.litros_ideal-(r.km_recorridos/(r.rendimiento_ideal-0.3))).toFixed(2)}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{((r.litros_ideal-(r.km_recorridos/(r.rendimiento_ideal-0.3)))*26).toFixed(2)}</td>
                    <td className="px-1 lg:py-1 text-gray-700">{(((r.litros_ideal-(r.km_recorridos/(r.rendimiento_ideal-0.3)))*26)*0.2).toFixed(2)}</td>
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