<template>
    <div class="package-info">
        <div>带宽：2Mbps</div>
        <div>流量：1Gbps</div>
        <div>隧道数：1/10</div>
    </div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.package-info {
    display: flex;
}
</style>
