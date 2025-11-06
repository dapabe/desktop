import { Menu, Tray } from "electron/main";
import icon from '../../resources/icon.png?asset'


export function createTrayMenu(): [Tray, Electron.Menu] {
    const appIcon = new Tray(icon)

    const ctxMenu = Menu.buildFromTemplate([
        {
            role: "quit"
        }
    ])

    appIcon.setContextMenu(ctxMenu)
    
    return [appIcon, ctxMenu]
}