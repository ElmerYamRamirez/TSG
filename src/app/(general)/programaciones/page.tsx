import { getProgramacionesPagination } from "components/actions"; 
import Link from "next/link";
import React from "react";

export default async function UserTable({ 
  searchParams, 
}:{ 
  searchParams: Promise<{ page?: string}>;
}) {
  //const page = searchParams.page ? parseInt( searchParams.page) : 1;
  const {page = "1"} = await searchParams;
  const pageInt = parseInt(page);
  const pageSize = 15;
  const responce = await getProgramacionesPagination(pageInt, pageSize) ?? { ok: false, programaciones: []}

  return (
    <div className=" px-1 mx-auto py-1 ">
      <div className="items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-center text-indigo-700">Programaciones</h1>
          <p className="text-sm text-center text-gray-600">
            Lista de envios
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Folio</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Unidad</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Destino</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Operador</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Cliente</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Comentario</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {responce.programaciones.map((programacion, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.folio}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{new Date((programacion.Fecha_programada).toString()).toLocaleString("es-MX", {day: "2-digit",month:"2-digit",year: "2-digit",})}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Unidad}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Nombre_destino}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.operador_name}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.cliente_name}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{programacion.Comentario}</td>
                <td className="px-1 text-xs text-indigo-600 font-medium">
                  <div className="flex flex-col">
                    <Link href={`/programacion/${programacion.uniqueId}`} className="hover:underline">
                      Cargar datos
                    </Link> 
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
        {pageInt > 1 && <Link className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600" href={`?page=${pageInt - 1}`}>Anterior</Link>}
        <Link className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600" href={`?page=${pageInt + 1}`}>Siguiente</Link>
      </div>
      </div>
    </div>
  );
};
