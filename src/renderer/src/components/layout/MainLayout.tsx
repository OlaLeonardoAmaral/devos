import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { ArchiveCard } from '../archive-card';

const MainLayout = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState<string>('Home');
    const [caminhoPasta, setCaminhoPasta] = useState<string>('C:\\fontes');


    
    return (
        <div
            className="grid h-screen bg-rotion-900 text-rotion-50 font-sans"
            style={{
                gridTemplateColumns: '16rem auto',
                gridTemplateRows: 'auto',
            }}
        >
            <Sidebar setTitle={setTitle} setCaminhoPasta={setCaminhoPasta} />

            {/* Main Content */}
            <main className="flex-grow bg-rotion-800 text-rotion-50 p-8 shadow-green-light animate-moveCard">
                <header className="flex flex-col gap-3 colum text-rotion-100 mb-4">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <a
                        href='#'
                        className="text-rotion-400 text-lg">
                        {caminhoPasta}
                    </a>
                </header>

                <div
                    className={`
                        flex 
                        flex-wrap 
                        gap-4 
                        overflow-auto 
                        max-h-[calc(100vh-160px)] 
                        relative 
                        p-2`}
                >

                    {Array.from({ length: 20 }, (_, index) => (
                        <ArchiveCard
                            key={index}
                            title={`r2sandre_d7_${index + 1}.zip`}
                            date={`17/12-/2024 - 10h${22 + index}`}
                            onClick={() => console.log(`Click on card ${index + 1}`)}
                            isMoving={false}
                        />
                    ))}

                </div>

                {children}
            </main>
        </div>
    );
};

export default MainLayout;