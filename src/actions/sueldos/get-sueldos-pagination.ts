'use server';

import { executeQuery } from "components/app/lib/connection";

export const getSueldosPagination = async ( page: number,pageSize: number = 15) => {
  try {
    const offset = (page - 1) * pageSize;
    const paramsList = [{ name: "offset", value: offset }, { name: "pageSize", value: pageSize },];

    const query = `
      SELECT * FROM Sueldos
      ORDER BY Fec_Alta DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `SELECT COUNT(*) AS total FROM Sueldos`;

    const [sueldos, totalResult] = await Promise.all([
      executeQuery(query, paramsList),
      executeQuery(totalQuery),
    ]);

    return {
      ok: true,
      sueldos,
      total: totalResult?.[0]?.total ?? 0,
    };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, sueldos: [], total: 0 };
  }
};
