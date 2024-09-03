import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

interface ZipFile {
  name: string;
  size: number; // Tamanho em bytes
  createdAt: string; // Data de criação
  modifiedAt: string; // Data da última modificação
}

const api = {
  openFolder(folderPath: string) {
    return ipcRenderer.invoke('open-folder', folderPath)
  },

  getZipFiles(folderPath: string): Promise<ZipFile[]> {
    return ipcRenderer.invoke('get-zip-files', folderPath);
  },

  moveFiles(sourceFolderPath: string, destinationFolderPath: string): Promise<{ success: boolean, error?: string }> {
    return ipcRenderer.invoke('move-files', sourceFolderPath, destinationFolderPath);
  },

  moveUniqueFiles(sourceFolderPath: string, destinationFolderPath: string, fileName: string): Promise<{ success: boolean, error?: string }> {
    return ipcRenderer.invoke('move-unique-file', sourceFolderPath, destinationFolderPath, fileName);
  }

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
