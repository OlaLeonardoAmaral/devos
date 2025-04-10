import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { join } from 'path';
import { readdir, copyFile, unlink, stat, readFile, writeFile } from 'fs/promises';
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


async function logToJson(type: 'moved' | 'error', fileName: string, fromPath?: string, toPath?: string, errorMessage?: string) {
    const logFilePath = join(os.homedir(), 'meu-sistema-logs.json');
    const logEntry = {
        timestamp: new Date().toISOString(),
        type,
        file: fileName,
        ...(fromPath && { from_path: fromPath }),
        ...(toPath && { to_path: toPath }),
        ...(errorMessage && { error_message: errorMessage }),
    };

    try {
        // Tenta ler o arquivo existente
        let existingLogs: any[] = [];
        try {
            const fileContent = await readFile(logFilePath, 'utf-8');
            existingLogs = JSON.parse(fileContent);
        } catch (err) {
            // Se o arquivo não existir ou estiver vazio, começa com array vazio
            existingLogs = [];
        }

        // Adiciona o novo log
        existingLogs.push(logEntry);

        // Ordena do mais recente para o mais antigo
        existingLogs.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Escreve de volta no arquivo
        await writeFile(logFilePath, JSON.stringify(existingLogs, null, 2), 'utf-8');
    } catch (err) {
        console.error('Erro ao gravar log em JSON:', err);
    }
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

        return zipFiles;
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

        await logToJson('moved', fileName, sourceFolderPath, destinationFolderPath);
        return { success: true };
    } catch (error) {
        await logToJson('error', fileName, undefined, undefined, String(error));
        return { success: false, error: error };
    }
});



ipcMain.handle("read-logs", async () => {
    try {
        const logFilePath = join(os.homedir(), 'meu-sistema-logs.json');
        const fileContent = await readFile(logFilePath, 'utf-8');
        return JSON.parse(fileContent); // Retorna o conteúdo do JSON como objeto
    } catch (error) {
        console.error('Erro ao ler logs:', error);
        return []; // Retorna array vazio em caso de erro
    }

});



