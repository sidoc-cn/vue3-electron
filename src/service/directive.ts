import { App, DirectiveBinding } from "vue";
import { useGlobalStore } from "@/store/global";

// !不要在此处引入已被自动引入的ts，否则会导致循环依赖

export default {
    install: (app: App, options: unknown) => {
        // 1.0> 操作权限处理：页面中元素的权限处理 --------------------------------------------------------------
        app.directive("auth", (el: HTMLElement, binding: DirectiveBinding) => {
            const globalStore = useGlobalStore();
            //
        });

        // 2.0> 角色权限处理 -----------------------------------------------------------------------------------
        app.directive("role", (el: HTMLElement, binding: DirectiveBinding) => {
            const globalStore = useGlobalStore();
            const { value } = binding;
            //
        });
    },
};
