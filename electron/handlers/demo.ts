// 此文件演示与渲染进程的通信
// 渲染进程与主进程通信的方式有以下两种：
// a.消息监听：此方式灵活，但使用复杂；
// b.直接调用：此方式简单，但灵活性欠佳。

import { ipcMain, BrowserWindow } from "electron";
let mainWindow: BrowserWindow | null = null;

// 注册需要暴露给渲染进程的函数（通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise）
export const registerDemo = (win: BrowserWindow) => {
    mainWindow = win;

    // 1.0> 通过消息监听通信的示例 ==============================================================
    // 1.1> 监听发送的消息 (send)
    ipcMain.on("simple-message", (event, arg) => {
        console.log("Received in main:", arg);
        // 回复渲染进程（不需要 invoke）
        event.sender.send("reply", "Hello from main process");
    });

    // 1.2> 监听 invoke 调用
    ipcMain.handle("invoke-message", async (event, arg) => {
        console.log("Invoke received in main:", arg);
        return `Received your message: ${arg}`; // 返回给渲染进程
    });

    // 1.3> 向渲染进程发送消息
    // mainWindow?.webContents.send("main-process-message", new Date().toLocaleString());

    // 2.0> 直接向渲染进程暴露方法的示例 ==========================================================
    ipcMain.handle("direct-call", async (event, args) => {
        return "result";
    });
};
