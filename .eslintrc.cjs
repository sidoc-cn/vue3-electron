module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        "vue/setup-compiler-macros": true, // 支持 Vue 编译宏
    },
    // 为ESLint扩展其它配置文件
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended", // 使用prettier的规则格式化代码
        "./.eslintrc-auto-import.json", // 使eslint识别自动引入的组件和API
    ],
    overrides: [],
    parser: "vue-eslint-parser", // 配置ESLint解析器
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser", // 配置JS解析器
        sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "vue/multi-word-component-names": "off", // 关闭Vue3中要求.vue文件的名称必须为多个单词的检查
        "no-unused-vars": "off", // 关闭Javascript变量未使用时的校验，在Typescript项目中必须禁用此校验，否则会误报
        "@typescript-eslint/no-unused-vars": "warn", // Typescript变量未使用时，仅发出警告，而不阻止程序运行
        "@typescript-eslint/no-unused-expressions": "off",
    },
};
