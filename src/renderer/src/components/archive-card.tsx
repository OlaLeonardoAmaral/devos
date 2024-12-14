
interface ArchiveCardProps {
    title: string;
    date: string;
    id: number;
    onClick: () => void;
    isMoving: boolean;
}


export function ArchiveCard({ id, title, date, onClick, isMoving }: ArchiveCardProps) {

    return (
        <div
            className={`relative transition-transform transform`}
            onClick={onClick}
            key={id}
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
                    relative ${isMoving ? 'animate-moveCard' : ''} 
                    hover:scale-105 
                    hover:shadow-lg 
                    hover:z-10`}
                onClick={onClick}
            >
                <h3 className="text-rotion-50 text-lg">{title}</h3>
                <p className="text-rotion-400 text-sm">{date}</p>
            </div>
        </div>
    )
}