import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'

import { createMainWindow } from './main-window'
import { AppEventBus } from './services/EventBus'
import { Tray } from 'electron/main'
import { createTrayMenu } from './tray-menu'
import { IPCHandler } from './trpc/root.router'

// process.on('uncaughtException', (listener) => {
//   console.log('Exception: ', JSON.stringify(listener, null, 2))
//   dialog.showErrorBox(listener.name, listener.message)
//   app.quit()
//   process.exit(1)
// })
// process.once('unhandledRejection', (listener) => {
//   console.log('Rejected: ', JSON.stringify(listener, null, 2))
//   app.quit()
//   process.exit(1)
// })

let mainWindow: BrowserWindow
let trayMenu: Tray
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  app.setName('Attention Please')
  // Set app user model id for windows
  electronApp.setAppUserModelId(app.name)

  const [tray, contextMenu] = createTrayMenu()
  trayMenu = tray
  trayMenu.setToolTip(app.name)
  trayMenu.on('click', async () => {
    if (mainWindow) mainWindow.focus()
    else mainWindow = await createMainWindow()
  })
  // macOS' dock
  app.dock?.setMenu(contextMenu)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow()
    }
  })

  mainWindow = await createMainWindow()
})

app.on('will-quit', () => {
  AppEventBus.cleanupAll()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
    mainWindow = undefined!
  }
  IPCHandler.detachWindow(mainWindow)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
