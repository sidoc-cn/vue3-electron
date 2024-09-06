<template>
    <div class="win-title-bar">Windows和linux标题栏</div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.win-title-bar {
    -webkit-app-region: drag; /* 可拖拽移动窗体（在Mac下打开调试工具时无效） */
}
</style>
