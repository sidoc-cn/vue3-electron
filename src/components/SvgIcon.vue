<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<!-- 
    使用示例：
    <svg-icon name="test"></svg-icon>
 -->

<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

let iconName = computed(() => {
    return `#icon-${props.name}`;
});
</script>

<style>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
