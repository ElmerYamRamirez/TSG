'use server';
import { executeQuery } from "components/app/lib/connection";

export async function getPlantillasPagination(page: number, pageSize: number, search: string) {

  return {
    ok: true,
    plantillas: [
      {
        id: 1,
        nombreRuta: "Ruta Norte",
      },

    ],
  };
}