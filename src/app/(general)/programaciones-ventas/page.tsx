
import { getDestinos, getProgramacionesPagination } from "components/actions";
import { getProgramacionesFiltro } from "components/actions/programaciones/get-programaciones-filtro";
import Link from "next/link";
import UserTable from "components/components/programacion-ventas/programacion-ventas-tabla";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam } = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

  const destinos = await getDestinos() ?? { ok: false, destinos: [] };
  const unidades = await getDestinos() ?? { ok: false, destinos: [] };

  const response = searchTerm
    ? await getProgramacionesFiltro(page, pageSize, searchTerm)
    : await (getProgramacionesPagination(page, pageSize)) ?? { ok: false, programaciones: [] };

  const programaciones = response?.programaciones ?? [];
  const hayMasResultados = programaciones.length === pageSize;

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Programaciones</h1>
        <p className="text-sm text-gray-600">Lista de envíos</p>
      </div>
      <div className="flex justify-center mb-4">
        <form className="w-full max-w-xl flex flex-wrap gap-2" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por folio, destino o fecha..."
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
              href="/programaciones"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Limpiar
            </Link>
          )}
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
            <>
              <UserTable programaciones={programaciones} destinosList={destinos.destinos}></UserTable>
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

            </>
          )}
        </>
      )}

    </div>);
}
