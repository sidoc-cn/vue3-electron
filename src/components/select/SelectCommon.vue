<template>
    <el-select class="select-common" v-model="value" size="default" clearable="clearable" :disabled="disabled">
        <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script lang="ts" setup>
import { SelectCommonType, SelectCommonOption, selectCommonLoadData } from "./SelectCommon";

const props = defineProps({
    /** v-model的绑定值 */
    modelValue: {
        type: [String, Number, Array],
        default: () => "",
    },
    /** options下拉选项业务类型，需在SelectCommon.ts文件中添加 options 数据源 */
    optionsType: {
        type: String,
        required: true,
    },
    /** options下拉选项请求参数，此参数是获取options下拉列表时的辅助参数，此参数的变化会实时触发options列表的重新加载 */
    optionsRequestParams: {
        type: Object,
        default: () => null,
    },
    /** 是否启用默认选中项；为true时，当v-model未匹配到任何options选项时，将默认使用下拉列表中第一个options项作为默认值 */
    isDefaultSelected: {
        type: Boolean,
        required: false,
    },
    /** 是否显示清理按钮（没有此参数，外部的） */
    clearable: {
        type: Boolean,
        required: false,
    },
    /** 是否禁用 */
    disabled: {
        type: Boolean,
        required: false,
    },
});

// 0.0> 本地数据 --------------------------------------------------------------------------------
const value = ref(props.modelValue);

// 0.1> 声明外部回调方法
const emit = defineEmits([
    "update:modelValue", // 更新v-model绑定值
    "optionChange", // 下拉选择变化时的回调，此回调能返回完整的选中项对象
    "optionLoadingCompleted", // options下拉数据加载完成或重新加载完成后的回调
]);

// 1.0> 监听外部v-model值变化，并更新当前组件中的选中项 -----------------------------------------------
watch(
    () => props.modelValue,
    () => {
        if (props.modelValue instanceof Array) {
            value.value = props.modelValue;
        } else {
            value.value = String(props.modelValue);
        }
    },
);

// 2.0> 监听下拉选择项变化 -------------------------------------------------------------------------
watch(value, (newValue) => {
    // 双向绑定值更新
    emit("update:modelValue", newValue);

    // 找出当前选中项的完整数据对象，并回调到外部
    let arr: SelectCommonOption[] = [];
    arr = options.filter((item) => {
        if (newValue instanceof Array) {
            // 多选
            return newValue.includes(item.id) == true;
        } else {
            // 单选
            return newValue == item.id;
        }
    });
    emit("optionChange", arr);
});

// 3.0> 监听options请求参数变化，并更新options下拉选项 -----------------------------------------------
watch(props.optionsRequestParams, () => loadOptionsData());

// 4.0> 请求option下拉数据 -----------------------------------------------------------------------
const options = reactive<Array<SelectCommonOption>>([]);
const loadOptionsData = () => {
    selectCommonLoadData(props.optionsType as SelectCommonType, props.optionsRequestParams).then((data: SelectCommonOption[]) => {
        options.length = 0;
        options.push(...data);

        // 配置默认值
        if (props.isDefaultSelected && options.length > 0) {
            if (props.modelValue instanceof Array) {
                // 多选
                let arr = value.value as Array<string>;
                arr.length = 0;
                arr.push(options[0].id);
            } else {
                // 单选
                value.value = options[0].id;
            }
        }

        // 通知外部：options下拉列表数据已加载完成
        emit("optionLoadingCompleted", options);
    });
};
loadOptionsData();
</script>

<style lang="scss" scoped>
.select-common {
    width: 100%;
}
</style>
