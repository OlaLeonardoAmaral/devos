import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { join } from 'path';
import { readdir, copyFile, unlink, stat } from 'fs/promises';
import dayjs from 'dayjs';
import * as fs from 'fs';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';


interface ZipFile {
    id: string;
    name: string;
    size: number;
    createdAt: string;
    modifiedAt: string;
}


function logToFile(message: string) {
    const logFilePath = join(os.homedir(), 'meu-sistema-logs.txt');
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Erro ao gravar no log:', err);
    });
}


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


ipcMain.handle('get-zip-files', async (_, folderPath: string): Promise<ZipFile[]> => {
    try {
        const files = await readdir(folderPath);
        const zipFiles: ZipFile[] = [];

        for (const file of files) {
            if (file.endsWith('.zip')) {
                const filePath = join(folderPath, file);
                const fileStats = await stat(filePath);

                zipFiles.push({
                    id: uuidv4(),
                    name: file,
                    size: fileStats.size,
                    createdAt: dayjs(fileStats.birthtime).format('DD/MM/YYYY - HH:mm'),
                    modifiedAt: dayjs(fileStats.ctime).format('DD/MM/YYYY - HH:mm'),
                });

            }
        }


        zipFiles.sort((a, b) => {
            const dateA = dayjs(a.modifiedAt, 'DD/MM/YYYY - HH:mm').toDate();
            const dateB = dayjs(b.modifiedAt, 'DD/MM/YYYY - HH:mm').toDate();
            return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
        });

        return zipFiles; // eu quero que seja retornado em ordem de modifiedAt (do mais atualizado para o mais antigo)
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
});



ipcMain.handle('move-unique-file', async (_, sourceFolderPath: string, destinationFolderPath: string, fileName: string) => {
    try {
        const sourcePath = join(sourceFolderPath, fileName);
        const destinationPath = join(destinationFolderPath, fileName);

        await copyFile(sourcePath, destinationPath);
        await unlink(sourcePath);

        logToFile(`Moved file ${fileName} from ${sourceFolderPath} to ${destinationFolderPath}`);
        return { success: true };
    } catch (error) {
        logToFile(`Error moving file ${fileName}: ${error}`);
        return { success: false, error: error };
    }
});