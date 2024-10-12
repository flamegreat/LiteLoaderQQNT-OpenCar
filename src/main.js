// 运行在 Electron 主进程 下的插件入口
const { app, ipcMain, dialog, shell } = require("electron");
const fs = require('fs');

// 创建窗口时触发
module.exports.onBrowserWindowCreated = window => {
    // window 为 Electron 的 BrowserWindow 实例

    console.log("Flames");

}

// 打开文件
ipcMain.on('read-file-request', async (event, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            event.reply('read-file-reply', error);
        } else {
            event.reply('read-file-reply', data);
        }
    });
});

// 获取下载路径
ipcMain.on('get-download-path', (event) => {
    // 获取下载路径
    const downloadPath = app.getPath('downloads');

    // 返回下载路径
    event.reply('get-download-path-reply', downloadPath);
});

// 打开浏览器
ipcMain.on('open-browser', (event, url) => {
    shell.openExternal(url);
});