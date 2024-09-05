<template>
    <div v-bind="$attrs">
        <el-dialog
            v-bind="$attrs"
            class="dialog-html"
            v-model="visible"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :width="props.options.width"
            :top="props.options.top"
            :draggable="props.options.draggable?.value !== undefined ? props.options.draggable?.value : true"
        >
            <!-- 自定义头部 -->
            <template #header>
                <div class="title-bar">
                    <div class="title">{{ props.options.title.value }}</div>

                    <!-- 可定义子标题 -->
                    <slot name="title-sub"></slot>

                    <SvgIcon name="component/close" class="close" @click="close()" />
                </div>
            </template>

            <!-- 自定义内容 -->
            <slot></slot>

            <!-- 自定义底部 -->
            <template #footer>
                <slot name="dialog-footer">
                    <div class="action-button">
                        <el-button
                            v-for="(item, index) in props.options.actionButton"
                            size="large"
                            :key="index"
                            :type="item.type"
                            :loading="item.status === DialogActionButtonStatus.Loading"
                            :disabled="item.status === DialogActionButtonStatus.Disabled"
                            @click="actionButtonClick(item)"
                        >
                            {{ item.text }}
                        </el-button>
                    </div>
                </slot>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { DialogActionButton, DialogActionButtonType, DialogActionButtonStatus } from "./DialogHtml";

// Vue3 defineProps 暂时尚未支持从外部导入interface类型，因此需要在当前页面中声明，详见：https://segmentfault.com/q/1010000042014549
export interface DialogProps {
    /** 标题 */
    title: Ref<string>;

    /** 是否显示弹框 */
    visible: Ref<boolean>;

    /** 弹框宽度，默认为auto */
    width?: string;

    /** 弹框距顶部的距离 */
    top?: string;

    /** 是否允许拖动弹框 */
    draggable?: Ref<boolean>;

    /** 操作按钮 */
    actionButton: DialogActionButton[];

    /**
     * 操作按钮点击事件
     * @param button 被点击的按钮
     * @param data 被点击按钮对应的节点数据
     */
    actionButtonClick?: (button: DialogActionButton, done: () => void) => void;
}

// 1.0> props接参，并配置默认值
const props = withDefaults(
    defineProps<{
        options: DialogProps;
    }>(),
    {
        options: (): DialogProps => {
            return {
                title: ref("标题"),
                visible: ref(false),
                width: "auto",
                actionButton: [
                    { key: "cancel", text: "取消", type: DialogActionButtonType.Default, status: DialogActionButtonStatus.Default },
                    { key: "confirm", text: "确认", type: DialogActionButtonType.Primary, status: DialogActionButtonStatus.Default },
                ],
                draggable: ref(false),
            };
        },
    },
);

// 2.0> 浅拷贝props变量
const visible = shallowRef(props.options.visible);
const isLoading = ref(false);

// 3.0> 关闭Dialog
const close = () => {
    isLoading.value = false;
    visible.value = false;
};

// 3.0> 操作按钮点击事件
const actionButtonClick = (button: DialogActionButton) => {
    props.options.actionButtonClick && props.options.actionButtonClick(button, close);
};
</script>

<!-- 
    Element plus样式重写
    el-dialog无法通过:deep穿透，因此此处设为全局，并以组件样式.dialog-html为防止全局污染
 -->
<style lang="scss">
.dialog-html {
    min-width: 22rem;
    .el-dialog__header {
        padding: 0.625rem 1.25rem;
        margin: 0;
        background-color: #d7e2ee;
    }
    .el-dialog__body {
        padding: 1.875rem;
    }
    .el-dialog__footer {
        padding: 1.875rem;
        padding-top: 0;
    }
}
</style>

<!-- 组件内样式 -->
<style lang="scss" scoped>
.title-bar {
    display: flex;
    align-items: center;
    flex-direction: row;
    .title {
        font-weight: bold;
        color: #333333;
        font-size: 1.25rem;
        margin-right: auto;
        align-items: center;
    }
    .close {
        cursor: pointer;
        width: 0.9375rem;
        height: 0.9375rem;
        margin-right: -0.3125rem;
    }
}

.action-button {
    display: flex;
    justify-content: center;
    > * {
        margin: 0 1.875rem;
    }
}
</style>
