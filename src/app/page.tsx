"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Personal } from "./interfaces/personal";
import { Adelanto } from "./interfaces/adelanto";
import { Envio } from "./interfaces/envio";
import { Sueldo } from "./interfaces/sueldo";
import { Prestamo } from "./interfaces/prestamo";
import { Table } from "../components/Table";
import PrestamoC from "components/components/Prestamo";
import { nomina } from "./interfaces/nomina";
import { prestamo_pago } from "./interfaces/prestamo_pago";
import { nomina_prestamo } from "./interfaces/nomina_prestamo";
import { deduccion } from "./interfaces/deduccion";
import { percepcion } from "./interfaces/percepcion";

export default function Page() {
  // Estados principales
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [selectedPersonalId, setSelectedPersonalId] = useState<string>("");
  const [adelanto, setAdelanto] = useState<Adelanto[]>([]);
  const [prestamo, setPrestamo] = useState<Prestamo[]>([]);
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [sueldos, setSueldos] = useState<Sueldo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate] = useState<string>(getFridayDate());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nomina, setNomina] = useState<any>();

  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtrar personal basado en el término de búsqueda
  const filteredPersonal = useMemo(() => {
    return personal.filter(
      (operator) =>
        operator.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.CURP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operator.RFC.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [personal, searchTerm]);

  // Operador seleccionado
  const selectedOperator = useMemo(() => {
    return personal.find((op) => op.uniqueId == selectedPersonalId) || null;
  }, [personal, selectedPersonalId]);

  // Obtener datos iniciales

  //personal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/ticket-nomina/api/personal/");
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: Personal[] = await response.json();
        setPersonal(data);
        if (data.length > 0) {
          setSelectedPersonalId(data[0].uniqueId);
        }
      } catch (err) {
        setError("Error al cargar los datos del personal");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //adelantos
  useEffect(() => {
    const fetchAdelantos = async () => {
      if (!selectedPersonalId) {
        setAdelanto([]);
        return;
      }

      try {
        const response = await fetch(
          `/ticket-nomina/api/adelantos/${selectedPersonalId}`
        );

        if (response.status == 404) {
          setAdelanto([]);
          return;
        }

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data: Adelanto[] = await response.json();
        setAdelanto(data);
      } catch (err) {
        console.error("Error fetching adelanto:", err);
        setAdelanto([]);
      }
    };

    fetchAdelantos();
  }, [selectedPersonalId]);

  //prestamos
  useEffect(() => {
    const fetchPrestamos = async () => {
      if (!selectedPersonalId) {
        setPrestamo([]);
        return;
      }
      try {
        const response = await fetch(
          `/ticket-nomina/api/prestamos/${selectedPersonalId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Prestamo[] = await response.json();
        setPrestamo(data);
      } catch (err) {
        console.error("Error al cargar prestamos:", err);
        setPrestamo([]);
      }
    };
    fetchPrestamos();
  }, [selectedPersonalId]);

  //envios
  useEffect(() => {
    const fetchEnvios = async () => {
      if (selectedOperator?.Foraneo == 0 || !selectedPersonalId) {
        setEnvios([]);
        return;
      }

      try {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const lastSaturday = new Date(today);
        lastSaturday.setDate(today.getDate() - dayOfWeek - 1);

        const thisFriday = new Date(today);
        thisFriday.setDate(today.getDate() + (5 - dayOfWeek));

        const adjustToMexicoTimezone = (date: Date) => {
          const offset = -6;
          const adjustedDate = new Date(
            date.getTime() + offset * 60 * 60 * 1000
          );
          return adjustedDate.toISOString().split("T")[0];
        };

        const response = await fetch(
          `/ticket-nomina/api/envios/${selectedPersonalId}?startDate=${adjustToMexicoTimezone(
            lastSaturday
          )}&endDate=${adjustToMexicoTimezone(thisFriday)}`
        );

        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data: Envio[] = await response.json();
        setEnvios(data);
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setEnvios([]);
      }
    };

    fetchEnvios();
  }, [selectedPersonalId, selectedOperator?.Foraneo]);

  //sueldos
  useEffect(() => {
    const fetchSueldos = async () => {
      if (!selectedPersonalId) {
        setSueldos(null);
        return;
      }
      try {
        const response = await fetch(
          `/ticket-nomina/api/sueldos/${selectedPersonalId}/`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sueldo = await response.json();
        setSueldos(data);
      } catch (err) {
        console.error("Error al cargar sueldos:", err);
        setSueldos(null);
      }
    };
    fetchSueldos();
  }, [selectedPersonalId]);

  const totalViajes = () => {
    return envios.reduce((total, envio) => total + (envio.Sueldo || 0), 0);
  };

  // Manejo de eventos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleOperatorSelect = (id: string) => {
    setSelectedPersonalId(id);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const adelantoTotal = useMemo(() => {
    if (!Array.isArray(adelanto) || adelanto.length == 0) return 0;
    return adelanto.reduce((total, item) => total + (item.Cantidad || 0), 0);
  }, [adelanto]);

  const ShipmentsTable = ({ envios }: { envios: Envio[] }) => {
    const columns = [
      {
        header: "Fecha",
        accessor: (envio: Envio) =>
          envio.Fecha_programada ? new Date(envio.Fecha_programada).toLocaleDateString("es-MX") : "Sin fecha",
      },
      {
        header: "Destino",
        accessor: (envio: Envio) => envio.Nombre_destino || "-",
      },
      {
        header: "Sueldo",
        accessor: (envio: Envio) => (
          <span className="font-medium text-gray-900">
            $
            {envio.Sueldo?.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
      },
    ];

    const footerContent =
      envios.length > 0 ? (
        <>
          <td
            colSpan={2}
            className="px-6 py-3 text-right text-sm font-medium text-gray-500"
          >
            Total:
          </td>
          <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
            $
            {totalViajes().toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </td>
        </>
      ) : null;

    return (
      <Table
        data={envios}
        columns={columns}
        title="Envíos de la semana"
        showFooter={envios.length > 0}
        footerContent={footerContent}
        emptyMessage="No hay envíos registrados en este período"
        className="mt-6"
      />
    );
  };

  const totalDescuentoPrestamos = useMemo(() => {
    return prestamo.length > 0
      ? prestamo
        .filter((item) => item.Status == "EN VIGOR")
        .reduce((total, item) => total + (item.Descuento_por_semana || 0), 0)
      : 0;
  }, [prestamo]);

  const handlePrint = () => window.print();

  const ConfirmDialog = () => {
    if (!showConfirmDialog) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 print:hidden">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmación de Nómina
          </h3>
          <p className="text-gray-600 mb-6">
            Está a punto de autorizar la información mostrada y se actualizarán
            los registros. Le recomendamos descargar el ticket antes de
            continuar.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50"
            >
              Descargar Ticket
            </button>
            <button
              onClick={() => {
                setShowConfirmDialog(false);
                handleConfirm();
              }}
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Acepto
            </button>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // 1. Actualizar adelantos (marcar como descontados)
      // El problema de este codigo que si alguna actualizacion falla, 
      // manda un mensage de error pero las demas actualizaciones ya no se revierten
      // en mi parecer se tiene que crear un nuevo endpoint 
      // donde se mande un array de "Adelantos" y hacer la actualizacion con una transsaccion SQL
      // esto permitira hacer una actualizacion de un todo o nada. 
      if (adelanto.length > 0) {
        await Promise.all(
          adelanto.map(async (item) => {
            const response = await fetch(
              `/ticket-nomina/api/adelantos/${item.uniqueId}/`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "DESCONTADO",
                }),
              }
            );
            console.info(response);
            if (!response.ok)
              throw new Error(`Error al actualizar adelanto ${item.uniqueId}`);
          })
        );
      }

      // 2. Actualizar préstamos (verificar si se completó el pago)
      /* El problema de este codigo que si alguna actualizacion falla, 
       manda un mensage de error pero las demas actualizaciones ya no se revierten
       en mi parecer se tiene que crear un nuevo endpoint 
       donde se mande un array de "Prestamos" y hacer la actualizacion con una transsaccion SQL
      esto permitira hacer una actualizacion de un todo o nada.*/
      if (prestamo.length > 0) {
        await Promise.all(
          prestamo.map(async (item) => {
            const newSaldo =
              (item.Saldo || 0) - (item.Descuento_por_semana || 0);
            const isFullyPaid = newSaldo <= 0;

            const response = await fetch(
              `/ticket-nomina/api/prestamos/${item.uniqueId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  Saldo: isFullyPaid ? 0 : newSaldo,
                  Status: isFullyPaid ? "PAGADO" : "EN VIGOR",
                  Numero_de_pagos: isFullyPaid
                    ? (item.Numero_de_pagos || 0) + 1
                    : item.Numero_de_pagos + 1,
                }),
              }
            );
            console.info(isFullyPaid);
            console.info(
              isFullyPaid
                ? (item.Numero_de_pagos || 0) + 1
                : item.Numero_de_pagos + 1
            );
            if (!response.ok)
              throw new Error(`Error al actualizar préstamo ${item.uniqueId}`);
          })
        );
      }

      //Hacer la llamada a POST /nominas para poder crear una nueva nomina
      const requestBodyNomina = buildNominaBody();
      console.log(requestBodyNomina);
      const createNomina = await fetch('/ticket-nomina/api/nominas/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBodyNomina),
      })

      //window.location.reload();
      alert("✅ Pago confirmado con éxito");

    } catch (err) {
      console.error("Error al confirmar pago:", err);
      alert(
        "❌ Error al confirmar el pago: " +
        (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  const tipoOperador = {
    1: "Foráneo",
    0: "Local",
  };

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return "-";

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(dateString).toLocaleString("es-MX", options);
  };

  // Estados de carga
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (personal.length == 0) return <EmptyState />;

  //crear nomina body request
  const buildNominaBody = (): nomina => {
    const periodoPago = getPeriodoPago();
    const totalPercepciones = (totalViajes() > (sueldos?.NETO || 0)) ? ( totalViajes()) : (sueldos?.NETO || 0);
    const totalDeducciones = (sueldos?.Total_de_deducciones || 0) + (adelantoTotal || 0) + (totalDescuentoPrestamos || 0);
    const deducciones: deduccion[] = [];
    const percepciones: percepcion[] = [];

    if ((sueldos?.I_S_R___mes_ || 0) > 0) {
      deducciones.push({ nombre: "ISR", monto: sueldos?.I_S_R___mes_ });
    }
    if ((sueldos?.I_M_S_S_ || 0) > 0) {
      deducciones.push({ nombre: "IMSS", monto: sueldos?.I_M_S_S_ });
    }
    if ((sueldos?.Pension_Alimenticia || 0) > 0) {
      deducciones.push({
        nombre: "Pensión Alimenticia",
        monto: sueldos?.Pension_Alimenticia,
      });
    }
    if ((sueldos?.Prestamo_infonavit__FD_ ||0 )> 0) {
      deducciones.push({
        nombre: "Infonavit (FD)",
        monto: sueldos?.Prestamo_infonavit__FD_,
      });
    }
    if ((sueldos?.Prestamo_Infonavit__CF_ || 0 ) > 0) {
      deducciones.push({
        nombre: "Infonavit (CF)",
        monto: sueldos?.Prestamo_Infonavit__CF_,
      });
    }
    if ((sueldos?.Prestamo_Infonavit__PORC_ || 0 ) > 0) {
      deducciones.push({
        nombre: "Infonavit %",
        monto: sueldos?.Prestamo_Infonavit__PORC_,
      });
    }
    if (adelantoTotal > 0 ){
      deducciones.push({
        nombre: "Adelanto",
        monto: adelantoTotal,
      })
    }

    if (totalDescuentoPrestamos > 0 ){
      deducciones.push({
        nombre: "Préstamo",
        monto: totalDescuentoPrestamos,
      })
    }

    if((sueldos?.NETO || 0) > 0){
      percepciones.push({
        nombre: "depósito 1",
        monto: (sueldos?.NETO || 0),
      })
    }

    if( totalViajes() > (sueldos?.NETO || 0) ){
      percepciones.push({
        nombre: "depósito 2",
        monto: totalViajes() - (sueldos?.NETO || 0),
      })
    } else {
      percepciones.push({
        nombre: "depósito 2",
        monto: 0,
      })
    }

    return {
      operador: parseInt(selectedPersonalId),
      fecha_inicio: periodoPago.saturday,
      fecha_final: periodoPago.friday,
      fecha_generada: new Date(Date.now()),
      deducciones: deducciones,
      percepciones: percepciones,
      prestamo_pagos: prestamo.map((p) : prestamo_pago => ({
        saldo: p.Saldo,
        fecha: new Date(Date.now()),
        numero_pago: (p.Numero_de_pagos + 1).toString() + "-" + (Math.ceil(p.Monto_de_prestamo / p.Descuento_por_semana) || 0).toString(), // cambiar por string pagos
        status: p.Status,
        prestamo: parseInt(p.uniqueId),
      })),
      nomina_prestamos: prestamo.map((p) : nomina_prestamo => ({
        prestamo: parseInt(p.uniqueId),
      })),
      envios: envios.map((e): Envio => ({
        uniqueId: e.uniqueId,
      })),
      total_percepciones: totalPercepciones,
      total_deducciones: totalDeducciones,
      total_neto: totalPercepciones - totalDeducciones,
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:p-0">
      {/* Header */}
      <header className="mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          Sistema de Nómina
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Gestión y control de pagos semanales
        </p>
      </header>

      {/* Contenedor principal */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden print:shadow-none">
        {/* Selector de operador con búsqueda */}
        <div className="p-6 bg-indigo-50 border-b border-indigo-100 print:hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Operador
          </label>

          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
              <SearchIcon className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                className="w-full p-3 focus:outline-none"
                placeholder="Buscar por nombre, CURP o RFC..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
              />
            </div>

            {/* Dropdown de resultados */}
            {isDropdownOpen && filteredPersonal.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none">
                {filteredPersonal.map((operator) => (
                  <div
                    key={operator.uniqueId}
                    className={`cursor-pointer hover:bg-indigo-50 px-4 py-2 ${operator.uniqueId == selectedPersonalId
                      ? "bg-indigo-100"
                      : ""
                      }`}
                    onClick={() => handleOperatorSelect(operator.uniqueId)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {operator.Nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tipoOperador[operator.Foraneo as 0 | 1]} -{" "}
                          {operator.CURP}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comprobante de nómina */}
        <div className="p-8 print:p-6">
          {/* Encabezado para impresión */}
          <div className="hidden print:block mb-6 border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  COMPROBANTE DE NÓMINA
                </h2>
                <p className="text-sm text-gray-500">
                  Fecha: {new Date().toLocaleDateString("es-MX")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ID: {selectedPersonalId}
                </p>
              </div>
            </div>
          </div>
          {/* Información del período */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg print:bg-transparent print:border-b print:pb-4">
            <h3 className="text-lg font-semibold text-blue-800 print:text-gray-800">
              Período de Pago
            </h3>
            <p className="text-blue-600 print:text-gray-700">{currentDate}</p>
          </div>

          {/* Grid de información */}

          {/* Datos de adelantos y prestamos con suma al final por separado una tabla */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Datos del Empleado */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Datos del Empleado
              </h3>
              {selectedOperator ? (
                <div className="space-y-2">
                  <InfoRow
                    label="Nombre"
                    value={selectedOperator.Nombre || "-"}
                  />
                  <InfoRow
                    label="Tipo de empleado"
                    value={selectedOperator.Foraneo == 1 ? "Foráneo" : "Local"}
                  />
                </div>
              ) : (
                <p className="text-gray-500">No hay datos del empleado</p>
              )}
            </div>

            {/* Sección de Préstamos reorganizada */}
            <PrestamoC prestamo={prestamo} />
          </div>
          {/* Tabla de viajes */}
          {selectedOperator?.Foraneo == 1 &&
            (envios.length > 0 ? (
              <ShipmentsTable envios={envios} />
            ) : (
              <p className="text-gray-500 mt-4 border-b pb-2 border-t pt-2">
                No hay viajes registrados esta semana.
              </p>
            ))}

          {/* informacion de sueldos */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Desglose de Sueldo
            </h3>

            {sueldos ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Percepciones */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">
                      Percepciones
                    </h4>

                    <InfoRow
                      label="depósito 1"
                      value={`$${(sueldos.NETO || 0).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}`}
                    />

                    {
                      totalViajes() > (sueldos?.NETO || 0) ? (
                        <InfoRow
                          label="depósito 2"
                          value={`$${(
                            totalViajes() - (sueldos?.NETO || 0)
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}`}
                        />
                      ) : (
                        <InfoRow
                          label="depósito 2"
                          value={`$${(
                            0
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}`}
                        />
                      )
                    }

                    <div className="pt-2 border-t">
                      {totalViajes() > (sueldos?.NETO || 0) ? (
                        <InfoRow
                          label="Total Percepciones"
                          value={`$${(
                            totalViajes()
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}`}
                          highlight={true}
                        />
                      ) : (
                        <InfoRow
                          label="Total Percepciones"
                          value={`${(
                            (sueldos.NETO || 0)
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}`}
                          highlight={true}
                        />
                      )}

                    </div>
                  </div>

                  {/* Deducciones */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">
                      Deducciones
                    </h4>

                    {sueldos?.I_S_R___mes_ > 0 && (
                      <InfoRow
                        label="ISR"
                        value={`-$${sueldos.I_S_R___mes_.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                        negative
                      />
                    )}

                    {sueldos?.I_M_S_S_ > 0 && (
                      <InfoRow
                        label="IMSS"
                        value={`-$${sueldos.I_M_S_S_.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}`}
                        negative
                      />
                    )}

                    {sueldos?.Pension_Alimenticia > 0 && (
                      <InfoRow
                        label="Pensión Alimenticia"
                        value={`-$${sueldos.Pension_Alimenticia.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                        negative
                      />
                    )}

                    {sueldos?.Prestamo_infonavit__FD_ > 0 && (
                      <InfoRow
                        label="Infonavit (FD)"
                        value={`-$${sueldos.Prestamo_infonavit__FD_.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                        negative
                      />
                    )}

                    {sueldos?.Prestamo_Infonavit__CF_ > 0 && (
                      <InfoRow
                        label="Infonavit (CF)"
                        value={`-$${sueldos.Prestamo_Infonavit__CF_.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                        negative
                      />
                    )}

                    {sueldos?.Prestamo_Infonavit__PORC_ > 0 && (
                      <InfoRow
                        label="Infonavit (%)"
                        value={`-${sueldos.Prestamo_Infonavit__PORC_.toLocaleString(
                          "es-MX"
                        )}%`}
                        negative
                      />
                    )}

                    {/* Mostrar adelanto como deducción */}
                    {adelanto.length > 0 && (
                      <InfoRow
                        label="Adelanto"
                        value={`-$${adelantoTotal.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}`}
                        negative
                      />
                    )}

                    {/* Mostrar prestamo como deducción */}
                    {totalDescuentoPrestamos > 0 && (
                      <InfoRow
                        label="Préstamo"
                        value={`-$${totalDescuentoPrestamos.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                        negative
                      />
                    )}
                    <div className="pt-2 border-t">
                      <InfoRow
                        label="Total Deducciones"
                        value={`-$${(
                          (sueldos?.Total_de_deducciones || 0) +
                          (adelantoTotal || 0) +
                          (totalDescuentoPrestamos || 0)
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}`}
                        highlight
                        negative
                      />
                    </div>
                  </div>
                </div>

                {/* Total Neto */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  {selectedOperator?.Foraneo == 1 &&
                    totalViajes() > (sueldos?.Sueldo || 0) ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total percepciones
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          $
                          {(((totalViajes() || 0) - (sueldos?.NETO || 0)) + (sueldos.NETO || 0)).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total deducciones
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          $
                          {(
                            (totalDescuentoPrestamos || 0) - (adelantoTotal || 0)
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="pt-2 border-t flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total Neto a Pagar
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          $
                          {(
                            (totalViajes() || 0) -
                            ((sueldos?.Total_de_deducciones || 0) +
                              (adelantoTotal || 0) +
                              (totalDescuentoPrestamos || 0))
                          ).toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total Neto a Pagar
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        $
                        {(
                          ((sueldos?.NETO || 0)
                            //Elmer: comente esta parte por que sueldo_real es igual a cero en la tabla y me restaba el neto dando valores negativos
                            /* + (sueldos.sueldo_real - sueldos.NETO)*/ +
                            (sueldos.extra || 0)) -
                          (totalDescuentoPrestamos || 0) -
                          (adelantoTotal || 0)
                        ).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                No hay información de sueldo disponible
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-8 flex justify-end space-x-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center"
            >
              <PrinterIcon className="w-5 h-5 mr-2" />
              Imprimir
            </button>
            {/* Botón de confirmar pago */}
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center"
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              Confirmar Pago
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>

  );
}

// Componentes auxiliares
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md mx-auto">
    <div className="flex">
      <div className="flex-shrink-0">
        <ExclamationIcon className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      No hay operadores registrados
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Comienza agregando nuevos operadores al sistema.
    </p>
  </div>
);

const InfoRow = ({
  label,
  value,
  highlight = false,
  negative = false,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  negative?: boolean;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p
      className={`mt-1 text-sm ${highlight
        ? negative
          ? "font-semibold text-red-600"
          : "font-semibold text-indigo-600"
        : negative
          ? "text-red-600"
          : "text-gray-900"
        }`}
    >
      {value || "-"}
    </p>
  </div>
);

// Funciones de utilidad
const getFridayDate = (): string => {
  const periodoPago = getPeriodoPago();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return `${periodoPago.saturday.toLocaleDateString(
    "es-MX",
    options
  )} - ${periodoPago.friday.toLocaleDateString("es-MX", options)}`;
};

// Iconos (puedes reemplazar con tu librería de iconos preferida)
const PrinterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const ExclamationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const getPeriodoPago = (): { saturday : Date; friday: Date} => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + (7 - dayOfWeek);
  const friday = new Date(today);
  friday.setDate(today.getDate() + daysUntilFriday);

  const saturday = new Date(friday);
  saturday.setDate(friday.getDate() - 6);
  
  return { saturday, friday };
};