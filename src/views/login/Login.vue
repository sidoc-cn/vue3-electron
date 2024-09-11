<template>
    <div class="drag-bar"></div>
    <div class="login">
        <div class="title">Vue3-App</div>

        <div class="content">
            <el-form :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入账号">
                        <template #prefix>
                            <SvgIcon name="login/user" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" @keyup.enter="login">
                        <template #prefix>
                            <SvgIcon name="login/password" />
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="login" :loading="isLogin">登录</el-button>
        </div>
        <div class="footer">
            v{{ version }} |
            <div onclick="window.open('https://sidoc.cn', '_blank');">进入官网</div>
            <!-- <div>©2022-2023 Sidoc.cn 版权所有</div>
            <div class="version">版本 v{{ version }}</div>
            <div class="update-time" v-if="buildTime">更新于{{ buildTime }}</div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import packageConfig from "../../../package.json";

const version = ref(packageConfig.version);
const router = useRouter();
const form = reactive({
    username: "",
    password: "",
    checked: false,
});

// 0.0> 获取前端项目打包时间
const buildTime = ref("");
buildTime.value = import.meta.env.BUILD_TIME;

// 1.0> 设置默认用户名密码
const defaultUsername = import.meta.env.VITE_APP_DEFAULT_USERNAME;
const defaultPassword = import.meta.env.VITE_APP_DEFAULT_PASSWORD;
form.username = defaultUsername;
form.password = defaultPassword;

// 2.0> 登录实现
const isLogin = ref(false);
const login = () => {
    common.logIn("假装登录3");
    router.push("/");
    return;

    // interface ResType {
    //     token: string;
    // }
    // isLogin.value = true;
    // httpPost<ResType>(ServerType.Base, {
    //     url: "/login",
    //     data: form,
    // })
    //     .then(async (data: ResType) => {
    //         // 0.1> 登录配置
    //         common.logIn(data.token);

    //         // 0.2> 接口类型为JSON时，忽略权限，直接跳转到首页
    //         if (import.meta.env.VITE_APP_API_TYPE") === "json") {
    //             router.push("/");
    //             return;
    //         }
    //     })
    //     .finally(() => {
    //         isLogin.value = false;
    //     });
};
</script>

<style lang="scss" scoped>
// 窗体拖动区域
.drag-bar {
    // background-color: red;
    position: fixed;
    top: 0;
    left: 0;
    height: 55px;
    width: 100%;
    -webkit-app-region: drag; /* 可拖拽移动窗体（在Mac下打开调试工具时无效） */
    * {
        /* drag会导致元素无法选中或点击，因此子元素取消drag */
        -webkit-app-region: no-drag;
    }
}

// 登录页面主体
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: relative;
    .title {
        margin-top: auto;
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 6%;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background-color: rgb(226, 226, 226);
        // input输入框样式
        :deep() .el-input__wrapper {
            background-color: #a0d5ff;
        }
    }

    .footer {
        display: flex;
        flex-wrap: wrap;
        margin-top: auto;
        font-size: 0.9375rem;
        color: gray;
        bottom: 0.5rem;
        > * {
            white-space: nowrap;
            margin: 0 0.4rem;
        }
    }
}
</style>
