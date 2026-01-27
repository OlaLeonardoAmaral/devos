import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { ArchiveCard } from "../archive-card";
import { useArquivos } from "../../contexts/ListArquivoContext";
import Blank from "./Blank";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";
import { pastas } from "../../config/pathResolver";
import { ZipFile } from "../../types"; // Assuming ZipFile type is moved or available here
import LogsPage from "./LogsPage";
import StandardizationScreen, { StandardizationData } from "../standardization/StandardizationScreen";
import path from 'path'; // Import path for joining paths

const MainLayout = () => {
  const [title, setTitle] = useState<string>("Home");
  const { caminhoAtual, arquivos, atualizarArquivos } = useArquivos();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMoving, setIsMoving] = useState<{ [key: string]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: boolean }>({});
  const [isDragging, setIsDragging] = useState(false);
  
  // State for Standardization Screen
  const [showStandardizationScreen, setShowStandardizationScreen] = useState(false);
  const [fileToStandardize, setFileToStandardize] = useState<ZipFile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const handleUpdate = () => {
    setIsUpdating(true);
    atualizarArquivos();

    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  const displayToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenFolder = (folderPath: string) => {
    window.api.openFolder(folderPath);
  };

  const handleMoveFile = async (
    nomeArquivo: string,
    pastaAtual: string,
    pastaDestino: string
  ) => {
    setIsMoving((prevState) => ({ ...prevState, [nomeArquivo]: true }));
    pastaDestino =
      pastaDestino === pastas.home ? pastas.semModificacoes : pastas.home;

    const result = await window.api.moveUniqueFiles(
      pastaAtual,
      pastaDestino,
      nomeArquivo
    );

    if (result.success) {
      setIsMoving((prevState) => ({ ...prevState, [nomeArquivo]: false }));
      atualizarArquivos();

      setFeedback((prevState) => ({ ...prevState, [pastaDestino]: true }));
      setTimeout(() => {
        setFeedback((prevState) => ({ ...prevState, [pastaDestino]: false }));
      }, 1000);
    } else {
      result.error;
    }
  };

  const handleExtractFile = async (file: ZipFile) => {
    if (!caminhoAtual) {
      displayToast("Erro: Caminho da pasta atual não definido.");
      return;
    }
    const fullZipPath = path.join(caminhoAtual, file.name);
    // Extract to a folder named like the zip file (without .zip) + "_extracted"
    const outputDirName = file.name.replace(/\.zip$/, "") + "_extracted";
    
    displayToast(`Extraindo ${file.name}...`);
    try {
      const result = await window.api.extractZipFile(fullZipPath, outputDirName, "sil2001");
      if (result.success) {
        displayToast(result.message || `Arquivo ${file.name} extraído com sucesso! ✅`);
        // Optionally, refresh files or notify user
      } else {
        displayToast(`Erro ao extrair ${file.name}: ${result.error} ❌`);
      }
    } catch (error) {
      displayToast(`Erro inesperado ao extrair ${file.name}. ❌`);
      console.error("Extraction API call error:", error);
    }
  };

  const handleShowStandardization = (file: ZipFile) => {
    setFileToStandardize(file);
    setShowStandardizationScreen(true);
  };

  const handleStandardizationSubmit = (file: ZipFile, data: StandardizationData) => {
    console.log("Padronizar arquivo:", file.name);
    console.log("Dados da padronização:", data);
    setShowStandardizationScreen(false);
    setFileToStandardize(null);
    displayToast(`Projeto ${file.name} padronizado! ✅`);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;

    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "zip") {
        const directoryPath = file.path.substring(
          0,
          file.path.lastIndexOf("/")
        );

        const result = await window.api.moveUniqueFiles(
          directoryPath,
          pastas.atualizar,
          file.name
        );

        if (result.success) {
          atualizarArquivos();

          setFeedback((prevState) => ({
            ...prevState,
            [pastas.atualizar]: true,
          }));
          setTimeout(() => {
            setFeedback((prevState) => ({
              ...prevState,
              [pastas.atualizar]: false,
            }));
          }, 1000);
        } else {
          window.alert("Erro ao mover o arquivo: " + result.error);
        }
      } else {
        window.alert("Apenas arquivos .zip são suportados.");
      }
    }
  };

  if (showStandardizationScreen && fileToStandardize) {
    return (
      <StandardizationScreen
        file={fileToStandardize}
        onBack={() => { setShowStandardizationScreen(false); setFileToStandardize(null); }}
        onSubmit={handleStandardizationSubmit}
      />
    );
  }


  return (
    <div
      className="grid h-screen bg-rotion-900 text-rotion-50 font-sans"
      style={{
        gridTemplateColumns: "16rem auto",
        gridTemplateRows: "auto",
      }}
    >
      <Sidebar setTitle={setTitle} feedback={feedback} />
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-gray-700 text-white p-4 rounded-lg shadow-lg z-[100] animate-fadeInOut">
          {toastMessage}
        </div>
      )}


      {title === "Logs" ? (
        <LogsPage />
      ) : (
        <main
          className={`flex-grow bg-rotion-800 text-rotion-50 p-8 shadow-green-light animate-moveCard 
                    ${isDragging ? "bg-rotion-700 border-2 border-dashed border-rotion-400" : ""}`}
          onDragOver={(event) => {
            if (title === "Atualizar") {
              handleDragOver(event);
            }
          }}
          onDrop={(event) => {
            if (title === "Atualizar") {
              handleDrop(event);
            }
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <header className="flex flex-col gap-3 colum text-rotion-50 p-2">
            <div className="flex items-center gap-4 w-full">
              <h1 className="text-4xl font-bold flex-grow truncate">{title}</h1>
              <button
                onClick={handleUpdate}
                className="flex items-center justify-center p-2 rounded hover:bg-rotion-700"
                aria-label="Recarregar"
              >
                <ArrowsCounterClockwise
                  size={32}
                  className={`text-rotion-50 ${isUpdating ? "icon-spin" : ""}`}
                />
              </button>
            </div>

            <a
              href="#"
              onClick={() => handleOpenFolder(caminhoAtual)}
              className="text-rotion-400 text-lg"
            >
              {caminhoAtual}
            </a>
          </header>

          <div
            className={`
                        flex 
                        flex-wrap 
                        gap-y-5 
                        gap-x-8
                        max-h-[calc(100vh-160px)] 
                        relative 
                        p-4
                        overflow-auto
                        ${arquivos.length === 0 ? "flex items-center justify-center min-h-[calc(100vh-180px)]" : ""}`}
          >
            {arquivos.length > 0 ? (
              arquivos.map((file) => (
                <ArchiveCard
                  key={file.id}
                  file={file}
                  onClick={() =>
                    handleMoveFile(file.name, caminhoAtual, caminhoAtual)
                  }
                  isMoving={isMoving[file.name] || false}
                  showActionsMenu={title === "Home"} // Only show menu in "Home"
                  onExtractRequest={handleExtractFile}
                  onStandardizeRequest={handleShowStandardization}
                />
              ))
            ) : (
              <Blank 
                message={
                  title === "Atualizar" 
                    ? "Arraste arquivos .zip para cá ou atualize a pasta." 
                    : "Nenhum arquivo encontrado."
                } 
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
};
export default MainLayout;
