// 运行在 Electron 主进程 下的插件入口
const { app, ipcMain, dialog } = require("electron");
const fs = require('fs');

// 创建窗口时触发
module.exports.onBrowserWindowCreated = window => {
    // window 为 Electron 的 BrowserWindow 实例

    console.log("Flames");

}


ipcMain.on('read-file-request', async (event, filePath) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            event.reply('read-file-reply', error);
        } else {
            event.reply('read-file-reply', data);
        }
    });
});