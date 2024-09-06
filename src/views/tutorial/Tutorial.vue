<template>
    <div class="tutorial"></div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.tutorial {
    background-color: red;
}
</style>
