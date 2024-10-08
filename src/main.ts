import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Bugsnag from "@bugsnag/electron";

const app = createApp(App);
app.use(store).use(router);

// 0.0> 追踪运行时错误()
app.config.errorHandler = (err, instance, info) => {
    console.error(err); // 错误上报
    console.error(instance);
    console.error(info);
};

// 0.0> 渲染进程全局异常上报
Bugsnag.start();

// 1.0> 引入全局样式
import "@/assets/css/global-base.scss";
import "@/assets/css/global-page.scss";
import "@/assets/css/theme-light.scss";
import "@/assets/css/theme-dark.scss";
import "@/assets/css/global-function/index.scss";
import "@/assets/css/global-overwrite/index.scss";
document.documentElement.setAttribute("theme", localStorage.getItem("vitepress-theme-appearance") as string);

// 1.0 使用图标库
import "../statics/iconfont/iconfont.css";

// 2.0> 注册全局指令
import directive from "@/service/directive";
app.use(directive, {});

// 3.0> 注册原型方法
// require("/src/service/prototype/index.ts");

// 4.0> 引入Element Plus全局样式
import "element-plus/dist/index.css";

// 5.0> Element Plus国际化（Element Plus默认使用英语，如果希望使用其他语言，需要如下设置）
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
app.use(ElementPlus, {
    locale: zhCn,
});

// 6.0> 注册所有 Element plus 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 7.0 引入字体
import "./assets/fonts/fonts.scss";

// 8.0> 注册SVG插件
import "virtual:svg-icons-register";

// 9.0> electron
import "./service/ipcDemo";
// import "./service/nodeApi";

app.mount("#app").$nextTick(() => {
    // Vue应用挂载并完成DOM更新后，发送移除Loading的通知
    postMessage({ payload: "removeLoading" }, "*");
});
