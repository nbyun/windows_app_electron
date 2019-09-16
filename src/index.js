const {app, BrowserWindow, dialog, Menu, Tray, ipcMain} = require('electron')

const exec = require('child_process').exec;
const path = require('path');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
//if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
//  app.quit();
//}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let cmdStr = "for /r c:/ %i in (*qq.exe*) do @echo %i";
let workerProcess;

function runExec() {

  workerProcess = exec(cmdStr, {});
  //console.log(workerProcess)
  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    //if (data == null || data == undefined){
    //  console.log('11111111111111111')
    //  dialog.showErrorBox('Error','未安装QQ');
    //}else{
    let openCmd = 'start "dummyclient" "' + data.replace(/\\/g, "/") + '"'
    console.log(openCmd)
    exec(openCmd)
    //}
  });
  //workerProcess.stderr.on('data', function (data) {
  //  console.log('stderr: ' + data);
  //});
        // 退出之后的输出
  //workerProcess.on('close', function (code) {
  //  console.log(arr);
  //  console.log('out code：' + code);
  //});
}
let tray = null
const createWindow = () => {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    minimizable: true, //可否最小化
    maximizable: true, //可否最大化
    width: 800,
    height: 600,
  });

  var trayMenuTemplate = [
    //{
    //  label: '开始',
    //  click: function () {} //打开相应页面
    //},
    //{
    //  label: '暂停',
    //  click: function () {
    //    mainWindow.webContents.send('main-process-messages', 'stop');
    //  }
    //},
    {
      label: '退出',
      click: function () {      
        mainWindow.destroy();
      }
    }
  ];

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  //runExec();
  // Emitted when the window is closed.
  mainWindow.on('closed', (event) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });

  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  });

  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  });

  var tray = new Tray(path.join(__dirname, 'app.ico'));

  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此图标的上下文菜单
  tray.setContextMenu(contextMenu);

  tray.on('click', ()=> {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  Menu.setApplicationMenu(null) // 设置菜单部分
  createWindow()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
