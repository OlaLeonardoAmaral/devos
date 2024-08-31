import { ArchiveCard } from './components/archive-card';
import './styles/global.css';

export default function App() {
  // const isMacOS = process.platform === 'darwin'

  const afazeres = [
    {
      title: 'psantaisabel.zip',
      date: '22/04/2024 - 13h45',
    },
    {
      title: 'n2sroque_d7.zip',
      date: '22/04/2024 - 13h45',
    },
    {
      title: 'lsuzano.zip',
      date: '22/04/2024 - 13h45',
    },
  ]

  const myfonts = [
    {
      title: 'r1sandre_d7.zip',
      date: '23/04/2024 - 13h45',
    },
  ]

  const atualizar = true;

  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100">
      <nav className="flex items-center justify-between p-4 px-8 bg-transparent border-b border-rotion-700">

        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold flex items-center gap-3 before:w-1 before:h-4 before:bg-blue-500 before:flex">Dev.OS</span>
        </div>

        {atualizar && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => console.log('oiii')}
              className="underline-effect text-rotion-100 focus:outline-none"
            >
              Atualizar
            </button>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-green-light"></span>
          </div>
        )}

      </nav>


      <div className="p-4 px-8 pt-10 space-y-20">
        {/* Section 1 */}
        <section>
          <header className="flex gap-4 items-center text-rotion-100 mb-4">
            <h2 className="text-xl font-semibold">Meus Fonts:</h2>
            <a
            onClick={() => {
              window.api.openFolder('//Users//leonardoamaral//Documents//projetos')
            }}
              href='#'
              className="text-rotion-400">C:\Fontes\</a>{/*  // quero que seu estilo continue o mesmo mas quero que ele seja um "link", esse span diz o caminho de uma pasta que o usuario tem na maquina dele, quando ele clicar ele deve ser direcionado para a pasta  */}
          </header>
          <div className="flex flex-wrap gap-4">
            {myfonts.map((archive, index) => <ArchiveCard key={index} title={archive.title} date={archive.date} />)}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <header className="flex gap-4 items-center text-rotion-100 mb-4">
            <h2 className="text-xl font-semibold">A fazer:</h2>
            <a href='#' className="text-rotion-400">U:\Fontes\A Fazer\</a>
          </header>
          <div className="flex flex-wrap gap-4">
            {/* Example Cards */}
            {afazeres.map((archive, index) => <ArchiveCard key={index} title={archive.title} date={archive.date} />)}
          </div>
        </section>
      </div>

    </div>
  )
}
