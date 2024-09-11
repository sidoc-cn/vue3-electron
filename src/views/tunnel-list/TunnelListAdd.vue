<template>
    <div class="tunnel-list-add">
        <el-form
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="auto"
            class="demo-ruleForm"
        >
            <el-form-item label="隧道名称" prop="pass">
                <el-input v-model="ruleForm.checkPass" style="width: 240px" placeholder="Please input" clearable />
            </el-form-item>
            <el-form-item label="协议类型" prop="pass">
                <el-select v-model="value" placeholder="Select" style="width: 240px">
                    <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" /> -->
                </el-select>
            </el-form-item>
            <el-form-item label="内网服务" prop="pass">
                <el-input v-model="ruleForm.checkPass" style="width: 240px" placeholder="Please input" clearable />
            </el-form-item>
            <el-form-item label="外网地址" prop="pass">
                <el-input v-model="ruleForm.checkPass" style="width: 240px" placeholder="Please input" clearable>
                    <template #append>c1.sidoc.cn</template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";

const ruleFormRef = ref<FormInstance>();

const value = ref("");
const options = ref([]);

const checkAge = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error("Please input the age"));
    }
    setTimeout(() => {
        if (!Number.isInteger(value)) {
            callback(new Error("Please input digits"));
        } else {
            if (value < 18) {
                callback(new Error("Age must be greater than 18"));
            } else {
                callback();
            }
        }
    }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("Please input the password"));
    } else {
        if (ruleForm.checkPass !== "") {
            if (!ruleFormRef.value) return;
            ruleFormRef.value.validateField("checkPass");
        }
        callback();
    }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === "") {
        callback(new Error("Please input the password again"));
    } else if (value !== ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
    } else {
        callback();
    }
};

const ruleForm = reactive({
    pass: "",
    checkPass: "",
    age: "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
    pass: [{ validator: validatePass, trigger: "blur" }],
    checkPass: [{ validator: validatePass2, trigger: "blur" }],
    age: [{ validator: checkAge, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log("submit!");
        } else {
            console.log("error submit!");
        }
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style lang="scss" scoped></style>
