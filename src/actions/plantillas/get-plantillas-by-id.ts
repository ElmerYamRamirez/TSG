'use server';

import { executeQuery } from "components/app/lib/connection";

export const getPlantillaById = async (id: string) => {
 try {
        
        const paramsList = [{ name: "id", value: id }];
        
        const query = `
          SELECT * 
          FROM Destino 
          WHERE Folio = @id;
        `;

        const plantilla = await executeQuery(query, paramsList);

        const query2 = `
        SELECT *
        FROM Casetas
        WHERE Bit_Activo = 1;
        `;
        const casetas = await executeQuery(query2, paramsList);

        const query3 = `
        SELECT *
        FROM viaticos
        WHERE Bit_Activo = 1;
        `;
        const viaticos = await executeQuery(query3, paramsList);

        return {
             ok: true,
             plantilla: {
                 ...plantilla[0],                
                 casetas,
                 viaticos,
             },
         };

  } catch (error) {
    console.error("API Error:", error);
  }
};
