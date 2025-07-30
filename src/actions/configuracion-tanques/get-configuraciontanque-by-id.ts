'use server';
import { executeQuery } from "components/app/lib/connection";
import { ConfiguracionTanquesI } from "components/interfaces/configuracion_tanques";
export const getConfiguracionTanquesById = async (unidadId: number) => {
  try {
    const query = `
      SELECT  TOP 1 *
      FROM configuracion_tanques
      WHERE unidad = @unidad
    `;
    const paramsList = [{ name: 'unidad', value: unidadId }];
    const result = await executeQuery(query, paramsList);

    if (result && result.length > 0) {
        return result[0] as ConfiguracionTanquesI;
    }
            
            return null;
            
        } catch (error) {
            console.error("Error al obtener rendimiento:", error);
            return null;
        }
};

