'use client';
import { createConfiguracionTanques, getUnidadesPagination, updateConfiguracionTanqueById, getConfiguracionTanquesById } from "components/actions";
import { getUnidadesFiltro } from "components/actions/unidades/get-unidades-filtro";
import { ConfiguracionTanquesI } from "components/interfaces/configuracion_tanques";
import { UnidadI } from "components/interfaces/unidad";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnidadesTable({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<ConfiguracionTanquesI | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [unidades, setUnidades] = useState<UnidadI[]>([]);
  const [hayMasResultados, setHayMasResultados] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleCreate = async (configuracion_tanques: ConfiguracionTanquesI) => {
    const response = await createConfiguracionTanques(configuracion_tanques);
    return { ok: response?.ok ?? false };
  };

  const handleEdit = async (configuracion_tanques: ConfiguracionTanquesI) => {
    const response = await updateConfiguracionTanqueById(configuracion_tanques);
    return { ok: response.ok };
  };

  const abrirModalCrear = async (unidadId: number) => {
    const configExistente = await getConfiguracionTanquesById(unidadId);

    if (configExistente) {
      setItemEditando(configExistente);
      setIsEditing(true);
    } else {
      setItemEditando({
        litros_maximos_t1: 0,
        litros_maximos_t2: 0,
        litros_maximos_t3: 0,
        litros_maximos_t4: 0,
        litros_maximos_tg: 0,
        unidad: unidadId,
      });
      setIsEditing(false);
    }

    setIsModalOpen(true);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;

    const response = isEditing
      ? await handleEdit(itemEditando)
      : await handleCreate(itemEditando);

    if (response.ok) {
      alert("La configuracion de tanques se guardo correctamente");
      router.refresh();
    } else {
      alert("Error al guardar configuracion de tanques");
    }

    setIsModalOpen(false);
  };

  //const camposTanques: (keyof ConfiguracionTanquesI)[] = [ "litros_maximos_t1", "litros_maximos_t2", "litros_maximos_t3", "litros_maximos_t4", "litros_maximos_tg",];

  useEffect(() => {
    async function fetchData() {
      const resolvedParams = await searchParams;
      const pageParam = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
      const searchTermParam = resolvedParams.search || "";
      setPage(pageParam);
      setSearchTerm(searchTermParam);

      const pageSize = 15;
      const response = searchTermParam
        ? await getUnidadesFiltro(pageParam, pageSize, searchTermParam)
        : await getUnidadesPagination(pageParam, pageSize) ?? { ok: false, unidades: [] };

      setUnidades(response?.unidades ?? []);
      setHayMasResultados((response?.unidades?.length ?? 0) === pageSize);
    }

    fetchData();
  }, [searchParams]);

  return (
    <div className="px-2 py-2 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Unidades</h1>
        <p className="text-sm text-gray-600">Lista de unidades registradas</p>
      </div>

      <div className="flex justify-center mb-4">
        <form className="w-full max-w-xl flex flex-wrap gap-2" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Buscar por nombre, placa, modelo..."
            className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" >  Busca </button>
          {searchTerm && (
            <Link href="/unidades" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" > Limpiar </Link>
          )}
        </form>
      </div>

      {unidades.length === 0 ? (
        <div className="text-center text-gray-600 mt-6"> <p>No se encontraron unidades que coincidan con la búsqueda.</p>  </div>
 ) : (
        <div className="overflow-x-auto">
          <table className="table-auto mx-auto divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Nombre</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Placa</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Modelo</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Marca</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Año</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Tipo</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Combustible</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Descripción</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Característica</th>
                <th className="px-1 py-1 text-left text-xs font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unidades.map((unidad, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Nombre}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Placa}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Modelo}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Marca}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Ano}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Tipo_De_Unidad}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.combustible}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Descripcion}</td>
                  <td className="px-1 py-1 text-xs text-gray-700">{unidad.Caracteristica}</td>
                  <td className="px-1 py-1 text-xs text-indigo-600 font-medium">
                    <button className="hover:underline text-blue-600" onClick={() => abrirModalCrear(unidad.uniqueId)} > Configuración tanques </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}
                className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
              >
                Anterior
              </Link>
            )}
            {hayMasResultados && (
              <Link
                href={`?page=${page + 1}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}
                className="bg-blue-500 text-white px-4 py-1 m-1 rounded hover:bg-blue-600"
              >
                Siguiente
              </Link>
            )}
          </div>

          {isModalOpen && itemEditando && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold mb-2">
                  {isEditing ? "Editar configuración de tanques" : "Agregar configuración de tanques"}
                </h2>

                {[
                  { key: "litros_maximos_t1", label: "Litros máximos T1" },
                  { key: "litros_maximos_t2", label: "Litros máximos T2" },
                  { key: "litros_maximos_t3", label: "Litros máximos T3" },
                  { key: "litros_maximos_t4", label: "Litros máximos T4" },
                  { key: "litros_maximos_tg", label: "Litros máximos TG" }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      className="border rounded px-3 py-1 w-full"
                      value={String(itemEditando[key as keyof ConfiguracionTanquesI] ?? "")}
                      onChange={(e) =>
                        setItemEditando((prev) => ({
                          ...prev!,
                          [key]: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder={label}
                    />
                  </div>
                ))}

                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded"> Cancelar </button>
                  <button onClick={guardarCambios} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"> Guardar </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
