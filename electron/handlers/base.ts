// 基本操作

import { BrowserWindow, ipcMain } from "electron";
import Store from "electron-store";

const store = new Store();
let mainWindow: BrowserWindow | null = null;

// 注册需要暴露给渲染进程的函数（通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise）
export const registerHandlersBase = (win: BrowserWindow) => {
    mainWindow = win;

    /**
     * 1.0> BrowserWindow窗体操作，详见官网：https://www.electronjs.org/zh/docs/latest/api/browser-window#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95
     */

    // 1.1> 窗口最小化
    // ! 此处使用async，会使函数自动返回Promise，否则就需要生动返回Promise
    ipcMain.handle("min", async (event, args) => {
        mainWindow?.minimize();
    });

    // 0.2> 窗口最大化
    ipcMain.handle("max", async (event, args) => {
        if (mainWindow?.isMaximized()) mainWindow?.restore();
        else mainWindow?.maximize();
    });

    // 0.3> 窗口关闭
    ipcMain.handle("close", async (event, args) => {
        mainWindow?.close();
    });

    /**
     * 2.0> 数据存储，详见官网：https://github.com/sindresorhus/electron-store ---------------------------------------------
     */

    // 2.1> 数据存储 - 保存
    ipcMain.handle("store-set", async (event, args) => {
        store.set(args.key, args.value);
    });

    // 2.2> 数据存储 - 获取
    ipcMain.handle("store-get", async (event, args) => {
        const value = store.get(args);
        event.sender.send("store-get-callback", value);
    });

    // 2.3> 数据存储 - 删除
    ipcMain.handle("store-delete", async (event, args) => {
        store.delete(args);
    });
};
