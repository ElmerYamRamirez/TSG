import { getPlantillasPagination } from "components/actions";
import { getPlantillasFiltro } from "components/actions";
import Link from "next/link";
import React from "react";

export default async function UserTable({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam } = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

  const response = searchTerm
    ? await getPlantillasFiltro(page, pageSize, searchTerm)
    : (await getPlantillasPagination(page, pageSize)) ?? { ok: false, plantillas: [] };

  const plantillas = response?.plantillas ?? [];
  const hayMasResultados = plantillas.length === pageSize;

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Plantillas</h1>
        <p className="text-sm text-gray-600">Lista de rutas </p>
      </div>

      <div className="flex justify-center mb-4">
        <form className="w-full max-w-xl flex flex-wrap gap-2" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por ruta..."
            className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          {searchTerm && (
            <Link
              href="/plantillas"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Limpiar
            </Link>
          )}
        </form>
      </div>

      {response?.ok === false ? (
        <p className="text-center text-red-500">Error al cargar las plantillas.</p>
      ) : (
        <>
          {plantillas.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">
              <p>No se encontraron plantillas que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto mx-auto divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">
                      Folio
                    </th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">
                      Municipio
                    </th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">
                      Destino
                    </th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plantillas.map((plantilla, index) => ( <tr key={plantilla.Folio ?? `plantilla-${index}`}className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>

                      <td className="px-1 py-1 text-xs text-gray-700">{plantilla.Folio}</td>
                      <td className="px-1 py-1 text-xs text-gray-700">{plantilla.Nombre ?? ""}</td>
                      <td className="px-1 py-1 text-xs text-gray-700">{plantilla.Municipio ?? ""}</td>
                      <td className="px-1 py-1 text-xs text-gray-700">{plantilla.NombreDestino ?? ""}</td>
                      <td className="px-1 text-xs text-indigo-600 font-medium">
                        <div className="flex flex-col">
                          <Link href={`/plantilla/${plantilla.Folio}`} className="hover:underline" >
                            Cargar datos
                          </Link>
                        </div>
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
        </>
      )}
    </div>
  );
}