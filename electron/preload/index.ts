import { ipcRenderer, contextBridge } from "electron";

// 预加载脚本是一个特殊的脚本，在渲染器加载网页之前注入到页面中，用于将渲染进程、Node.js进程、Electron主进程桥接在一起；
// 渲染进程通过预加载脚本可以访问 Node.js 和 Electron主进程的API，详见官网：https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload#%E4%BD%BF%E7%94%A8%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC%E6%9D%A5%E5%A2%9E%E5%BC%BA%E6%B8%B2%E6%9F%93%E5%99%A8

// 暴露API到渲染进程
contextBridge.exposeInMainWorld("ipcRenderer", {
    // 1.0> 通过消息监听的方式来使用渲染进程和主进程通信（此方法更多灵活，也更麻烦）=======================================================
    // 监听从主进程发送的消息
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },

    // 移除指定的监听器，取消通过 on 添加的监听器
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },

    // 向主进程发送异步消息，send是单向通信，将消息发送到主进程，但不需要接收返回值
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },

    // 通过 ipcRenderer.invoke 向主进程发送消息，并期待接收到主进程的返回值；
    // 该方法返回的是一个 Promise，适用于需要请求-响应的通信模式
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },

    // 2.0> 通过直接暴露方法的方式来使渲染进程和主进程通信（此方法简单、直接，但决有消息监听灵活）=============================================
    // 向主进程发送异步消息并等待返回结果（Promise）
    // 将主进程中的IPC函数暴露给渲染进程（IPC是进程间通信模块）
    // ipcRenderer.invoke用于调用主进程中已定义的指定名称的IPC函数

    // 窗口 - 最小化
    windowMin: () => ipcRenderer.invoke("min"),

    // 窗口 - 最大化
    windowMax: () => ipcRenderer.invoke("max"),

    // 窗口 - 关闭
    windowClose: () => ipcRenderer.invoke("close"),

    // 数据存储 - 保存
    storeSet: () => ipcRenderer.invoke("store-set"),

    // 数据存储 - 获取
    storeGet: () => ipcRenderer.invoke("store-get"),

    // 数据存储 - 删除
    storeDelete: () => ipcRenderer.invoke("store-delete"),

    // frp - 启动
    frpStart: () => ipcRenderer.invoke("start-frp"),

    // frp - 重启
    frpRestart: () => ipcRenderer.invoke("restart-frp"),

    // frp - 停止
    frpStop: () => ipcRenderer.invoke("stop-frp"),

    // frp - 导出配置
    frpExportConfig: () => ipcRenderer.invoke("export-config-frp"),

    // frp - 获取配置内容
    frpGetConfigContent: () => ipcRenderer.invoke("get-config-frp-content"),
});

// DOM准备函数：确保在DOM达到指定状态时执行某些操作
function domReady(condition: DocumentReadyState[] = ["complete", "interactive"]) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener("readystatechange", () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

// 安全DOM操作：提供安全的DOM添加和移除功能，防止重复操作
const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child);
        }
    },
};

/**
 * 加载动画功能
 *
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
        @keyframes square-spin {
            25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
            50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
            75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
            100% { transform: perspective(100px) rotateX(0) rotateY(0); }
        }
        .${className} > div {
            animation-fill-mode: both;
            width: 50px;
            height: 50px;
            background: #fff;
            animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
        }
        .app-loading-wrap {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #282c34;
            z-index: 9;
        }`;

    const oStyle = document.createElement("style");
    const oDiv = document.createElement("div");
    oStyle.id = "app-loading-style";
    oStyle.innerHTML = styleContent;
    oDiv.className = "app-loading-wrap";
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        },
    };
}

// 执行加载动画
const { appendLoading, removeLoading } = useLoading();
// DOM准备好后调用appendLoading显示加载动画。
domReady().then(appendLoading);

// 监听window.onmessage事件，接收到removeLoading消息时移除加载动画
window.onmessage = (ev) => {
    ev.data.payload === "removeLoading" && removeLoading();
};
// 设定5秒后自动移除加载动画。
setTimeout(removeLoading, 4999);
