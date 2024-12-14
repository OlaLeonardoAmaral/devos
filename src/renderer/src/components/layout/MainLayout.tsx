import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { ArchiveCard } from '../archive-card';
import { useArquivos } from '../../contexts/ListArquivoContext';
import Blank from './Blank';

const MainLayout = () => {
    const [title, setTitle] = useState<string>('Home');
    const { caminhoAtual, arquivos } = useArquivos();




    //   const { data, refetch } = useQuery(
    //     {
    //       queryKey: ['files'],
    //       queryFn: getMyFiles,
    //     }
    //   )


    // Função para mover o arquivo ao clicar
    //   const handleFileMove = async (fileName: string, currentFolder: string, targetFolder: string) => {
    //     setIsMoving(prevState => ({ ...prevState, [fileName]: true })); // Ativa a animação para o card específico


    //     try {
    //       const result = await window.api.moveUniqueFiles(
    //         currentFolder,
    //         targetFolder,
    //         fileName
    //       );

    //       if (result.success) {
    //         console.log('Arquivo movido com sucesso!');
    //         refetch(); // Atualiza a lista de arquivos após mover
    //       } else {
    //         console.error('Erro ao mover arquivo:', result.error);
    //       }
    //     } catch (error) {
    //       console.error('Erro ao mover arquivo:', error);
    //     } 



    //     finally {
    //       setTimeout(() => {
    //         setIsMoving(prevState => ({ ...prevState, [fileName]: false })); // Reseta a animação após a transição
    //       }, 300);
    //     }
    //   };                                




    // De: Meus Fontes ;;; Para: A Fazer
    // onClick={() => handleFileMove(archive.name, sourceFolderMyFiles, sourceFolderAFazer)}

    // De: A Fazer ;;; Para: Meus Fontes
    // onClick={() => handleFileMove(archive.name, sourceFolderAFazer, sourceFolderMyFiles)} 



    return (
        <div
            className="grid h-screen bg-rotion-900 text-rotion-50 font-sans"
            style={{
                gridTemplateColumns: '16rem auto',
                gridTemplateRows: 'auto',
            }}
        >
            <Sidebar setTitle={setTitle} />


            <main className="flex-grow bg-rotion-800 text-rotion-50 p-8 shadow-green-light animate-moveCard">
                <header className="flex flex-col gap-3 colum text-rotion-50 p-2">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <a
                        href='#'
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
                        overflow-auto 
                        max-h-[calc(100vh-160px)] 
                        relative 
                        p-4
                        ${arquivos.length === 0 ? 'flex items-center justify-center min-h-[calc(100vh-160px)]' : ''}
                        `}
                >
                    {arquivos.length > 0 ? (
                        arquivos.map((card) => (
                            <ArchiveCard
                                id={0}
                                title={card.name}
                                date={card.modifiedAt}

                                // De: Meus Fontes ;;; Para: A Fazer
                                // onClick={() => handleFileMove(archive.name, sourceFolderMyFiles, sourceFolderAFazer)}

                                // De: A Fazer ;;; Para: Meus Fontes
                                // onClick={() => handleFileMove(archive.name, sourceFolderAFazer, sourceFolderMyFiles)} 
                                onClick={() => console.log(`Clicked on ${card.name}`)}



                                isMoving={false}
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