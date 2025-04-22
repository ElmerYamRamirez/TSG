//import { Concept } from "@/types"; //importa clase concep
import { Table } from "./Table";
import { Prestamo } from "components/app/interfaces/prestamo";

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

export default function PrestamoC({ prestamo }: { prestamo: Prestamo[] }) { //  change any by Concept[]
  return (
    <div className="space-y-4 print:space-y-2 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 print:text-base print:pb-1">
                Detalles de Préstamos
              </h3>

              {/* Tabla de Comentarios de Préstamos */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 border-b pb-1 print:text-sm">
                  COMENTARIOS, PRÉSTAMOS DE LA SEMANA
                </h4>
                <Table
                  data={Array.isArray(prestamo) ? prestamo.filter((p) => p.Status === "EN VIGOR") : []}
                  columns={[
                    {
                      header: "FECHA ALTA",
                      accessor: (prestamo) =>
                        formatDateTime(prestamo.Fec_Alta) || "-",
                      className: "print:px-1 print:py-0.5",
                    },
                    {
                      header: "PAGO",
                      accessor: (prestamo) =>
                        `${prestamo.Numero_de_pagos + 1} - ${
                          Math.ceil(
                            prestamo.Monto_de_prestamo /
                              prestamo.Descuento_por_semana
                          ) || 0
                        }`,
                      className: "print:px-1 print:py-0.5",
                    },
                    {
                      header: "SALDO",
                      accessor: (prestamo) => (
                        <span className="font-medium">
                          $
                          {prestamo.Saldo?.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      ),
                      className: "print:px-1 print:py-0.5",
                    },
                  ]}
                  emptyMessage="No hay préstamos vigentes"
                  className="text-sm print:text-xs mt-2"
                />
              </div>

              {/* Tabla de Estado de Préstamos */}
              <div>
                <h4 className="font-medium text-gray-700 border-b pb-1 print:text-sm">
                  ESTATUS DE PRÉSTAMOS
                </h4>
                <Table
                  data={prestamo}
                  columns={[
                    {
                      header: "MONTO ORIGINAL",
                      accessor: (prestamo) =>
                        `$${prestamo.Monto_de_prestamo?.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`,
                      className: "print:px-1 print:py-0.5",
                    },
                    {
                      header: "PAGO SEMANAL",
                      accessor: (prestamo) =>
                        `$${prestamo.Descuento_por_semana?.toLocaleString(
                          "es-MX",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`,
                      className: "print:px-1 print:py-0.5",
                    },
                    {
                      header: "ESTATUS",
                      accessor: (prestamo) => (
                        <div className="flex items-center">
                          {prestamo.Status}
                          <span
                            className={`inline-block w-2 h-2 rounded-full ml-2 ${
                              prestamo.Status == "EN VIGOR"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                      ),
                      className: "print:px-1 print:py-0.5",
                    },
                    {
                      header: "Comentario",
                      accessor: (prestamo) =>
                        `${prestamo.Comentario?.toString()}`,
                      className: "print:px-1 print:py-0.5",
                    },
                  ]}
                  className="min-w-full text-sm print:text-xs mt-2"
                />
              </div>
            </div>
  );
}