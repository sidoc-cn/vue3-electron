/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    const component: DefineComponent<{}, {}, unknown>;
    export default component;
}

// 声明全局对象IpcRenderer，并在 IpcRenderer 上声明方法
import { IpcRenderer as ElectronIpcRenderer } from "electron";
declare global {
    interface Window {
        ipcRenderer: CustomIpcRenderer; // 定义一个继承了 IpcRenderer 的自定义类型
    }

    interface CustomIpcRenderer extends ElectronIpcRenderer {
        ping: () => Promise<string>; // 扩展 ping 方法
    }
}
