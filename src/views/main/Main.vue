<template>
    <div class="main">
        <TitleBar />
        <div class="content">
            <AccountInfo />
            <TunnelList />
            <div class="bottom-part">
                <RuntimeLog />
                <Tutorial />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import TitleBar from "./TitleBar.vue";
import AccountInfo from "@/views/account-info/Index.vue";
import TunnelList from "@/views/tunnel-list/TunnelList.vue";
import RuntimeLog from "@/views/runtime-log/RuntimeLog.vue";
import Tutorial from "@/views/tutorial/Tutorial.vue";

const test = ref("");
console.log(test);

onMounted(() => {
    console.log("1");
});

// 监听主进程消息
window.ipcRenderer.on("main-process-message", (_event, ...args) => {
    console.log("[收到主进程消息]:", ...args);
});
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-top: 0;
    .content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-color: #fff;

        .bottom-part {
            display: flex;
            height: 180px;
            background-color: rgb(178, 252, 217);
        }
    }
}
</style>
