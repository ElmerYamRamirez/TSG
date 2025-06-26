import { getPlantillaById } from "components/actions";
import Tabs from "components/components/plantilla/tabs";
import Link from "next/link";
import React from "react";

export default async function PlantillaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const result = await getPlantillaById(id);
  const raw = result.plantilla;
  const plantilla = {
    folio: raw?.Folio ?? raw?.id ?? "",
    nombre: raw?.Nombre ?? "",
    municipio: raw?.Municipio ?? "",
    destino: raw?.NombreDestino ?? "",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700">Detalle Plantilla</h1>
      <div className="flex justify-between mb-4">
        <div className="grid grid-cols-2 gap-x-3 mt-4">
          <p><strong>Folio:</strong> {plantilla.folio}</p>
          <p><strong>Nombre:</strong> {plantilla.nombre}</p>
          <p><strong>Municipio:</strong> {plantilla.municipio}</p>
          <p><strong>Destino:</strong> {plantilla.destino}</p>
        </div>
        <div>
          <Link href={"/plantillas"} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Regresar
          </Link>
        </div>
      </div>
      <Tabs plantilla={raw} />
    </div>
  );
}