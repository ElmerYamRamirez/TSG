import Link from "next/link";

// interface viaticos{
//     viatico:viatico[]
// }

// interface viatico{
//     concepto: string,
//     monto: number
// }

export default function Casetas( {casetas} : {casetas : any[] }){
    return(
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="border rounded px-3 py-1 w-64"/>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              Buscar
            </button>
          </div>
          <button className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1">
            <span>Agregar</span>
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
              <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {casetas.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 py-2 text-xs text-gray-700">{item.nombre}</td>
                <td className="px-1 py-2 text-xs text-gray-700">{item.precio}</td>
                <td className="px-1 py-2 space-x-1 text-xs text-indigo-600 font-medium">
                    <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600">
                        Editar
                    </button>
                    <button className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">
                      Eliminar
                    </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
    );
}
