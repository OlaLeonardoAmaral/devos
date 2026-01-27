import React, { useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { ZipFile } from '../../types'; // Assuming ZipFile type is moved or available here

interface StandardizationScreenProps {
  file: ZipFile;
  onBack: () => void;
  onSubmit: (file: ZipFile, standardizationData: StandardizationData) => void;
}

export interface StandardizationData {
  targetComponents: string; // e.g., "Botoes"
  properties: {
    height?: number;
    width?: number;
    icon?: string;
  };
}

const StandardizationScreen: React.FC<StandardizationScreenProps> = ({ file, onBack, onSubmit }) => {
  const [height, setHeight] = useState<number>(25);
  const [width, setWidth] = useState<number>(80);
  const [iconName, setIconName] = useState<string>('');

  const handleSubmit = () => {
    const standardizationData: StandardizationData = {
      targetComponents: "Botoes", // For now, hardcoded to "Botoes"
      properties: {
        height: height,
        width: width,
        icon: iconName || undefined, // Only include icon if a name is provided
      },
    };
    onSubmit(file, standardizationData);
  };

  return (
    <div className="fixed inset-0 bg-rotion-900 text-rotion-50 font-sans flex flex-col p-8 z-50">
      <header className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rotion-300 hover:text-rotion-100 transition-colors mb-4 p-2 rounded hover:bg-rotion-800"
        >
          <ArrowLeft size={24} />
          Voltar
        </button>
        <h1 className="text-4xl font-bold">Padronizar Arquivo: <span className="text-blue-400">{file.name}</span></h1>
      </header>

      <main className="flex-grow overflow-y-auto space-y-6 bg-rotion-800 p-6 rounded-lg shadow-xl">
        <section>
          <h2 className="text-2xl font-semibold text-rotion-100 mb-4 border-b border-rotion-700 pb-2">
            Configurações de Botões
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-rotion-300 mb-1">
                Height (Altura)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-rotion-900 border border-rotion-700 text-rotion-50 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-rotion-300 mb-1">
                Width (Largura)
              </label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-rotion-900 border border-rotion-700 text-rotion-50 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="iconName" className="block text-sm font-medium text-rotion-300 mb-1">
                Ícone (Nome para referência, ex: 'check', 'save')
              </label>
              <input
                type="text"
                id="iconName"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="Ex: check, add, edit"
                className="w-full bg-rotion-900 border border-rotion-700 text-rotion-50 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors text-lg"
        >
          Padronizar
        </button>
      </footer>
    </div>
  );
};

export default StandardizationScreen;