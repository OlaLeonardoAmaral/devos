import { FileZip } from '@phosphor-icons/react';
import React from 'react';


const Blank = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-6 p-8">
            <div className="relative">
                <FileZip
                    className=" text-rotion-500 w-24 h-24 opacity-30 animate-bounce-slow"
                />
            </div>

            <div className="text-center">
                <h2
                    className="
                        text-rotion-300 
                        text-2xl 
                        font-semibold 
                        tracking-wide 
                        mb-2 
                        opacity-80 
                        transition-all 
                        duration-500 
                        transform hover:scale-105"
                >
                    {message}
                </h2>
                <p
                    className="
            text-rotion-400 
            text-sm 
            opacity-60 
            italic
          "
                >
                    Parece que não há nada por aqui
                </p>
            </div>

        </div>
    );
};

export default Blank;