<template>
    <div class="we-chat-support">
        <!-- type的值为：discussion_group(微信交流群)、customer_service(技术支持) -->
        <template v-if="$attrs['type'] === 'discussion_group'">微信交流群二维码</template>

        <template v-else>技术支持二维码</template>
    </div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.we-chat-support {
    display: flex;
}
</style>
