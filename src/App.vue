<template>
    <router-view />
</template>

<script lang="ts" setup>
// 在主程序中通过ipcMain.handle注册的函数是异步执行的，其执行时会返回一个Promise对象
// 使用 await 调用主进程函数，以便直接返回主进程IPC函数的返回结果；
const response = await window.ipcRenderer.ping();
debugger;
console.log(response); // 打印 'pong'
</script>

<style lang="scss" scoped></style>
