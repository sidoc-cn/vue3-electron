import { App, DirectiveBinding } from "vue";
import { useGlobalStore } from "@/store/global";

// !不要在此处引入已被自动引入的ts，否则会导致循环依赖

export default {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install: (app: App, options: unknown) => {
        // 1.0> 操作权限处理：页面中元素的权限处理 --------------------------------------------------------------
        app.directive("auth", (el: HTMLElement, binding: DirectiveBinding) => {
            const globalStore = useGlobalStore();

            const permissions = globalStore.userInfo?.permissions;
            if (!permissions) {
                console.error("权限无法生效：因为无法从 globalStore.userInfo?.permissions 中获取权限列表");
                return;
            }

            const { value } = binding; // 当前元素上的权限标志，即 v-auth 上所设置的值
            if (value) {
                // 0.1> 判断权限标志是否在权限列表
                // some()函数用于测试数组中是否至少有一个元素能够被提供的函数测试通过，如果有，则返回true;
                const hasPermissions = permissions.some((permission) => {
                    // "*:*:*" 表示所有权限
                    return "*:*:*" === permission || value === permission;
                });

                // 0.2> 如果当前权限不在权限列表中，则删除当前元素
                if (!hasPermissions && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            } else {
                throw new Error(`请设置操作权限标签值`);
            }
        });

        // 2.0> 角色权限处理 -----------------------------------------------------------------------------------
        app.directive("role", (el: HTMLElement, binding: DirectiveBinding) => {
            const globalStore = useGlobalStore();
            const { value } = binding;
            const super_admin = "admin";
            const roles = globalStore.userInfo?.roles;
            if (value && value instanceof Array && value.length > 0) {
                const roleFlag = value;
                const hasRole =
                    roles &&
                    roles.some((role) => {
                        return super_admin === role || roleFlag.includes(role);
                    });
                if (!hasRole && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            } else {
                throw new Error(`请设置角色权限标签值"`);
            }
        });
    },
};
