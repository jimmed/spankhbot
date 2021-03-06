const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', () => app.quit());

app.on('ready', createWindow);

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1360, height: 800 });
  mainWindow.loadURL(
    'file://' + path.resolve(__dirname, '../public/index.html')
  );
  mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
