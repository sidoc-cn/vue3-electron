<template>
    <div class="tunnel-list"></div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.tunnel-list {
    background: rgb(232, 255, 253);
    display: flex;
    flex-grow: 1;
}
</style>
