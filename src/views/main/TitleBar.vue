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

        <div class="windowOperation">
            <i class="iconfont iconzuixiaohua_huaban1" @click="$electron.ipcRenderer.send('min')"></i>
            <i class="iconfont iconhuifu_huaban1" @click="$electron.ipcRenderer.send('max')"></i>
            <i class="close iconfont iconguanbi_huaban1" @click="$electron.ipcRenderer.send('close')"></i>
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
    * {
        /* drag会导致元素无法选中或点击，因此子元素取消drag */
        -webkit-app-region: no-drag;
    }

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

/* 标题栏 - 窗体操作 */
.windowOperation {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
}
.windowOperation > i {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: rgb(109, 109, 109);
    cursor: pointer;
    padding: 8px 10px;
    padding-bottom: 4px;
}
.windowOperation > i:hover {
    background-color: rgb(212, 212, 212);
}
.windowOperation > i.close:hover {
    background-color: rgb(255, 72, 72);
    color: white;
}
</style>
