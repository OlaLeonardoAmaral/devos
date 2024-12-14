import React, { createContext, useContext, useEffect, useState } from 'react';
import { ZipFile } from '../types';
import { pastas } from '../config/pathResolver';


type ArquivoContextType = {
    caminhoAtual: string;
    arquivos: ZipFile[];
    mudarCaminho: (novoCaminho: string) => void;
};

const ListArquivoContext = createContext<ArquivoContextType | undefined>(undefined);

export const ArquivoProvider = ({ children }: { children: React.ReactNode }) => {
    const [caminhoAtual, setCaminhoAtual] = useState<string>(pastas.home);
    const [arquivosEmPasta, setArquivosEmPasta] = useState<ZipFile[]>([]);


    const mudarCaminho = async (novoCaminho: string) => {
        setCaminhoAtual(novoCaminho);
    };

    useEffect(() => {
        const atualizarArquivos = async () => {
            const arquivos = await window.api.getZipFiles(caminhoAtual);
            setArquivosEmPasta(arquivos);
        };

        atualizarArquivos();
    }, [caminhoAtual]);



    const arquivos = arquivosEmPasta;

    return (
        <ListArquivoContext.Provider value={{ caminhoAtual, arquivos, mudarCaminho }}>
            {children}
        </ListArquivoContext.Provider>
    );
};


export const useArquivos = () => {
    const context = useContext(ListArquivoContext);
    if (!context) {
        throw new Error('useArquivos deve ser usado dentro de ArquivoProvider');
    }
    return context;
};