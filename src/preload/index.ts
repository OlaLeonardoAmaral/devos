import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

const api = {
  openFolder(folderPath: string) {
    return ipcRenderer.invoke('open-folder', folderPath)
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
