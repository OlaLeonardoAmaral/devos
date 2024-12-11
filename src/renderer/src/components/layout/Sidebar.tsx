import React, { useState } from 'react';


interface SidebarProps {
    setTitle: (title: string) => void
    setCaminhoPasta: (title: string) => void
}


const Sidebar = ({ setTitle, setCaminhoPasta }: SidebarProps) => {
    const [activeItem, setActiveItem] = useState<string>('Home'); // Estado do item ativo


    const servidorProg = 'U:\\Fontes'

    const menuItems = [
        { title: 'Home', caminhoPasta: 'C:\\Fontes' },
        { title: 'A Fazer', caminhoPasta: `${servidorProg}\\A Fazer` },
        { title: 'Atualizar', caminhoPasta: `${servidorProg}\\Atualizar` },
        { title: 'Em Andamento', caminhoPasta: `${servidorProg}\\Em Andamento` },
        { title: 'Sem Modificações', caminhoPasta: `${servidorProg}\\Sem Modificações` },
        { title: 'Consulta', caminhoPasta: `${servidorProg}\\Somente Consulta` },
    ];

    const handleItemClick = (itemTitle: string, itemCaminhoPasta: string) => {
        setActiveItem(itemTitle);

        setTitle(itemTitle);
        setCaminhoPasta(itemCaminhoPasta);
    };

    return (
        <aside className="w-full h-full bg-rotion-800 text-rotion-50 flex flex-col shadow-md relative border border-rotion-700 overflow-hidden">
            {/* Logo */}

            <div className="p-6 text-center border-b border-rotion-700">
                <span className="text-2xl font-bold flex items-center gap-3 before:w-1 before:h-4 before:bg-blue-500 before:flex">
                    Dev.OS
                </span>
            </div>



            {/* Menu Items */}
            <nav className="flex-grow mt-4 space-y-2 px-4">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.title}
                        label={item.title}
                        isActive={activeItem === item.title}
                        onClick={() => handleItemClick(item.title, item.caminhoPasta)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;

const MenuItem = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}) => (
    <div
        onClick={onClick}
        className={`sidebar-item p-3 rounded-md cursor-pointer transition-all ${isActive ? 'is-active bg-rotion-700 text-white' : 'hover:bg-rotion-700 hover:text-rotion-50'
            }`}
    >
        <span>{label}</span>
    </div>
);