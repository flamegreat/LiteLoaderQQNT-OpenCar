// 运行在 Electron 渲染进程 下的页面脚本

// 打开设置界面时触发
export const onSettingWindowCreated = view => {
    // view 为 Element 对象，修改将同步到插件设置界面
    console.log("view 为 Element 对象，修改将同步到插件设置界面");
}

onLoad();

async function onLoad() {
    setInterval(() => {
        OpenCar();
    }, 500);
}

async function OpenCar() {

    var elements = document.querySelector(".chat-msg-area__vlist")?.querySelectorAll(".ml-item");

    elements.forEach(element => {
        const FileEl = element.querySelector(".file-element");

        if (FileEl) {
            const filename = FileEl?.title;
            const isdown = FileEl.querySelector(".file-info")?.textContent?.includes("已下载");
            const button = document.getElementById("opencar");
            if (isdown && !button) {
                const button = document.createElement('button');
                button.id = "opencar";
                button.textContent = 'OpenCar';
                button.addEventListener('click', async function (event) {
                    // 阻止事件冒泡
                    event.stopPropagation();

                    const video = document.getElementById("opencarvideo");

                    if (video) {
                        video.remove();
                        button.textContent = 'OpenCar';
                    }
                    else {
                        const filepath = 'C:/Users/Administrator/Downloads/' + filename;
                        console.log('文件路径：', filepath);

                        button.textContent = 'loading...';
                        window.xq.readFile(filepath)
                            .then(data => {
                                console.log(data);

                                const uint8Array = new Uint8Array(data);
                                const reversedArray = uint8Array.reverse();
                                const blob = new Blob([reversedArray], { type: 'application/octet-stream' });
                                const url = URL.createObjectURL(blob);

                                // 创建 video 元素
                                const video = document.createElement('video');
                                FileEl.appendChild(video);

                                video.controls = true; // 显示播放控件
                                video.id = "opencarvideo";
                                video.width = FileEl.offsetWidth; // 设置视频宽度
                                // video.height = 240; // 设置视频高度

                                // // 设置视频源
                                // const source = document.createElement('source');
                                // source.src = url; // 替换为你的视频文件路径
                                // source.type = 'video/mp4'; // 视频格式
                                // video.appendChild(source);
                                video.src = url;
                                // 将 video 元素添加到指定的容器

                                video.onerror = function (event) {
                                    console.log(event, "播放报错啦");
                                };
                                // 播放视频
                                video.play();

                                button.textContent = 'Close';
                            })
                            .catch(error => console.error(error));

                    }
                });

                FileEl.appendChild(button);
            }
        }
    });
}