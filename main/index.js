"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
// Prepare the renderer once the app is ready
electron_1.app.on('ready', async () => {
    await (0, electron_next_1.default)('./renderer');
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: (0, path_1.join)(__dirname, 'preload.js'),
        },
        useContentSize: true,
    });
    const url = electron_is_dev_1.default ? 'http://localhost:8000/' : (0, url_1.format)({
        pathname: (0, path_1.join)(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
    });
    const view = new electron_1.BrowserView();
    // view.setAutoResize({width: true, height: true});
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 0, y: 40, width: 800, height: 560 });
    view.webContents.loadURL('https://electronjs.org');
    mainWindow.on('resize', () => {
        view.setBounds({ x: 0, y: 40, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 40 });
    });
    mainWindow.loadURL(url);
    // let client;
    electron_1.ipcMain.on('url-change', (_, message) => {
        console.log(message);
        view.webContents.loadURL(message);
        console.log(view.webContents.getURL());
        // client = e.sender;
    });
    view.webContents.on('did-fail-load', (e, code, description) => {
        console.log("fail load");
        console.log(e);
        console.log(code);
        console.log(description);
        // client.send('message', description)
        mainWindow.webContents.send('message', description);
    });
    view.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('url-change', view.webContents.getURL());
    });
    view.webContents.on('update-target-url', () => {
        mainWindow.webContents.send('url-change', view.webContents.getURL());
    });
});
// Quit the app once all windows are closed
electron_1.app.on('window-all-closed', electron_1.app.quit);
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on('message', (event, message) => {
    console.log(message);
    setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
