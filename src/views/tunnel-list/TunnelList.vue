<template>
    <div class="tunnel-list">
        <div class="operation-bar">
            <div class="left">
                <div class="">隧道列表</div>
            </div>
            <div class="right">
                <el-button v-auth="'add'" class="add" type="primary" @click="addOrEidt()">添加隧道</el-button>
            </div>
        </div>
        <el-table>
            <el-table-column label="序号" width="60" align="center">
                <template #default="scope">
                    {{ scope.index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="隧道名称" align="center">
                <template #default="scope">
                    <el-link v-auth="'view'" class="view" :underline="false" type="primary">
                        {{ scope.row.name }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="roleNames" label="服务器" align="center" />
            <el-table-column prop="userState" label="协议类型" align="center" />
            <el-table-column prop="createUserName" label="内网服务" align="center" />
            <el-table-column prop="createUserName" label="外网访问地址" min-width="100px" align="center" />
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-link v-auth="'edit'" class="edit" :underline="false" type="primary" @click="edit(scope.row)">启动/停止</el-link>
                    <el-link v-auth="'edit'" class="edit" :underline="false" type="primary" @click="edit(scope.row)">编辑</el-link>
                    <el-link v-auth="'delete'" class="delete" :underline="false" type="danger">删除</el-link>
                    <!-- <el-link v-auth="'reset'" class="save" :underline="false" type="primary">重置密码</el-link> -->
                </template>
            </el-table-column>
        </el-table>

        <DialogHtml :options="dialogConfig">
            <TunnelListAdd />
        </DialogHtml>
    </div>
</template>

<script lang="ts" setup>
import TunnelListAdd from "./TunnelListAdd.vue";
const test = ref("");

onMounted(() => {
    console.log("1");
});

const dialogConfig: import("@/components/dialog-html/DialogHtml.vue").DialogProps = {
    title: ref("标题"),
    visible: ref(false),
    width: "500px",
    actionButton: [
        { key: "cancel", type: DialogActionButtonType.Default, text: "取消", status: DialogActionButtonStatus.Default },
        { key: "confirm", type: DialogActionButtonType.Primary, text: "确认", status: DialogActionButtonStatus.Default },
    ],
    actionButtonClick: (button: import("@/components/dialog-html/DialogHtml").DialogActionButton, done: () => void) => {
        if (button.key === "cancel") return done();
        // TO DO
    },
};

const addOrEidt = () => {
    dialogConfig.visible.value = true;
};
</script>

<style lang="scss" scoped>
.tunnel-list {
    margin-top: 40px;
    background: rgb(232, 255, 253);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .operation-bar {
        display: flex;
        justify-content: space-between;
    }
}
</style>
