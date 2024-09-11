// 此文件演示与主进程的通信
// 渲染进程与主进程通信的方式有以下两种：
// a.消息监听：此方式灵活，但使用复杂；
// b.直接调用：此方式简单，但灵活性欠佳。

// 1.0> 通过消息监听通信的示例 =======================================================
const messageListener = (_event: any, ...args: any[]) => {
    console.log("[收到主进程消息]:", ...args);
};

// 1.1>.监听主进程消息（在项目的任何地方都可以监听主进程的消息）
window.ipcRenderer.on("main-process-message", messageListener);

// 1.2> .移除监听
window.ipcRenderer.off("main-process-message", messageListener);

// 1.3>.发送消息给主进程
// window.ipcRenderer.send("simple-message", "Hello from renderer");

// 1.4> 调用主进程的 invoke 方法并等待结果
// const result = await window.ipcRenderer.invoke("invoke-message", "Some data");
// console.log(`Invoke result: ${result}`);

// 2.0> 通过直接调用的示例 ==========================================================
// const result1 = await window.ipcRenderer.invoke("direct-call", "Some data");
// console.log(`Invoke result: ${result1}`);

export {};
