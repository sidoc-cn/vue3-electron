<template>
    <div class="package-info">
        <!-- 1.0> 带宽信息 ------------------------------------------------------------ -->
        <el-popover
            v-if="globalStore.calculationMethod == CalculationMethod.FixedBandwidth"
            placement="bottom-start"
            :width="400"
            trigger="hover"
        >
            <template #reference>
                <div>带宽：{{ accountInfoStore.bandwidth }}Mbps</div>
            </template>
            <el-table :data="gridData">
                <el-table-column width="150" property="date" label="date" />
                <el-table-column width="100" property="name" label="name" />
                <el-table-column width="300" property="address" label="address" />
            </el-table>
            <div>在“固定带宽”模式下，当前账号下所有隧道共享以上带宽</div>
        </el-popover>

        <!-- 流量信息 -->
        <el-popover
            v-else-if="(globalStore.calculationMethod = CalculationMethod.PayPerUse)"
            placement="bottom-start"
            :width="400"
            trigger="hover"
        >
            <template #reference>
                <div>流量：{{ accountInfoStore.dataPackage }}Gbps</div>
            </template>
            <el-table :data="gridData">
                <el-table-column width="150" property="date" label="date" />
                <el-table-column width="100" property="name" label="name" />
                <el-table-column width="300" property="address" label="address" />
            </el-table>
            <div>在“按量付费”模式下，当前账号下所有隧道共享以上流量</div>
        </el-popover>

        <!-- 隧道信息 -->
        <div class="tunnel-amount">隧道数：1/10</div>
    </div>
</template>

<script lang="ts" setup>
import { CalculationMethod } from "@/@types/global";
import { useGlobalStore } from "@/store/global";
import { useAccountInfoStore } from "@/store/account-info";

const globalStore = useGlobalStore();
const accountInfoStore = useAccountInfoStore();

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.package-info {
    display: flex;
    .tunnel-amount {
        margin-left: 80px;
    }
}
</style>
