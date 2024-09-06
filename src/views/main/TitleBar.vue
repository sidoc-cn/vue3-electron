<template>
    <div class="title-bar">
        <div class="item logo">
            <img src="@/assets/logo.png" />
        </div>
        <div class="item title">Vue3-Electron模板项目 v0.1.1</div>
        <div class="item new-version">
            <el-badge is-dot class="item">
                <el-link type="primary" :underline="false">发现新版本，立即升级</el-link>
            </el-badge>
        </div>
    </div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.title-bar {
    -webkit-app-region: drag; /* 可拖拽移动窗体（在Mac下打开调试工具时无效） */

    display: flex;
    padding: 10px;
    padding-top: 30px;
    align-items: center;

    .item {
        display: flex;
        margin-right: 10px;
        align-items: center;
    }
    .item.logo {
        img {
            width: 24px;
        }
    }
}
</style>
