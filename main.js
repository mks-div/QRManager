const {app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require('path');
const os = require('os');

const downloadsPath = path.join(os.homedir(), 'Downloads');
const documentsPath = path.join(os.homedir(), 'Documents');

app.whenReady().then(() => {
    const myWindow = new BrowserWindow({
        width: 800, 
        height: 600,
        minHeight: 350,
        minWidth: 340,
        autoHideMenuBar: true,
        titleBarStyle: "hidden",

        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });


    myWindow.loadFile("index.html");
    //win.webContents.openDevTools();
})


ipcMain.on('dialog:openFile', () => {
    const win = BrowserWindow.getFocusedWindow()
    dialog.showOpenDialog(win, {
        title: 'Выберите файл',
        defaultPath: documentsPath,
        buttonLabel: 'Выбрать',
        filters: [{
            name: 'Images',
            extensions: ['jpeg', 'png'] 
            },
        ],
        properties: [
            'openFile',
            'multiSelections'
        ],
    }).then((result) => {
        if (!result.canceled) {
            win.webContents.send('file-selected', result.filePaths[0]); // Отправляем путь в рендерер
        }
    }).catch((err) => {});
})

ipcMain.on('dialog:saveFile', () => {
    const win = BrowserWindow.getFocusedWindow();
    dialog.showSaveDialog(win, {
        title: 'Сохранить QR',
        defaultPath: downloadsPath,
        buttonLabel: 'Сохранить как...',
        filters: [
            { name: 'PNG', extensions: ['png'] },
            { name: 'JPEG', extensions: ['jpg', 'jpeg'] },
            { name: 'SVG', extensions: ['svg'] },
        ],
    })
    .then(result => {
        if (!result.canceled) {
          win.webContents.send('save-path-selected', result.filePath);
        }
    })
    .catch(err => { });
})

ipcMain.on('dialog:ERR', (event, data) => { dialog.showErrorBox("Error", data) })
    
        
        
    


// Title Bar block
ipcMain.on('minimize-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.minimize();
    }
});

ipcMain.on('maximize-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();

    win.webContents.send('maximized');
});

ipcMain.on('close-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.close();
    }
});