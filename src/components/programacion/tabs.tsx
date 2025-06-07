'use client';
import React, { useState } from 'react';
import Viaticos from './viaticos';
import Casetas from './casetas';
import Combustibles from './combustibles';

const tabs = ['Combustible', 'Viáticos', 'Casetas'];

interface ProgramacionI {
  uniqueId: number;
  Bit_Activo: boolean;
  Usu_Alta: number;
  Fec_Alta: string;
  Cliente: number;
  Operador: number;
  Unidad: number;
  Comentario: string;
  Destino_de_la_unidad: number;
  Fecha_programada: string;
  Hora_programada: string;
  Sueldo: number;
  nomina: number;
  folio: string;
  nombre_destino: string;
  cliente_name: string;
  operador_name: string;
  viaticos:[]
  casetas:[]
  combustibles: [];
} 

export default function Tabs({programacion}:{programacion: ProgramacionI}){
  const [activeTab, setActiveTab] = useState('Combustible');
 

  const renderContent = () => {
    switch (activeTab) {
      case 'Combustible':
      return <Combustibles></Combustibles>
      case 'Viáticos':
        return <Viaticos viaticos={programacion.viaticos} programacion={programacion.uniqueId}></Viaticos>;
      case 'Casetas':
        return <Casetas casetas={programacion.casetas} programacion={programacion.uniqueId}></Casetas>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium text-sm transition-all border-b-2 ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white border border-t-0 p-4 rounded-b-md shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};