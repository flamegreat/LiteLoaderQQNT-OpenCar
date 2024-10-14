// 运行在 Electron 渲染进程 下的页面脚本

// 打开设置界面时触发
export const onSettingWindowCreated = view => {
    // view 为 Element 对象，修改将同步到插件设置界面
    console.log("view 为 Element 对象，修改将同步到插件设置界面");

    const new_navbar_item = `
<div>
    <setting-section data-title="" class="dev">
        <setting-panel>
            <setting-list data-direction="column">
                <setting-item data-direction="row">
                    <div>
                        <setting-text id="transitio-debug">OpenCar 技术群</setting-text>
                        <setting-text data-type="secondary">群号：94234450</setting-text>
                    </div>
                    <button class="q-button q-button--secondary q-button--small default-btn vue-component"
                        id="opencar-open-qqgroup">
                        <span class="q-button__slot-warp">进去瞅瞅</span>
                    </button>
                </setting-item>
                <setting-divider data-direction="row"></setting-divider>
                <setting-item data-direction="row">
                    <div>
                        <setting-text>OpenCar 网页版</setting-text>
                        <setting-text data-type="secondary">https://opencar.mnorg.com</setting-text>
                    </div>
                    <button class="q-button q-button--secondary q-button--small default-btn vue-component"
                        id="opencar-open-web">
                        <span class="q-button__slot-warp">进去瞅瞅</span>
                    </button>
                </setting-item>
            </setting-list>
        </setting-panel>
    </setting-section>

    <setting-section data-title="关于" class="versions">
        <setting-panel>
            <setting-list data-direction="row" class="current">
                <setting-item data-direction="column">
                    <setting-text>版本</setting-text>
                    <setting-text data-type="secondary">
                        <span class="opencar-link"
                            data-link="https://github.com/flamegreat/LiteLoaderQQNT-OpenCar/releases">0.1.0</span>
                    </setting-text>
                </setting-item>
                <setting-divider data-direction="column"></setting-divider>
                <setting-item data-direction="column">
                    <setting-text>作者</setting-text>
                    <setting-text data-type="secondary">
                        <span class="opencar-link" data-link="https://blog.mnorg.cn">Flaems</span>
                    </setting-text>
                </setting-item>
                <setting-divider data-direction="column"></setting-divider>
                <setting-item data-direction="column">
                    <setting-text>反馈</setting-text>
                    <setting-text data-type="secondary">
                        <span class="opencar-link"
                            data-link="https://github.com/flamegreat/LiteLoaderQQNT-OpenCar/issues">Github Issues</span>
                    </setting-text>
                </setting-item>
            </setting-list>
        </setting-panel>
    </setting-section>
</div>
`;

    const parser = new DOMParser();
    const doc2 = parser.parseFromString(new_navbar_item, "text/html");
    const node2 = doc2.querySelector("div");  // 获取 div 元素

    if (node2) { // 确保 node2 不为 null
        view.appendChild(node2); // 将 div 添加到 view 中
    } else {
        console.error("未能找到 div 元素");
    }

    node2.querySelector("#opencar-open-web").onclick = async () => {
        window.xq.openBrowser('https://opencar.mnorg.com');
    };

    node2.querySelector("#opencar-open-qqgroup").onclick = async () => {
        window.xq.openBrowser('https://qm.qq.com/q/epylX9g8py');
    };

    // Links
    view.querySelectorAll(".opencar-link").forEach(link => {
        const url = link.getAttribute("data-link");
        link.setAttribute("title", url);
        link.style.cursor = "pointer";
        link.style.color = "#81bef5";

        OpenCarLog("点击链接：" + url);
        link.addEventListener("click", (_event) => {
            window.xq.openBrowser(url);
        });
    });
}

onLoad();

async function onLoad() {
    setInterval(() => {
        // 定时执行
        OpenCar();
    }, 1000);
}

const btn_text_opencar = "OpenCar";
const btn_text_close = "Close";

async function OpenCar() {

    // 获取全部文件消息列表元素
    var elements = document.querySelector(".chat-msg-area__vlist")?.querySelectorAll(".file-element");

    // 判断是否为空
    if (!elements) return;

    elements.forEach(FileEl => {
        // 获取文件信息元素
        const FileInfoEl = FileEl.querySelector(".file-info");

        // 判断文件是否已下载
        const isdown = FileInfoEl?.textContent?.includes("已下载");
        const issend = FileInfoEl?.textContent?.includes("已发送");

        // 不是已下载文件则跳过
        if (!isdown && !issend) return;

        // 按钮 id
        const btn_id = "opencar_" + FileEl.getAttribute('element-id');

        // 判断是否已经创建了按钮
        const hasbutton = document.getElementById(btn_id);

        // 已经创建了按钮则跳过
        if (hasbutton) return;

        // 没有按钮则创建按钮
        const button = document.createElement('button');
        button.id = btn_id;
        button.textContent = btn_text_opencar;
        button.addEventListener('click', async function (event) {
            // 阻止事件冒泡
            event.stopPropagation();

            // 点击按钮时播放或关闭视频
            OpenCarPlayOrClose(FileEl, FileEl.title).then((isplay) => {
                if (isplay) {
                    button.textContent = btn_text_close;
                }
                else {
                    button.textContent = btn_text_opencar;
                }
            });
        });

        FileInfoEl.appendChild(button);
    });
}

// 打开或关闭视频播放
async function OpenCarPlayOrClose(FileEl, filename) {
    // 获取 video 元素
    const video_id = "opencar_video_" + FileEl.getAttribute('element-id');
    const video = document.getElementById(video_id);

    // 获取 img 元素
    const img_id = "opencar_img_id" + FileEl.getAttribute('element-id');
    const img = document.getElementById(img_id);

    if (video) {
        // 移除 video 元素
        video.remove();
        return false;
    }
    else if (img) {
        // 移除 img 元素
        img.remove();
        return false;
    }
    else {
        // 获取下载目录
        const downloadPath = await window.xq.getDownloadPath();
        const filepath = downloadPath + '/' + filename;

        // button.textContent = 'loading...';

        // 读取文件内容
        const fileData = await window.xq.readFile(filepath);

        const uint8Array = new Uint8Array(fileData);
        const reversedArray = uint8Array.reverse();
        const blob = new Blob([reversedArray], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        // 创建 video 元素
        const video = document.createElement('video');
        FileEl.appendChild(video);

        video.controls = true; // 显示播放控件
        video.id = video_id;
        video.width = FileEl.offsetWidth; // 设置视频宽度
        video.src = url;

        video.onerror = function (event) {
            OpenCarLog("播放视频出错啦，尝试显示为图片。");

            video.remove();

            const img = document.createElement('img');
            img.id = img_id;
            img.src = URL.createObjectURL(blob);
            img.width = FileEl.offsetWidth;
            FileEl.appendChild(img);
        };
        // 播放视频
        video.play();

        return true;
    }
}

async function OpenCarLog(msg) {
    console.log('[OpenCar] ' + msg);
};