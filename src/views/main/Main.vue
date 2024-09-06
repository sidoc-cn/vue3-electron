<template>
    <div class="main">
        <MacTitleBar />
        <WinTitleBar />
    </div>
</template>

<script lang="ts" setup>
import MacTitleBar from "./MacTitleBar.vue";
import WinTitleBar from "./WinTitleBar.vue";

const test = ref("");
console.log(test);

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped></style>
