import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);
app.use(store).use(router);

// 0.0> 追踪运行时错误()
app.config.errorHandler = (err, instance, info) => {
    console.error(err); // 错误上报
    console.error(instance);
    console.error(info);
};

// 1.0> 引入全局样式
import "@/assets/css/global-base.scss";
import "@/assets/css/global-page.scss";
import "@/assets/css/theme-light.scss";
import "@/assets/css/theme-dark.scss";
import "@/assets/css/global-function/index.scss";
import "@/assets/css/global-overwrite/index.scss";
document.documentElement.setAttribute("theme", localStorage.getItem("vitepress-theme-appearance") as string);

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

// 6.0 引入字体
import "./assets/fonts/fonts.scss";

// 7.0> 注册SVG插件
import "virtual:svg-icons-register";

app.mount("#app").$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
});
