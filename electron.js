const { app, BrowserWindow, BrowserView } = require('electron');
let win;
const url = `file://${__dirname}/myapp/dist/index.html`;
function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 600,
        backgroundColor: '#ffffff'
        // icon: `file://${__dirname}/myapp/dist/assets/cic.png`
    });
    win.loadURL(url);


    //uncomment this line to open the dev tool
    // win.webContents.openDevTools();

    win.on('closed', function () {
        win = null;
    });

}

function createBrowser() {
    win = new BrowserWindow({ width: 800, height: 600 })
    win.on('closed', () => {
        win = null
    })
    let view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    })
    win.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: 800, height: 600 });
    view.webContents.loadURL(url)
}



//create app on electron initialization
app.on('ready', createWindow);
app.on('window.-all-closed', function () {
    //mac specific
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
})