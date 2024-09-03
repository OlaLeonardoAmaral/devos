

interface ArchiveCardProps {
    title: string;
    date: string;
    key: number;
    onClick: () => void;
    isMoving: boolean;
}


export function ArchiveCard({ key, title, date, onClick, isMoving }: ArchiveCardProps) {
    return (
        <div
            className={`bg-rotion-800 p-4 rounded-lg border border-rotion-600 h-20 w-60 cursor-pointer transition-transform transform ${isMoving ? 'animate-moveCard' : ''} hover:scale-105 hover:shadow-lg`}
            onClick={onClick}
            key={key}>
            <h3 className="text-rotion-50">{title}</h3>
            <p className="text-rotion-400 text-sm">{date}</p>
        </div>
    )
}