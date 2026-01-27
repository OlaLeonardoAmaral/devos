import { useState } from "react";
import { DotsThreeVertical, FileZip, ArrowSquareOut } from "@phosphor-icons/react";
import { ZipFile } from "../types"; // Assuming ZipFile type is moved or available here

interface ArchiveCardProps {
    file: ZipFile;
    onClick: () => void;
    isMoving: boolean;
    showActionsMenu?: boolean;
    onExtractRequest?: (file: ZipFile) => void;
    onStandardizeRequest?: (file: ZipFile) => void;
}


export function ArchiveCard({ file, onClick, isMoving, showActionsMenu, onExtractRequest, onStandardizeRequest }: ArchiveCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div
            className={`relative transition-transform transform`}
            key={file.id}
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
                    <h3 className="text-rotion-50 text-lg truncate flex-grow mr-2">{file.name}</h3>
                    {isMoving && (
                        <div className="animate-pulse text-green-500 text-sm">
                            Movendo...
                        </div>
                    )}
                    {showActionsMenu && (
                        <div className="relative">
                            <button
                                onClick={handleMenuToggle}
                                className="p-1 rounded hover:bg-rotion-700 focus:outline-none"
                                aria-label="Opções"
                            >
                                <DotsThreeVertical size={20} className="text-rotion-300" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-rotion-700 border border-rotion-600 rounded-md shadow-lg z-20 py-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onExtractRequest?.(file); setIsMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-rotion-100 hover:bg-rotion-600 flex items-center gap-2"
                                    >
                                        <FileZip size={16} /> Extrair arquivo
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onStandardizeRequest?.(file); setIsMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-rotion-100 hover:bg-rotion-600 flex items-center gap-2"
                                    >
                                        <ArrowSquareOut size={16} /> Padronizar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-rotion-400 text-sm">{file.modifiedAt}</p>
            </div>
            {isMenuOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            )}
        </div>
    )
}