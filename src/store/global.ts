import { CalculationMethod, UserInfo } from "@/@types/global";
import { defineStore } from "pinia";

// ! 此文件为全局Store，在项目中被多处引用；
// ! 为了安全起见，请不要在当前Store中引用任何组件或封装的函数，否则极易导致循环引用。除非你非常确定被引用的组件或函数文件没有直接或间接引用当前Store;

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useGlobalStore = defineStore("global", {
    state: () => {
        return {
            /** 用户信息 */
            userInfo: null as null | UserInfo,

            /** 计算方式 */
            calculationMethod: CalculationMethod.FixedBandwidth,
        };
    },
    actions: {
        update(name: string) {
            console.log(name);
            // this.config.length = 0;
        },
    },
});
