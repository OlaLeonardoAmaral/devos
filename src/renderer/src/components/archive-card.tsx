import { useState } from "react";

interface ArchiveCardProps {
    title: string;
    date: string;
    id: string;
    onClick: () => void;
    isMoving: boolean;
}


export function ArchiveCard({ id, title, date, onClick, isMoving }: ArchiveCardProps) {


    return (
        <div
            className={`relative transition-transform transform`}
            key={id}
            onClick={onClick}
        >
            <div
                className={`
                    flex
                    flex-col
                    gap-2
                    bg-rotion-800 
                    p-4
                    pl-6 
                    rounded-lg 
                    border 
                    border-rotion-600 
                    h-24 
                    w-64 
                    cursor-pointer 
                    transition-transform 
                    transform 
                    relative 
                    hover:scale-105 
                    hover:shadow-lg 
                    hover:z-10`}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-rotion-50 text-lg truncate flex-grow mr-2">{title}</h3>
                    {isMoving && (
                        <div className="animate-pulse text-green-500 text-sm">
                            Movendo...
                        </div>
                    )}
                </div>
                <p className="text-rotion-400 text-sm">{date}</p>
            </div>
        </div>
    )
}