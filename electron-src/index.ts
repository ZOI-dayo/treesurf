// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, BrowserView, app, ipcMain, IpcMainEvent} from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
    useContentSize: true,
  })

  const url = isDev ? 'http://localhost:8000/' : format({
    pathname: join(__dirname, '../renderer/out/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const view = new BrowserView();
  // view.setAutoResize({width: true, height: true});
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 40, width: 800, height: 560 })
  view.webContents.loadURL('https://electronjs.org')
  mainWindow.on('resize', () => {
    view.setBounds({ x: 0, y: 40, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 40 })
  })

  mainWindow.loadURL(url)

  // let client;
  ipcMain.on('url-change', (_: IpcMainEvent, message: any) => {
    console.log(message)
    view.webContents.loadURL(message);
    console.log(view.webContents.getURL());
    // client = e.sender;
  })
  view.webContents.on('did-fail-load', (e, code, description) => {
    console.log("fail load");
    console.log(e);
    console.log(code);
    console.log(description);
    // client.send('message', description)
    mainWindow.webContents.send('message', description)
  })
  view.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('url-change', view.webContents.getURL())
  })
  view.webContents.on('update-target-url', () => {
    mainWindow.webContents.send('url-change', view.webContents.getURL())
  })
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})


