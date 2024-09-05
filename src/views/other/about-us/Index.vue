<template>
    <Markdown :data="markdownData"></Markdown>
</template>

<script lang="ts" setup>
let markdownData = ref("");
import("./Index.md?raw").then((data) => {
    markdownData.value = data.default;
});
</script>

<style lang="scss" scoped>
.tip {
}
</style>
