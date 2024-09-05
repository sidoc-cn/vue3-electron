<template>
    <div class="dialog-confirm">
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="remark">
            <slot name="remark"></slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.content {
    text-align: center;
    font-weight: bold;
    font-size: 1.125rem;
    color: #333333;
    margin-bottom: 0.625rem;
}
.remark {
    text-align: center;
    font-size: 0.875rem;
    color: #333333;
}
</style>
