<template>
    <div class="package-info">
        <div v-if="globalStore.calculationMethod == CalculationMethod.FixedBandwidth">带宽：2Mbps</div>
        <div v-else-if="(globalStore.calculationMethod = CalculationMethod.PayPerUse)">流量：1Gbps</div>
        <div>隧道数：1/10</div>
    </div>
</template>

<script lang="ts" setup>
import { CalculationMethod } from "@/@types/global";
import { useGlobalStore } from "@/store/global";

const globalStore = useGlobalStore();

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.package-info {
    display: flex;
}
</style>
