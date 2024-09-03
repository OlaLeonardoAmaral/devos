import { useState } from 'react';
import { ArchiveCard } from './components/archive-card';
import './styles/global.css';
import { useQuery } from '@tanstack/react-query';


export default function App() {
  // const isMacOS = process.platform === 'darwin'
  const [updateFiles, setUpdateFiles] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<{ [key: string]: boolean }>({});

  // const sourceFolderMyFiles = '//Users//leonardoamaral//Documents//devosteste//C//fontes';
  // const sourceFolderAFazer  = '//Users//leonardoamaral//Documents//devosteste//U//fontes//afazer';
  
  
  // const folderUpdateMy = '//Users//leonardoamaral//Documents//devosteste//C//fontes//atualizar';
  // const folderUpdateHe = '//Users//leonardoamaral//Documents//devosteste//U//fontes//atualizar';

  const sourceFolderMyFiles = 'C:\\Fontes';
  const sourceFolderAFazer  = 'U:\\Fontes\\a fazer';
  
  const folderUpdateMy = 'C:\\Fontes\\atualizar';
  const folderUpdateHe = 'U:\\Fontes\\atualizar';

  const getMyFiles = async () => {
    const myFiles = await window.api.getZipFiles(sourceFolderMyFiles);
    const afazerFiles = await window.api.getZipFiles(sourceFolderAFazer);


    const filesUpdate = await window.api.getZipFiles(folderUpdateMy);

    setUpdateFiles(false)
    if (filesUpdate && filesUpdate.length > 0) {
      setUpdateFiles(true)
    }

    //console.log(files);
    return { myFiles, afazerFiles };
  }

  const { data, refetch } = useQuery(
    {
      queryKey: ['files'],
      queryFn: getMyFiles,
    }
  )

  const atualizar = updateFiles;

  const moverAtualiza = async (sourceFolderPath: string, destinationFolderPath: string) => {
    try {
      const result = await window.api.moveFiles(
        sourceFolderPath,
        destinationFolderPath
      );

      if (result.success) {
        console.log('Arquivos movidos com sucesso!');
        setUpdateFiles(false)
        // Atualize a lista de arquivos após mover
        // Você pode chamar getMyFiles novamente aqui
      } else {
        console.error('Erro ao mover arquivos:', result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar arquivos:', error);
    }
  };

  // Função para mover o arquivo ao clicar
  const handleFileMove = async (fileName: string, currentFolder: string, targetFolder: string) => {
    setIsMoving(prevState => ({ ...prevState, [fileName]: true })); // Ativa a animação para o card específico
    try {
      const result = await window.api.moveUniqueFiles(
        currentFolder,
        targetFolder,
        fileName
      );

      if (result.success) {
        console.log('Arquivo movido com sucesso!');
        refetch(); // Atualiza a lista de arquivos após mover
      } else {
        console.error('Erro ao mover arquivo:', result.error);
      }
    } catch (error) {
      console.error('Erro ao mover arquivo:', error);
    } finally {
      setTimeout(() => {
        setIsMoving(prevState => ({ ...prevState, [fileName]: false })); // Reseta a animação após a transição
      }, 300);
    }
  };

  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100">
      <nav className="flex items-center justify-between p-4 px-8 bg-transparent border-b border-rotion-700">

        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold flex items-center gap-3 before:w-1 before:h-4 before:bg-blue-500 before:flex">
            Dev.OS
          </span>
        </div>

        {atualizar && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => moverAtualiza(
                folderUpdateMy,
                folderUpdateHe
              )}
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
                window.api.openFolder(sourceFolderMyFiles)
              }}
              href='#'
              className="text-rotion-400">C:\Fontes\</a>
          </header>
          <div className="flex flex-wrap gap-4">
            {data?.myFiles?.map((archive, index) =>
              <ArchiveCard
                key={index}
                title={archive.name}
                date={archive.modifiedAt}
                onClick={() => handleFileMove(archive.name, sourceFolderMyFiles, sourceFolderAFazer)}
                isMoving={isMoving[archive.name] || false}
              />
            )}
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <header className="flex gap-4 items-center text-rotion-100 mb-4">
            <h2 className="text-xl font-semibold">A fazer:</h2>
            <a
              onClick={() => {
                window.api.openFolder(sourceFolderAFazer)
              }}
              href='#'
              className="text-rotion-400"
            >U:\Fontes\A Fazer\</a>
          </header>
          <div className="flex flex-wrap gap-4">
            {/* Example Cards */}
            {data?.afazerFiles.map((archive, index) =>
              <ArchiveCard
                key={index}
                title={archive.name}
                date={archive.modifiedAt}
                onClick={() => handleFileMove(archive.name, sourceFolderAFazer, sourceFolderMyFiles)}
                isMoving={isMoving[archive.name] || false}
              />
            )}
          </div>
        </section>
      </div>
    </div>

  )
}
