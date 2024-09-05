<template>
    <div class="qr-code">
        <qrcode-vue class="qrcode" :value="props.value" :size="props.size" />
        <!-- <div class="logo" v-if="logo">
            <img :src="logo" />
        </div> -->
        <img class="logo" :src="props?.logoSrc" v-if="props?.logoSrc" />
    </div>
</template>

<script lang="ts" setup>
/**
 * 此组件用于生成二维码组件，此组件依赖于qrcode
 * GitHub：https://github.com/scopewu/qrcode.vue
 */
import QrcodeVue from "qrcode.vue";
const props = defineProps<{
    value: string;
    size: number;
    logoSrc?: string;
}>();
</script>

<style lang="scss" scoped>
$qrcode-commit-size: 20%;
.qr-code {
    position: relative;
    width: v-bind("props.size + 'px'");
    height: v-bind("props.size + 'px'");
    .logo {
        width: $qrcode-commit-size;
        height: $qrcode-commit-size;
        position: absolute;
        left: calc(50% - ($qrcode-commit-size / 2));
        top: calc(50% - ($qrcode-commit-size / 2));
        background: #fff;
        padding: 1.4%;
        border-radius: 18%;
    }
}
</style>
