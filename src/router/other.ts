import { RouteRecordRaw } from "vue-router";

// 其它

const routes: Array<RouteRecordRaw> = [
    {
        path: "other",
        children: [
            {
                path: "about-us",
                component: () => import("@/views/other/about-us/Index.vue"),
            },
        ],
    },
];

export default routes;
