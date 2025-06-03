import { getProgramaciones } from "components/actions";
import Link from "next/link";
import React from "react";

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

/*const users = [
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M1",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Elmer Yam",
    comentario: "Envio Prueba",
    estado: "Proceso",
    papeleria: "si",
    costo: "$1000",
  },
  {
    folio: "25000M2",
    fecha: new Date().toLocaleString(undefined, options),
    hora: "19:10",
    cliente: "PS",
    operador: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    role: "Admin",
  },
  {
    folio: "25000M3",
    operador: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    role: "Member",
  },
  {
    folio: "25000M4",
    operador: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    role: "Admin",
  },
  {
    folio: "25000M5",
    operador: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    role: "Owner",
  },
  {
    folio: "25000M6",
    operador: "Floyd Miles",
    title: "Principal Designer",
    email: "floyd.miles@example.com",
    role: "Member",
  },
];
*/

const { ok, programaciones = [] } = await getProgramaciones() ?? { ok: false, programaciones: [] };

const UserTable = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-center text-indigo-700">Programaciones</h1>
          <p className="text-sm text-center text-gray-600">
            Lista de envios
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Folio</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Unidad</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Destino</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Operador</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Cliente</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900">Comentario</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {programaciones.map((programacion, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.folio}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{new Date((programacion.Fecha_programada).toString()).toLocaleString("es-MX", {day: "2-digit",month:"2-digit",year: "2-digit",})}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.Unidad}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.Nombre_destino}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.operador_name}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.cliente_name}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{programacion.Comentario}</td>
             
                <td className="px-1 py-2 text-xs text-indigo-600 font-medium">
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
      </div>
    </div>
  );
};

export default UserTable;
