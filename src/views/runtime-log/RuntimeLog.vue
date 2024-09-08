<template>
    <div class="runtime-log">
        <div class="title-bar">
            <div class="title">运行日志</div>
            <div class="operation-button">
                <div class="item">上传日志</div>
                <div class="item">清空日志</div>
                <div class="item">放大日志窗口</div>
            </div>
        </div>
        <div class="log-content">
            <textarea v-model="test"></textarea>
        </div>
    </div>
</template>

<script lang="ts" setup>
const test = ref("fdafdafdasf");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.runtime-log {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: rgba(250, 235, 215, 0.811);
    .title-bar {
        display: flex;
        .operation-button {
            display: flex;
            margin-left: auto;
            > * {
                padding: 2px 4px;
            }
        }
    }
    .log-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-color: rgb(255, 255, 255);
    }
}
</style>
