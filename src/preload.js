// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require('electron');

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("xq", {
    readFileStream: (filePath) => {
        return new Promise((resolve, reject) => {

            console.log('渲染进程', filePath);

            ipcRenderer.send('read-file-stream', filePath);

            ipcRenderer.once('file-stream-data', (event, data) => {

                console.log('渲染进程', data);

                resolve(data);
            });

            ipcRenderer.once('file-stream-end', () => {
                // Do something on end of stream
            });

            ipcRenderer.once('file-stream-error', (event, error) => {
                reject(error);
            });
        });
    },
    readFile: (filePath) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('read-file-request', filePath);
            ipcRenderer.on('read-file-reply', (event, data) => {
                if (data instanceof Error) {
                    reject(data);
                } else {
                    resolve(data);
                }
            });
        });
    }
});
