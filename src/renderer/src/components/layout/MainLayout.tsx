import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { ArchiveCard } from '../archive-card';
import { useArquivos } from '../../contexts/ListArquivoContext';
import Blank from './Blank';

const MainLayout = () => {
    const [title, setTitle] = useState<string>('Home');
    const { caminhoAtual, arquivos } = useArquivos();



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
                                key={card.id}
                                title={card.title}
                                date={card.date}
                                onClick={() => console.log(`Clicked on ${card.title}`)}
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