<template>
    <div class="_404">
        <div class="title">{{ data.code }}</div>
        <pre class="des">{{ data.des }}</pre>
        <div>
            <el-link type="primary" @click="utils.common.openPage(router, '/', false)">返回首页</el-link>
            <el-link type="primary" @click="utils.common.openPage(router, '/login', false)">返回登录</el-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
const data = reactive({
    code: "",
    des: "",
});

const router = useRouter();
if (router.currentRoute.value.query.type === "no-auth") {
    data.code = "405";
    data.des = "无访问权限~";
} else {
    data.code = "404";
    data.des = "页面找不到了~";
}
</script>

<style lang="scss" scoped>
._404 {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
        font-size: 800%;
    }
    .des {
        font-size: 200%;
    }
}
</style>
