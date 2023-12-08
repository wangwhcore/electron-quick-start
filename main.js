// Modules to control application life and create native browser window
const { Menu, dialog } = require('electron')
const path = require('node:path')
const menuTemplate = require('./src/editor/menuTemplate')
const { app, BrowserWindow, ipcMain } = require('electron/main')
const fs = require('node:fs')
const https = require('node:https')
let mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            
            preload: path.join(__dirname, 'preload.js')

        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

}


const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
const icon = fs.createWriteStream(iconName)

// Create a new file to copy - you can also copy existing files.
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')

https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
    response.pipe(icon)
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    // set up menu
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)


    ipcMain.on('ondragstart', (event, filePath) => {
        event.sender.startDrag({
            file: path.join(__dirname, filePath),
            icon: iconName
        })

        console.log("123")
    })
    ipcMain.on('start-drag', (event, filePath) => {
        console.log("231")
    });
    ipcMain.handle('open-file-dialog', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'TAG Files', extensions: ['tag'] }],
        });

        if (!result.canceled) {
            return result.filePaths[0];
        }

        throw new Error('File selection canceled');
    });

    // 注册读取文件的函数
    ipcMain.handle('read-file', async (event, filePath) => {
        try {
            console.log(909990)
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return fileContent;
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    });
    ipcMain.handle('save-file-dialog', async () => {
        const result = await dialog.showSaveDialog({
            filters: [{ name: 'Text Files', extensions: ['tag'] }],
        });
    
        if (!result.canceled) {
            return { filePath: result.filePath };
        }
    
        throw new Error('File save canceled');
    });
})
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// 监听渲染进程请求打开文件对话框的消息
// 注册打开文件对话框的函数
// 注册打开文件对话框的函数
// 注册打开文件对话框的函数


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
