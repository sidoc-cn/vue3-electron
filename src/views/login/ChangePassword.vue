<template>
    <el-form ref="ruleFormRef" :model="formData" :rules="formRules" class="global-form">
        <el-form-item label="原密码" :label-width="100" prop="oldPwd">
            <el-input v-model="formData.oldPwd" style="width: 12.5rem" type="password" show-password placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" :label-width="100" prop="newPwd1">
            <el-input v-model="formData.newPwd1" style="width: 12.5rem" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="100" prop="newPwd2">
            <el-input v-model="formData.newPwd2" style="width: 12.5rem" type="password" show-password placeholder="请输入确认密码" />
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormRules, FormInstance } from "element-plus";
import { InternalRuleItem } from "async-validator/dist-types/interface.d";

// 1.0> 表单数据 --------------------------------------------------------------------------------------------
const formData = reactive({
    userId: "",
    oldPwd: "",
    newPwd1: "",
    newPwd2: "",
});

// 2.0> 表单验证 --------------------------------------------------------------------------------------------
// 新密码与旧密码重复性校验
const newPwd1Validate = (rule: InternalRuleItem, value: string, callback: (error?: string | Error | undefined) => void) => {
    if (rule.field === "newPwd1" && formData.oldPwd === formData.newPwd1) {
        callback(new Error("新密码不能与原密码相同"));
    } else {
        callback();
    }
};
// 新密码与确认密码一致性校验
const newPwd2Validate = (rule: InternalRuleItem, value: string, callback: (error?: string | Error | undefined) => void) => {
    if (rule.field === "newPwd2" && formData.newPwd1 === formData.newPwd2) {
        callback();
    } else {
        callback(new Error("两次密码输入不一致"));
    }
};
// 表单验证基础规则
const formRules = reactive<FormRules>({
    oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
    newPwd1: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { validator: newPwd1Validate, trigger: "blur", required: true },
    ],
    newPwd2: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
        { validator: newPwd2Validate, trigger: "blur", required: true },
    ],
});

// 3.0> 表单提交 ---------------------------------------------------------------------------------------------
const ruleFormRef = ref<FormInstance>();
const submit = () => {
    return new Promise((resolve) => {
        if (!ruleFormRef.value || !ruleFormRef.value) return;
        ruleFormRef.value.validate((valid) => {
            if (valid) {
                httpPut(ServerType.Base, {
                    url: "/system/user/profile/updatePwd",
                    params: { oldPassword: formData.oldPwd, newPassword: formData.newPwd1 },
                    data: {},
                })
                    .then(() => {
                        messageSuccess("修改成功");
                        resolve(true);
                    })
                    .catch(() => {
                        resolve(false);
                    });
            } else {
                resolve(false);
            }
        });
    });
};

defineExpose({
    submit,
});
</script>
