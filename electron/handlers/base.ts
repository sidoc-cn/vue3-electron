// 基本操作

// frp内网穿透相关操作

// 注册需要暴露给渲染进程的函数（通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise）
import { ipcMain } from "electron";

export const registerHandlersBase = () => {
    ipcMain.handle("some-channel", async (event, arg) => {
        // Your logic here
        return "result";
    });

    ipcMain.handle("another-channel", async (event, arg) => {
        // Another logic here
        return "another result";
    });
};
