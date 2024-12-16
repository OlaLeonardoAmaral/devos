import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { ArchiveCard } from '../archive-card';
import { useArquivos } from '../../contexts/ListArquivoContext';
import Blank from './Blank';
import { ArrowsCounterClockwise } from '@phosphor-icons/react';
import { pastas } from '../../config/pathResolver';

const MainLayout = () => {
    const [title, setTitle] = useState<string>('Home');
    const { caminhoAtual, arquivos, atualizarArquivos } = useArquivos();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMoving, setIsMoving] = useState<{ [key: string]: boolean }>({});
    const [feedback, setFeedback] = useState<{ [key: string]: boolean }>({});
    const [isDragging, setIsDragging] = useState(false);


    const handleUpdate = () => {
        setIsUpdating(true);
        atualizarArquivos()

        setTimeout(() => {
            setIsUpdating(false);
        }, 1000);
    };

    const handleOpenFolder = (folderPath: string) => {
        window.api.openFolder(folderPath)
    }


    const handleMoveFile = async (
        nomeArquivo: string,
        pastaAtual: string,
        pastaDestino: string
    ) => {
        setIsMoving(prevState => ({ ...prevState, [nomeArquivo]: true }));
        pastaDestino = pastaDestino === pastas.home ? pastas.semModificacoes : pastas.home

        const result = await window.api.moveUniqueFiles(
            pastaAtual,
            pastaDestino,
            nomeArquivo
        );

        if (result.success) {
            setIsMoving(prevState => ({ ...prevState, [nomeArquivo]: false }));
            atualizarArquivos();

            setFeedback(prevState => ({ ...prevState, [pastaDestino]: true }));
            setTimeout(() => {
                setFeedback(prevState => ({ ...prevState, [pastaDestino]: false }));
            }, 1000)
        } else {
            result.error
        }
    }


    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true)
    };

    const handleDrop = async (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);


        const files = event.dataTransfer.files;

        for (const file of files) {
            if (file.type === 'application/zip') {
                const directoryPath = file.path.substring(0, file.path.lastIndexOf('/'));
                const result = await window.api.moveUniqueFiles(
                    directoryPath,
                    pastas.atualizar,
                    file.name
                );

                if (result.success) {
                    atualizarArquivos();

                    setFeedback(prevState => ({ ...prevState, [pastas.atualizar]: true }));
                    setTimeout(() => {
                        setFeedback(prevState => ({ ...prevState, [pastas.atualizar]: false }));
                    }, 1000)


                } else {
                    console.error('Erro ao mover o arquivo:', result.error);
                }
            } else {
                console.warn('Apenas arquivos .zip são suportados.');
            }
        }
    };



    return (
        <div
            className="grid h-screen bg-rotion-900 text-rotion-50 font-sans"
            style={{
                gridTemplateColumns: '16rem auto',
                gridTemplateRows: 'auto',
            }}
        >
            <Sidebar setTitle={setTitle} feedback={feedback} />

            <main
                className={`flex-grow bg-rotion-800 text-rotion-50 p-8 shadow-green-light animate-moveCard 
                    ${isDragging ? 'bg-rotion-700 border-2 border-dashed border-rotion-400' : ''}`}

                onDragOver={(event) => {
                    if (title === 'Atualizar') {
                        handleDragOver(event);
                    }
                }}

                onDrop={(event) => {
                    if (title === 'Atualizar') {
                        handleDrop(event);
                    }
                }}
                
                onDragLeave={() => setIsDragging(false)}
            >
                <header className="flex flex-col gap-3 colum text-rotion-50 p-2">
                    <div className="flex items-center gap-4 w-full">
                        <h1 className="text-4xl font-bold flex-grow truncate">
                            {title}
                        </h1>
                        <button
                            onClick={handleUpdate}
                            className="flex items-center justify-center p-2 rounded hover:bg-rotion-700"
                            aria-label="Recarregar"
                        >
                            <ArrowsCounterClockwise
                                size={32}
                                className={`text-rotion-50 ${isUpdating ? 'icon-spin' : ''}`}
                            />
                        </button>
                    </div>

                    <a
                        href='#'
                        onClick={() => handleOpenFolder(caminhoAtual)}
                        className="text-rotion-400 text-lg">
                        {caminhoAtual}
                    </a>
                </header>


                <div
                    className={`
                        flex 
                        flex-wrap 
                        gap-y-5 
                        gap-x-8
                        max-h-[calc(100vh-160px)] 
                        relative 
                        p-4
                        overflow-auto
                        ${arquivos.length === 0 ? 'flex items-center justify-center min-h-[calc(100vh-180px)]' : ''}`}
                >
                    {arquivos.length > 0 ? (
                        arquivos.map((file) => (
                            <ArchiveCard
                                id={file.id}
                                title={file.name}
                                date={file.modifiedAt}
                                onClick={() => handleMoveFile(file.name, caminhoAtual, caminhoAtual)}
                                isMoving={isMoving[file.name] || false}
                            />
                        ))
                    ) : (
                        <Blank message='' />
                    )}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;