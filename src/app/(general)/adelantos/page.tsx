import { getAdelantosFiltro } from "components/actions";
import { getAdelantosPagination } from "components/actions";
import { getOperadores} from "components/actions";
import UserTable from "components/components/adelantos/adelantos-tabla";
import Link from "next/link";
import React from "react";

 export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; desde?: string; hasta?: string }> }) {
  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam, desde, hasta} = resolvedParams;

  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;

    const response =
     searchTerm || desde || hasta
    ? await getAdelantosFiltro(page, pageSize, searchTerm)
    : await getAdelantosPagination(page, pageSize);

    const operadores = await getOperadores() ?? { ok: false, operadores: [] };

  const adelantos = response?.adelantos ?? [];
  const hayMasResultados = adelantos.length === pageSize;

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Adelantos</h1>
        <p className="text-sm text-gray-600">Lista de adelantos</p>
      </div>
      <div className="flex justify-center mb-4">
        <form className="w-full max-w-4xl flex flex-wrap gap-2 items-end" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por empleado"
            className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
            
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          {(searchTerm || desde || hasta) && (
            <Link
              href="/adelantos"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Limpiar
            </Link>
          )}
        </form>
      </div>


      {response?.ok === false ? (
        <p className="text-center text-red-500">Error al cargar los adelantos.</p>
      ) : (
        <>
          {adelantos.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">
              <p>No se encontraron adelantos que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <>
              <UserTable adelantos={adelantos} operadores={operadores.operadores}></UserTable>
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
