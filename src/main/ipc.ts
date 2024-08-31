import { ipcMain } from 'electron';
import { exec } from 'child_process'; 

ipcMain.handle('open-folder', async (_, folderPath) => {
    const command = process.platform === 'win32'
        ? `start "" "${folderPath}"`
        : process.platform === 'darwin'
        ? `open "${folderPath}"`
        : `xdg-open "${folderPath}"`;

    exec(command, (error) => {
        if (error) {
            console.error(`Error opening folder: ${error.message}`);
        }
    });
});