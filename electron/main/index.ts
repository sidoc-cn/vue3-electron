import { app, BrowserWindow, shell, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import Bugsnag from "@bugsnag/electron";
import { registerDemo } from "../handlers/demo";
import { registerHandlersBase } from "../handlers/base";
import { registerHandlersFrp, frpStop } from "../handlers/frp";

// 主进程全局异常上报
Bugsnag.start({ apiKey: "xxxx" });

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 构建后的目录结构
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron主进程
// │ └─┬ preload
// │   └── index.mjs   > 预加载脚本
// ├─┬ dist
// │ └── index.html    > Electron渲染进程
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

// 禁用Windows 7的GPU加速以解决兼容性问题
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// 设置Windows 10+的应用程序名称以用于系统通知
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// 单实例锁定：使用app.requestSingleInstanceLock()确保应用程序为单实例运行
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
    // BrowserWindow配置：https://www.electronjs.org/zh/docs/latest/api/browser-window
    win = new BrowserWindow({
        title: "Main window",
        icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        center: true,
        backgroundColor: "#fff",
        // frame设置为false会将标题栏和窗口控制按钮全部隐藏
        frame: process.platform === "darwin" ? true : false,
        // 窗口标题栏样式（此处隐藏标题栏，但保存最大化、最小化等控制按钮）
        titleBarStyle: "hidden",
        trafficLightPosition: { x: 10, y: 18 }, // 自定义Mac上左上红绿灯的位置（即最小化、最大化、关闭窗口按钮）
        webPreferences: {
            preload,
            // 警告：在生产环境中启用nodeIntegration和禁用contextIsolation不安全
            // nodeIntegration表示是否启用node一体化，启用后渲染进程将完全具备执行node的完整能力，但会带来安全隐患；因为渲染进程上的所有js脚本(包括第三方库)将都权限调用node的能力，来对用户电脑造成危害；
            // 比较安全的方式是渲染进程通过 contextBridge.exposeInMainWorld 桥接来调用主进程，然后通过主进程来调用node
            // nodeIntegration: false,

            // 考虑使用contextBridge.exposeInMainWorld
            // 详细阅读：https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // contextIsolation: false,
        },
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
        win.webContents.openDevTools(); // 开发模式下，打开开发者工具
    } else {
        win.loadFile(indexHtml);
    }

    // 当窗口(渲染进程)的内容加载完成后，会触发"did-finish-load"事件；此处的加载完成是指index.html主页面，不包括#app或其它动态绑定的子组件元素的加载完成；
    // 使用webContents.send方法，将消息"main-process-message"发送到渲染进程。
    // 以测试或演示如何从主进程向渲染进程发送消息
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    // 让所有链接用浏览器打开，而不是用应用程序打开
    // 拦截窗口中的链接点击事件，如果URL以"https:"开头，调用shell.openExternal在默认浏览器中打开链接。
    // 返回 { action: "deny" } 以阻止应用程序内部的窗口打开该链接。
    // 确保所有外部链接在用户的默认浏览器中打开，而不是在应用程序中。
    // 增强用户体验和安全性，避免在应用中意外加载不受信任的内容。
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:") || url.startsWith("http:")) shell.openExternal(url);
        return { action: "deny" };
    });
    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

// 当Electron初始化完成后，创建主窗口、注册ipc函数等
app.whenReady().then(() => {
    // 调用createWindow函数创建主窗口。
    createWindow();

    // 注册需要暴露给渲染进程的函数（通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise）
    registerHandlersBase(win);
    registerHandlersFrp(win);

    registerDemo(win);
});

// 当所有窗口关闭时，设置win为null;
// 在非macOS平台上退出应用程序
app.on("window-all-closed", () => {
    win = null;
    if (process.platform !== "darwin") app.quit();
});

// 程序即将退出时触发
app.on("will-quit", () => {
    frpStop(); // 程序退出时停止frp
});

// 当用户尝试启动第二个应用实例时触发。
// 如果主窗口存在且最小化，恢复并聚焦窗口。
// 确保应用程序只有一个实例运行。
// 提高用户体验，避免多个窗口混乱。
app.on("second-instance", () => {
    if (win) {
        // 如果用户试图打开另一个实例，聚焦到主窗口
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

// 在macOS上，当应用图标被点击且没有窗口打开时触发
// 如果有窗口存在，聚焦窗口；否则创建新窗口
// 符合macOS上的应用行为规范。
// 提供无缝用户体验。
app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

// 处理从渲染进程发来的"open-win"请求。
// 创建一个新的子窗口，根据环境加载URL或本地文件。
ipcMain.handle("open-win", (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // 动态创建新窗口，支持开发和生产环境。
    // 提供灵活的窗口管理，传递参数以决定窗口内容。
    if (VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});

process.on("uncaughtException", (err, origin) => {
    //收集日志
    //显示异常提示信息或者重新加载应用
    console.error("收到异常");
});
