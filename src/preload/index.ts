import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'
import { ZipFile } from '../renderer/src/types'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}



const api = {

// vai abrir a pasta quando o usuario clicar no caminho (debaixo do titulo na UI)
  openFolder(folderPath: string) {
    return ipcRenderer.invoke('open-folder', folderPath)
  },

  // vai retornar todos os arquivos zip dentro de uma determinada pasta
  getZipFiles(folderPath: string): Promise<ZipFile[]> {
    return ipcRenderer.invoke('get-zip-files', folderPath);
  },

  // moveFiles(sourceFolderPath: string, destinationFolderPath: string): Promise<{ success: boolean, error?: string }> {
  //   return ipcRenderer.invoke('move-files', sourceFolderPath, destinationFolderPath);
  // },

  // quando o usuario clicar no card do arquivo, o arquivo vai ser movido de um lugar para o outro
  moveUniqueFiles(sourceFolderPath: string, destinationFolderPath: string, fileName: string): Promise<{ success: boolean, error?: string }> {
    return ipcRenderer.invoke('move-unique-file', sourceFolderPath, destinationFolderPath, fileName);
  },

  // vai ler o arquivo de log
  readLogs(): Promise<string> {
    return ipcRenderer.invoke('read-logs');
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
