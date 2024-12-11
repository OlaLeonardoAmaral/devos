import React, { createContext, useContext, useState } from 'react';

// Define a estrutura para os arquivos e pastas
type Arquivo = { id: number; title: string; date: string };
type ArquivoContextType = {
    caminhoAtual: string;
    arquivos: Arquivo[];
    mudarCaminho: (novoCaminho: string) => void;
};

// Inicializa o contexto
const ListArquivoContext = createContext<ArquivoContextType | undefined>(undefined);

// Dados simulados
const arquivosPorCaminho: { [key: string]: Arquivo[] } = {
    'C:\\Fontes': [
        { id: 1, title: 'p9spaulo_d7.zip', date: '02/11/2024 - 20h22' },
        { id: 2, title: 'r2sandre_d7.zip', date: '02/11/2024 - 20h22' },
        { id: 3, title: 'prrpreto_d7.zip', date: '02/11/2024 - 20h22' },
    ],
    'U:\\Fontes\\Sem Modificações': [
        { id: 4, title: 'outro_arquivo.zip', date: '03/11/2024 - 15h45' },
        { id: 5, title: 'mais_um.zip', date: '04/11/2024 - 12h30' },
    ],
};

// Provider do contexto
export const ArquivoProvider = ({ children }: { children: React.ReactNode }) => {
    const [caminhoAtual, setCaminhoAtual] = useState<string>('C:\\fontes');

    const mudarCaminho = (novoCaminho: string) => {
        setCaminhoAtual(novoCaminho);
    };

    const arquivos = arquivosPorCaminho[caminhoAtual] || [];

    return (
        <ListArquivoContext.Provider value={{ caminhoAtual, arquivos, mudarCaminho }}>
            {children}
        </ListArquivoContext.Provider>
    );
};

// Hook para acessar o contexto
export const useArquivos = () => {
    const context = useContext(ListArquivoContext);
    if (!context) {
        throw new Error('useArquivos deve ser usado dentro de ArquivoProvider');
    }
    return context;
};