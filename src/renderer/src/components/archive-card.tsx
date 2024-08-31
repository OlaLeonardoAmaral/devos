

interface ArchiveCardProps {
    title: string;
    date: string;
    key: number;
}


export function ArchiveCard({ key, title, date }: ArchiveCardProps) {
    return (
        <div
            className="bg-rotion-800 p-4 rounded-lg border border-rotion-600 h-20 w-60 cursor-pointer hover:bg-rotion-700 transition transform hover:scale-105 hover:shadow-lg"
            onClick={() => console.log('oiiii')}
            key={key}>
            <h3 className="text-rotion-50">{title}</h3>
            <p className="text-rotion-400 text-sm">{date}</p>
        </div>
    )
}