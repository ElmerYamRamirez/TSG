import { getOperadores, getAdelantos, getPrestamos, getProgramacionesByWeek, getSueldosFiltro, getSueldosPagination } from "components/actions";
import NominaTable from "components/components/nomina-detalles/nomina-detalles";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; desde?: string; hasta?: string }> }) {

  const resolvedParams = await searchParams;
  const { page: pageParam, search: searchTermParam, desde, hasta} = resolvedParams;
  const page = pageParam ? parseInt(pageParam) : 1;
  const searchTerm = searchTermParam || "";
  const pageSize = 15;
  const response = searchTerm || desde || hasta 
    ? await getSueldosFiltro(page, pageSize, searchTerm) 
    : await (getSueldosPagination(page, pageSize)) ?? { ok: false, sueldos: [] };
  
  function getLastSaturdayAndThisFriday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Domingo, 6=Sábado

    // Sábado pasado
    const lastSaturday = new Date(today);
    lastSaturday.setDate(today.getDate() - ((dayOfWeek + 1) % 7));

    // Viernes actual
    const thisFriday = new Date(today);
    thisFriday.setDate(today.getDate() + ((5 - dayOfWeek + 7) % 7));

    // Ajustar a horario de México
    const adjustToMexicoTimezone = (date: Date) => {
      const offset = -6; // UTC-6 México Central
      const adjustedDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
      return adjustedDate.toISOString().split("T")[0];
    };

    return {
      startDate: adjustToMexicoTimezone(lastSaturday),
      endDate: adjustToMexicoTimezone(thisFriday),
    };
  }

  const { startDate, endDate} = getLastSaturdayAndThisFriday();

  const [operadores, prestamos, adelantos, programaciones] = await Promise.all([
    getOperadores(),
    getPrestamos(),
    getAdelantos(),
    getProgramacionesByWeek(startDate, endDate),
  ]);

  const sueldos = response?.sueldos ?? [];
  const hayMasResultados = Object.keys(sueldos).length === pageSize;
  const nominas = sueldos.map((p) => {

    const operador = operadores?.operadores.filter(
      (o) => o.uniqueId === p.Empleado
    ) || []

    // Filtramos todos los prestamos que coinciden con el operador
    const prestamosDelOperador = prestamos?.prestamos.filter(
      (pr) => operador[0].uniqueId === pr.Nombre
    ) || [];

    // Sumamos el campo Descuento_por_semana
    const totalPrestamos = prestamosDelOperador.reduce(
      (acc, pr) => acc + pr.Descuento_por_semana, 0
    );

    // Filtramos todos los adelantos que coinciden con el operador
    const adelantosDelOperador = adelantos?.adelantos.filter(
      (a) => operador[0].uniqueId === a.Nombre) || [];

    // Sumamos el campo Adelanto.cantidad
    const totalAdelantos = adelantosDelOperador.reduce(
      (acc, a) => acc + a.Cantidad, 0
    );

    const viajesDelOperador = programaciones?.programacion.filter((v) => v.Operador === p.Empleado) || [];
    const totalViajes = viajesDelOperador.reduce((acc, v) => acc + v.Sueldo, 0);

    const sueldoDelOperador = sueldos.filter( (s)=> s.Empleado === p.Empleado) || [];
    const primerSueldo = sueldoDelOperador[0]
    const Infonavit = sueldoDelOperador.reduce((acc, s) =>  acc + (s.Prestamo_infonavit__FD_ ?? 0) + (s.Prestamo_Infonavit__CF_ ?? 0) + (s.Prestamo_Infonavit__PORC_ ?? 0), 0);
    const isrImssPension = sueldoDelOperador.reduce((acc, s) =>  acc + (s.I_S_R___mes_ ?? 0) + (s.Ajuste_al_neto ?? 0) + (s.I_M_S_S_ ?? 0) + (s.Pension_Alimenticia), 0);
    const sueldo = primerSueldo ? (totalViajes > primerSueldo.Percepcion_total ? totalViajes : primerSueldo.Sueldo_Real) : 0;
    const extras = sueldoDelOperador[0].Extra ?? 0;
    const total = (sueldo + extras) - Infonavit - isrImssPension - totalPrestamos - totalAdelantos
    const deposito1 = sueldoDelOperador[0].NETO ?? 0;
    const deposito2 = total - deposito1;

    return {
      idNomina: p.uniqueId,
      nombre: operador[0].Nombre ?? '',
      totalViajes,
      totalPrestamos,
      totalAdelantos,
      Infonavit,
      isrImssPension,
      sueldo,
      extras,
      deposito1,
      deposito2,
      total,
    };
  });

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Detalles nómina</h1>
        <p className="text-sm text-gray-600">Lista de detalles nómina</p>
      </div>
      <div className="flex justify-center mb-4">
        <form className="w-full max-w-4xl flex flex-wrap gap-2 items-end" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por operador..."
            className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
            
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          {(searchTerm || desde || hasta) && (
            <Link
              href="/nomina-detalles"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Limpiar
            </Link>
          )}
        </form>
      </div>


      {response?.ok === false ? (
        <p className="text-center text-red-500">Error al cargar las detalles nomina.</p>
      ) : (
        <>
          {Object.keys(sueldos).length === 0 ? (
            <div className="text-center text-gray-600 mt-6">
              <p>No se encontraron detalles de nomina que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <>
              <NominaTable nomina={nominas}/>
              <div className="flex justify-center mt-4">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
                    className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                  >
                    Anterior
                  </Link>
                )}
                {hayMasResultados && (
                  <Link
                    href={`?page=${page + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}${desde ? `&desde=${desde}` : ""}${hasta ? `&hasta=${hasta}` : ""}`}
                    className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
                  >
                    Siguiente
                  </Link>
                )}
              </div>

            </>
          )}
        </>
      )}

    </div>);
}
