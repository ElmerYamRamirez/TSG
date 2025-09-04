'use client';

interface Nomina {
  idNomina: string | number;
  codigo: number;
  nombre: string;
  totalViajes: number;
  totalPrestamos: number;
  totalAdelantos: number;
  Infonavit: number;
  isrImssPension: number;
  sueldo: number;
  extras: number;
  deposito1: number;
  deposito2: number;
  total: number;
  cuenta: string;
}

export default function NominaTable({ nomina}: { nomina: Nomina[]}) {

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-end">
        </div>
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Código</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Viajes</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">ISR/IMSS/PENSION</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Prestamos</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Adelantos</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Extras</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 1</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 2</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Total</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Cuenta</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nomina.map((sueldo, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.codigo}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.nombre}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalViajes}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Infonavit}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.isrImssPension}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalPrestamos}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalAdelantos}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.sueldo}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.extras}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.deposito1}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{(sueldo.deposito2 > 0) ? sueldo.deposito2 : 0}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{(sueldo.total > sueldo.deposito1 ) ? sueldo.total : "Falta información de sueldos" }</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.cuenta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}