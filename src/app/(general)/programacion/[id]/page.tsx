import { getProgramacionesById } from "components/actions";
import { getReporteHibridoById } from "components/actions";
import { getCombustibleHibridoById } from "components/actions";
import { getThermoById} from "components/actions";
import { getReporteThermoById } from "components/actions";
import Tabs from "components/components/programacion/tabs";
import Link from "next/link";
import React from "react";


export default async function ProgramacionPage(props: { params : Promise<{id: string}> }) {
  const id  = (await props.params).id;
  const programacion = await getProgramacionesById(id);
  const reporte_hibrido = await getReporteHibridoById(id);
  const combustible_hibrido = await getCombustibleHibridoById(id);
  const thermo = await getThermoById(id);
  const reporte_thermo = await getReporteThermoById(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700">Detalle Programacion</h1>
      <div className="flex justify-between mb-4">
        <div className="grid grid-cols-2 gap-x-3 mt-4">
          <p><strong>Folio:</strong> {programacion?.programacion.folio}</p>
          <p><strong>Fecha programada:</strong> {(programacion?.programacion.Fecha_programada).toLocaleString("es-MX", {day: "2-digit",month:"2-digit",year: "2-digit",})}</p>
          <p><strong>Destino:</strong> {programacion?.programacion.nombre_destino}</p>
          <p><strong>Cliente:</strong> {programacion?.programacion.cliente_name}</p>
          <p><strong>Operador:</strong> {programacion?.programacion.operador_name}</p>
          <p><strong>Unidad:</strong> {programacion?.programacion.unidad_name}</p>
        </div>
        <div>
          <Link href={"/programaciones"} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Regresar
          </Link>
        </div>
      </div>

      <Tabs programacion={{...programacion?.programacion,reporte_hibrido: reporte_hibrido?.reporte_hibrido ?? null,combustible_hibrido: combustible_hibrido?.combustible_hibrido ?? null,
         reporte_thermo: reporte_thermo ?? null,thermos: thermo?.thermos ?? null }}/>
    </div>
  );
};
