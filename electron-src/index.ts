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
  })

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  
      const view = new BrowserView()

  mainWindow.setBrowserView(view)
  view.setBounds({ x: 0, y: 40, width: 800, height: 500 })
  view.webContents.loadURL('https://electronjs.org')

  mainWindow.loadURL(url)

  // let client;
  ipcMain.on('urlChange', (_: IpcMainEvent, message: any) => {
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
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})


