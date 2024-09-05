import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 静态路由文件
import other from "./other";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import("@/views/main/Main.vue"),
        // redirect: "/",
        children: [...other],
    },
    {
        path: "/login",
        component: () => import("@/views/login/Login.vue"),
    },
    {
        name: "404",
        path: "/:catchAll(.*)",
        component: () => import("@/views/other/404.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    // 登录校验
    const noNeedAuthList = ["/login"]; // 无需登录的页面Path
    const token = common.getToken();
    if (token === null) {
        // token失效时，只能跳转到 “无需登录的页面” 或 “登录页面”
        if (noNeedAuthList.includes(to.path)) next();
        else next("/login");
        return;
    }

    next();
});

export default router;
