import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { join } from 'path';
import { readdir, rename, stat } from 'fs/promises';
import dayjs from 'dayjs';

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


interface ZipFile {
    name: string;
    size: number; // Tamanho em bytes
    createdAt: string; // Data de criação
    modifiedAt: string; // Data da última modificação
}

ipcMain.handle('get-zip-files', async (_, folderPath: string): Promise<ZipFile[]> => {
    try {
        const files = await readdir(folderPath);
        const zipFiles: ZipFile[] = [];

        for (const file of files) {
            if (file.endsWith('.zip')) {
                const filePath = join(folderPath, file);
                const fileStats = await stat(filePath);

                zipFiles.push({
                    name: file,
                    size: fileStats.size,
                    createdAt: dayjs(fileStats.birthtime).format('DD/MM/YYYY - HH:mm'),
                    modifiedAt: dayjs(fileStats.ctime).format('DD/MM/YYYY - HH:mm'),
                });
            }
        }

        return zipFiles;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
});


ipcMain.handle('move-files', async (_, sourceFolderPath: string, destinationFolderPath: string) => {
    try {
        const files = await readdir(sourceFolderPath);
        const zipFiles = files.filter(file => file.endsWith('.zip'));

        for (const file of zipFiles) {
            const sourcePath = join(sourceFolderPath, file);
            const destinationPath = join(destinationFolderPath, file);
            await rename(sourcePath, destinationPath);
        }

        return { success: true };
    } catch (error) {
        console.error('Error moving files:', error);
        return { success: false, error: error };
    }
});


// Handler para mover um único arquivo de uma pasta para outra
ipcMain.handle('move-unique-file', async (_, sourceFolderPath: string, destinationFolderPath: string, fileName: string) => {
    try {
        const sourcePath = join(sourceFolderPath, fileName);
        const destinationPath = join(destinationFolderPath, fileName);
        await rename(sourcePath, destinationPath); // Move o arquivo especificado

        return { success: true };
    } catch (error) {
        console.error('Error moving file:', error);
        return { success: false, error: error };
    }
});