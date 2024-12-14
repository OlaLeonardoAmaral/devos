import React, { useState } from 'react';
import { useArquivos } from '../../contexts/ListArquivoContext';
import { menu } from '../../config/pathResolver';
import { CheckFat } from '@phosphor-icons/react';


interface SidebarProps {
    setTitle: (title: string) => void
    feedback: { [key: string]: boolean }
}


const Sidebar = ({ setTitle, feedback }: SidebarProps) => {
    const [activeItem, setActiveItem] = useState<string>('Home');
    const { mudarCaminho } = useArquivos();

    const handleItemClick = (itemTitle: string, itemCaminhoPasta: string) => {
        setActiveItem(itemTitle);
        setTitle(itemTitle);
        mudarCaminho(itemCaminhoPasta)
    };

    return (
        <aside className="w-full h-full bg-rotion-800 text-rotion-50 flex flex-col shadow-md relative border border-rotion-700 overflow-hidden">
            <div className="p-6 text-center border-b border-rotion-700">
                <span className="text-2xl font-bold flex items-center gap-3 before:w-1 before:h-4 before:bg-blue-500 before:flex">
                    Dev.OS
                </span>
            </div>


            <nav className="flex-grow mt-4 space-y-2 px-4">
                {menu.map((item) => (
                    <MenuItem
                        key={item.title}
                        label={item.title}
                        isActive={activeItem === item.title}
                        onClick={() => handleItemClick(item.title, item.caminhoPasta)}
                        showFeedback={feedback[item.caminhoPasta]}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;


interface MenuProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    showFeedback?: boolean;
}

const MenuItem = ({
    label,
    isActive,
    onClick,
    showFeedback,
}: MenuProps) => (
    <div
        onClick={onClick}
        className={`sidebar-item 
                        p-3 
                        rounded-md 
                        cursor-pointer 
                        transition-all 
                        ${isActive ? 'is-active bg-rotion-700 text-white' : 'hover:bg-rotion-700 hover:text-rotion-50'}`
        }
    >
        <span className="flex items-center gap-6">
            <p>{label}</p> 

            {showFeedback && (
                <span className="animate-ping">
                    <CheckFat size={16} color="#00f900" weight="fill" />
                </span> 
            )}
        </span>
    </div>
);