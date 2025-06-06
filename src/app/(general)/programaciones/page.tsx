import { getProgramacionesPagination } from "components/actions";
import { getProgramacionesFiltro } from "components/actions/programaciones/get-programaciones-filtro";
import Link from "next/link";
import React from "react";

export default async function UserTable({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam } = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

  const response = searchTerm
    ? await getProgramacionesFiltro(page, pageSize, searchTerm)
    : (await getProgramacionesPagination(page, pageSize)) ?? { ok: false, programaciones: [] };

  const programaciones = response?.programaciones ?? [];
  const hayMasResultados = programaciones.length === pageSize;

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Programaciones</h1>
        <p className="text-sm text-gray-600">Lista de envíos</p>
      </div>

      <div className="flex justify-center mb-4">
        <form className="w-full max-w-md flex" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por folio, destino o fecha..."
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>
      </div>

      {response?.ok === false ? (
        <p className="text-center text-red-500">Error al cargar las programaciones.</p>
      ) : (
        <>
          {programaciones.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">
              <p>No se encontraron programaciones que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto mx-auto divide-y divide-gray-300 w-full max-w-6xl">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Folio</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Unidad</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Destino</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Operador</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Cliente</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Comentario</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programaciones.map((programacion, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.folio}</td>
                      <td className="px-2 py-1 text-xs text-gray-700">
                        {new Date(programacion.Fecha_programada).toLocaleDateString("es-MX", {
                          timeZone: "UTC",
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </td>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.Unidad}</td>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.Nombre_destino}</td>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.operador_name}</td>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.cliente_name}</td>
                      <td className="px-2 py-1 text-xs text-gray-700">{programacion.Comentario}</td>
                      <td className="px-2 py-1 text-xs text-indigo-600 font-medium">
                        <Link
                          href={`/programacion/${programacion.uniqueId}`}
                          className="hover:underline"
                        >
                          Cargar datos
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}
                    className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                  >
                    Anterior
                  </Link>
                )}
                {hayMasResultados && (
                  <Link
                    href={`?page=${page + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}
                    className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mostrar el botón Limpiar búsqueda solo si hay término de búsqueda */}
          {searchTerm && (
            <div className="text-center mt-4">
              <Link
                href="/programaciones"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Limpiar búsqueda
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
