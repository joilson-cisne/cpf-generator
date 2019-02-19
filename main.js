const {
  app,
  globalShortcut,
  clipboard,
  Menu,
  Tray,
} = require('electron')

const CPF = require('gerador-validador-cpf')
const path = require('path')
const robot = require('robotjs')

let tray

const startApplication = () => {
  setupTrayMenu()

  globalShortcut.register('command+shift+ctrl+c', () => {
    generateAndSaveCpf()
    robot.keyTap('v', 'command')
  })
}

const setupTrayMenu = () => {
  tray = new Tray(path.join(__dirname, './tray-icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Generate CPF (Cmd + Shift + Ctrl + C)',
      type: 'normal',
      click: generateAndSaveCpf
    },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => { app.quit() } },
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('CPF generator')
}

const generateAndSaveCpf = () => {
  const cpf = CPF.generate()
  clipboard.writeText(cpf)
}

app.dock.hide()

app.on('ready', startApplication)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
})
