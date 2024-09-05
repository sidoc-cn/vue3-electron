import fs from "node:fs";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron/simple";
import pkg from "./package.json";
import path, { join } from "path";

/**
 * API函数自动按需引入插件
 *
 * GitHub:https://github.com/antfu/unplugin-auto-import
 */
import ApiAutoImport from "unplugin-auto-import/vite";

/**
 * Vue组件按需自动引入插件
 * 该插件提供了市面上常见的UI库解析器，用于辅助自动按需引入，此处引入element-plus解析器；
 *
 * GitHub:https://github.com/antfu/unplugin-vue-components
 */
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ComponentsAutoImport from "unplugin-vue-components/vite";

/**
 * Icons图标按需引入插件
 */
import IconsAutoImportResolver from "unplugin-icons/resolver";
import IconsAutoImport from "unplugin-icons/vite";

/**
 * Svg雪碧图生成插件
 * 预加载：该插件在任务运行时就生成所有图标,只需操作一次 dom
 * 高性能：该插件内置缓存,仅当文件被修改时才会重新生成
 *
 * GitHub:https://github.com/vbenjs/vite-plugin-svg-icons
 */
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    fs.rmSync("dist-electron", { recursive: true, force: true });

    const isServe = command === "serve";
    const isBuild = command === "build";
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

    // Vite默认不加载.env文件，因为只有在执行完 Vite 配置后才能确定加载哪个.env文件；而此处手动提前加载.env文件，以获取全局变量。

    // 根据 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd() + "/env", "");

    return {
        base: env.VITE_APP_ENV_PATH, // 公共基础路径，
        build: {
            outDir: "dist",
            sourcemap: true,
            chunkSizeWarningLimit: 8000, // 打包后单个模块文件的大小限制，默认为500K；超过此限制后，打包时会给出警告，此处调高限制是为了避免控制台给出警告；之所以不建议单个模块文件过大，是因为这会响应页面的加载速度；
        },
        envDir: "env",
        resolve: {
            alias: {
                "@": join(__dirname, "src"),
            },
        },
        plugins: [
            vue(),
            electron({
                main: {
                    // Shortcut of `build.lib.entry`
                    entry: "electron/main/index.ts",
                    onstart({ startup }) {
                        if (process.env.VSCODE_DEBUG) {
                            console.log(/* For `.vscode/.debug.script.mjs` */ "[startup] Electron App");
                        } else {
                            startup();
                        }
                    },
                    vite: {
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: "dist-electron/main",
                            rollupOptions: {
                                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                                // we can use `external` to exclude them to ensure they work correctly.
                                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                                // Of course, this is not absolute, just this way is relatively simple. :)
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                preload: {
                    // Shortcut of `build.rollupOptions.input`.
                    // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                    input: "electron/preload/index.ts",
                    vite: {
                        build: {
                            sourcemap: sourcemap ? "inline" : undefined, // #332
                            minify: isBuild,
                            outDir: "dist-electron/preload",
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                // Ployfill the Electron and Node.js API for Renderer process.
                // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
                // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
                renderer: {},
            }),

            // 0.1> API函数自动按需引入插件
            ApiAutoImport({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/, // .md
                ],
                exclude: ["src/main.ts", "src/service/directive.ts", "src/service/global-install.ts"],
                dts: true,
                eslintrc: {
                    enabled: true,
                    filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
                    globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
                },

                // 在 Vue 模板中自动导入
                vueTemplate: true,

                // 自动导入指定组件
                imports: [
                    "vue",
                    "vue-router",
                    "pinia",
                    // {
                    //     message: ["messageError", "messageSuccess", "messageWarning", "messageInfo"],
                    // },
                ],

                // 禁止自动导入的标示符（vue中的 h 标签自动导入后，会与rollup等三方依赖冲突 ，因此禁止自动导入 ）
                ignore: ["h"],

                // 搜索需要自动导入的自定义组件目录
                dirs: ["src/service/", "src/components/**/*", "src/api/api*"],

                // 自定义解析器
                // 可以在这自定义自己的东西，比如接口api的引入，工具函数等等
                resolvers: [
                    ElementPlusResolver(),

                    // 自动导入图标组件
                    IconsAutoImportResolver({
                        prefix: "Icon",
                    }),
                ],
            }),

            // 0.2> Vue组件自动按需引入插件
            ComponentsAutoImport({
                // 生成 components.d.ts 全局声明文件，也接受自定义文件名的路径
                dts: true,

                // 搜索需要自动导入的自定义组件目录
                dirs: ["src/components"],

                // 组件的有效文件扩展名。
                extensions: ["vue"],

                // 搜索子目录
                deep: true,

                // 自定义组件的解析器
                resolvers: [
                    // 自动注册图标组件
                    IconsAutoImportResolver({
                        prefix: "i", // 自定义图标前缀
                        enabledCollections: ["ep"], // 声明需使用的图标集，查看所有图标集：https://icones.js.org/
                    }),

                    // 自动注册图标组件
                    IconsAutoImportResolver(),
                ],

                // 自动导入指令
                directives: true,
            }),

            // 0.3> Icon图标自动按需引入插件
            IconsAutoImport({
                autoInstall: true, // 自动安装所需的图标集
                compiler: "vue3", // 指定编译环境为vue3（这一步很重要，如果配置错误会导致编译无法通过）
            }),

            // 0.4> Svg雪碧图自动生成插件
            createSvgIconsPlugin({
                // 指定SVG图标文件夹
                iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
                // 指定icon name的格式
                symbolId: "icon-[name]",
            }),
        ],
        server:
            process.env.VSCODE_DEBUG &&
            (() => {
                const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
                return {
                    host: url.hostname,
                    port: +url.port,
                };
            })(),
        clearScreen: false,
    };
});
