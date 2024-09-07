<template>
    <div class="runtime-log"></div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.runtime-log {
    width: 60%;
    background-color: rgba(250, 235, 215, 0.811);
}
</style>
