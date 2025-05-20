import { getProgramacionesById } from "components/actions";
import Tabs from "components/components/programacion/tabs";
import Link from "next/link";
import React from "react";

interface Props {
    params: {id: string}
}


export default async function ProgramacionPage({params} : Props){
  const { id } = await params;
  const programacion = await getProgramacionesById(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1>Programacion {id}</h1>
      <Link href={"/programaciones"} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
        Regresar
      </Link>

      <Tabs programacion={programacion?.programacion}></Tabs>
    </div>
  );
};
