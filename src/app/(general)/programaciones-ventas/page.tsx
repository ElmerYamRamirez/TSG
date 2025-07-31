
import { getDestinos, getOperadores, getProgramacionesPagination, getUnidades } from "components/actions";
import { getProgramacionesFiltro } from "components/actions/programaciones/get-programaciones-filtro";
import Link from "next/link";
import UserTable from "components/components/programacion-ventas/programacion-ventas-tabla";
import { getClientes } from "components/actions/clientes/get-clientes";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; desde?: string; hasta?: string }> }) {
  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam, desde, hasta} = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

  const destinos = await getDestinos() ?? { ok: false, destinos: [] };
  const unidades = await getUnidades() ?? { ok: false, unidades: [] };
  const operadores = await getOperadores() ?? { ok: false, operadores: [] };
  const clientes = await getClientes() ?? { ok: false, clientes: []};

  const response = searchTerm || desde || hasta
    ? await getProgramacionesFiltro(page, pageSize, searchTerm, desde, hasta)
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
        <form className="w-full max-w-4xl flex flex-wrap gap-2 items-end" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por folio, operador, cliente o destino"
            className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
            
          />
          <div className="flex flex-col">
            <label htmlFor="desde" className="text-xs text-gray-500">Desde la fecha</label>
            <input
              type="date"
              name="desde"
              defaultValue={desde || ""}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="hasta" className="text-xs text-gray-500">Hasta la fecha</label>
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
              href="/programaciones-ventas"
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
              <UserTable programaciones={programaciones} destinosList={destinos.destinos} unidades={unidades.unidades} operadores={operadores.operadores} clientes={clientes.clientes}></UserTable>
              <div className="flex justify-center mt-4">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
                    className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                  >
                    Anterior
                  </Link>
                )}
                {hayMasResultados && (
                  <Link
                    href={`?page=${page + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
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
