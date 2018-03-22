const {app, BrowserWindow} = require('electron');
const {autoUpdater} = require("electron-updater");
const {ipcMain} = require('electron')
const path = require('path');
const url = require('url');

let win;

function createWindow() {


    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
};


app.on('ready', function() {
    createWindow();
    //autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify()
});

autoUpdater.on('update-downloaded', (info) => {
        win.webContents.send('updateReady')
});

ipcMain.on("quitAndInstall", (event, arg) => {
        autoUpdater.quitAndInstall();
})

app.on('window-all-closed', () => {
    app.quit();
});


