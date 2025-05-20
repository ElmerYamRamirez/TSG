import { deleteViaticosById } from "components/actions/viaticos/delete-viaticos-by-id";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// interface viaticos{
//     viatico:viatico[]
// }

// interface viatico{
//     concepto: string,
//     monto: number
// }

const handleDarDeBaja = async(viatico: any) => {
  const elmer = 12;
  console.log('Dar de baja:', viatico);
  // Ejemplo: confirmar y hacer una petición a una API
  if (confirm(`¿Estás seguro de eliminar: ${viatico.concepto}?`)) {
    //llamar server action to delete
    // fetch('/api/vehiculos/baja', { method: 'POST', body: JSON.stringify({ id: vehiculo.id }) });
    const { ok, viaticos} = await deleteViaticosById(viatico.uniqueId) ?? { ok: false, viaticos: [] };
  }
}

const handleCreate = async(viatico: any) => {
  if (confirm(`¿Estás seguro de eliminar: ${viatico.concepto}?`)) {
    //llamar server action to create
    //const { ok, viaticos} = await deleteViaticosById(viatico.uniqueId) ?? { ok: false, viaticos: [] };
  }
}

export default function Viaticos( {viaticos} : {viaticos : any[] }){
  const [viaticosList, setViaticosList] = useState<any[]>(viaticos)
  const router = useRouter();

  const updateViatico = async(item: any) => {
    const responce = await handleDarDeBaja(item);
    router.refresh();
  }

  const createViatico = async(item:any) => {
    const responce = await handleCreate(item);
    router.refresh();
  }

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
          <button 
            className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 flex items-center space-x-1"
            onClick={()=>createViatico()}>
            <span>Agregar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Concepto</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Monto</th>
                <th className="px-1 py-2 text-left text-xs font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 space-x-2">
              {viaticos.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.concepto}</td>
                  <td className="px-1 py-2 text-xs text-gray-700">{item.cantidad}</td>
                  <td className="px-1 py-2 space-x-2 text-xs text-indigo-600 font-medium">
                      <button className="bg-blue-500 text-white px-1 rounded hover:bg-blue-600">
                        Editar
                      </button>
                      <button 
                      onClick={()=>updateViatico(item)}
                      className="bg-red-100 hover:bg-red-200 px-1 text-red-500 border border-red-400 rounded">
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
