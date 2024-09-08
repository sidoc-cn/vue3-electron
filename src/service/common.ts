// 任务业务公共方法

import { useGlobalStore } from "@/store/global";
import { Router } from "vue-router";

// 1.0> 登录 -----------------------------------------------------------------------------------------------------------
const logIn = (token: string) => {
    localStorage.setItem("token", token);
};

// 1.1> 退出登录
const signOut = (router?: Router) => {
    localStorage.removeItem("token");
    const globalStore = useGlobalStore();
    globalStore.userInfo = null;
    router && router.replace("/login");
};

// 2.0> 获取token ---------------------------------------------------------------------------------------------------
const getToken = (): string | null => {
    return localStorage.getItem("token");
};

// 3.0> 获取当前登录用户的信息 --------------------------------------------------------------------------------------
const getUserInfo = async (token: string | null): Promise<UserInfoType | null> => {
    const globalStore = useGlobalStore();
    if (globalStore.userInfo) {
        return globalStore.userInfo;
    } else {
        if (!token) return null;
        const res = await httpGet<UserInfoType>(ServerType.Base, {
            url: "/getInfo",
        });
        globalStore.userInfo = res;
        return res;
    }
};
// 3.1> 同步获取当前用户的信息
const getSynUserInfo = (): UserInfoType | null => {
    const globalStore = useGlobalStore();
    return globalStore.userInfo;
};

// 4.0> 获取页面路由 ------------------------------------------------------------------------------------------------
const getRouters = async (token: string | null): Promise<RouterType[]> => {
    const globalStore = useGlobalStore();
    if (globalStore.routers.length > 0) {
        return globalStore.routers;
    } else {
        if (!token) return [];
        const res = await httpGet<RouterType[]>(ServerType.Base, {
            url: "/getRouters",
        });
        globalStore.routers = res;
        return res;
    }
};
// 4.1> 同步获取页面路由
const getSynRouters = (): RouterType[] => {
    const globalStore = useGlobalStore();
    return globalStore.routers;
};

export default { logIn, signOut, getToken, getUserInfo, getSynUserInfo, getRouters, getSynRouters };
