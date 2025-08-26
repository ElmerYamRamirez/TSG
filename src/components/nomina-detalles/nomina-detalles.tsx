'use client';

import { deleteSueldoById, updateSueldoById, createSueldo } from "components/actions";
import { Sueldo } from "components/interfaces/sueldo";
import { OperadorI } from "components/interfaces/operador";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Adelanto } from "components/interfaces/adelanto";
import { Prestamo } from "components/interfaces/prestamo";

const handleCreate = async (item: Sueldo) => {
  const response = await createSueldo(item) ?? { ok: false };
  return response;
};

const handleEdit = async (sueldo: Sueldo) => {
  const response = await updateSueldoById(sueldo) ?? { ok: false, res: [] };
  const combustibles = response.res ?? [];
  return { ok: response.ok, combustibles };
}

const handleDarDeBaja = async (sueldo: Sueldo) => {
  console.log('Dar de baja:', sueldo.codigo);
  if (confirm(`¿Estás seguro de eliminar: ${sueldo.operador_name}?`)) {
    const { ok } = await deleteSueldoById(sueldo) ?? { ok: false, sueldo: [] };
    if (!ok) {
      alert("Hubo un error al eliminar la programación.");
    }
  }
}

// Calcular el total de deducciones
const calcularTotalDeducciones = (item: Sueldo): number => {
  return (
    (item.Prestamo_Infonavit__CF_ || 0) +
    (item.Prestamo_infonavit__FD_ || 0) +
    (item.Prestamo_Infonavit__PORC_ || 0) +
    (item.Subs_al_Empleo__mes_ || 0) +
    (item.I_S_R___mes_ || 0) +
    (item.I_M_S_S_ || 0) +
    (item.Ajuste_al_neto || 0) +
    (item.Pension_Alimenticia || 0)
  );
};

export default function NominaTable({ nomina}: { nomina: any[]}) {
  const [itemEditando, setItemEditando] = useState<Sueldo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const abrirModalEditar = (item: Sueldo) => {
    setItemEditando(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const abrirModalCrear = () => {
    setItemEditando({
      Percepcion_total: 0,
      Sueldo: null,
      Septimo_dia: null,
      Prestamo_infonavit__FD_: 0,
      Total_de_deducciones: 0,
      Prestamo_Infonavit__CF_: 0,
      Prestamo_Infonavit__PORC_: 0,
      Subs_al_Empleo__mes_: 0,
      I_S_R___mes_: 0,
      I_M_S_S_: 0,
      Ajuste_al_neto: 0,
      NETO: 0,
      Pension_Alimenticia: 0,
      codigo: 0,
      Empleado: '',
      Sueldo_Real: 0,
      Extra: 0,
      Bono_Puntualidad: null,
      Rebaje: 0,
      Sueldo_Real_Total: 0,
      operador_name: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleChange = (field: keyof Sueldo, value: string) => {
    if (!itemEditando) return;

    const numericValue = value === '' ? 0 : parseFloat(value);
    const updatedItem = { ...itemEditando, [field]: numericValue };

    // Recalcular Percepcion_total
    if (field === 'Sueldo' || field === 'Septimo_dia') {
      updatedItem.Percepcion_total = (updatedItem.Sueldo || 0) + (updatedItem.Septimo_dia || 0);
    }

    // Recalcular Sueldo_Real_Total
    if (field === 'Sueldo_Real' || field === 'Rebaje') {
      updatedItem.Sueldo_Real_Total = (updatedItem.Sueldo_Real || 0) - (updatedItem.Rebaje || 0);
    }

    // Recalcular las deducciones y el NETO
    updatedItem.Total_de_deducciones = calcularTotalDeducciones(updatedItem);
    updatedItem.NETO = (updatedItem.Percepcion_total || 0) - (updatedItem.Total_de_deducciones || 0);

    setItemEditando(updatedItem);
  };

  const guardarCambios = async () => {
    if (!itemEditando) return;

    if (isEditing) {
      const response = await handleEdit(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert('Error al guardar');
      }
    } else {
      const response = await handleCreate(itemEditando);
      if (response.ok) {
        router.refresh();
      } else {
        alert(response.message || 'Error al crear');
      }
    }

    setIsModalOpen(false);
  };

  const deletesueldo = async (item: Sueldo) => {
    await handleDarDeBaja(item);
    router.refresh();
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-end">
        </div>
        <table className="table-auto mx-auto divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Nombre</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Viajes</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Infonavit</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">ISR/IMSS/PENSION</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Prestamos</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Adelantos</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Sueldo</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Extras</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 1</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Dep 2</th>
              <th className="px-1 py-1 lg:py-2 text-left text-xs font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nomina.map((sueldo, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.nombre}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalViajes}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.Infonavit}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.isrImssPension}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalPrestamos}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.totalAdelantos}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.sueldo}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.extras}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{sueldo.deposito1}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{(sueldo.deposito2 > 0) ? sueldo.deposito2 : 0}</td>
                <td className="px-1 lg:py-1 text-xs text-gray-700">{(sueldo.total > sueldo.deposito1 ) ? sueldo.total : "Falta información de sueldos" }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}