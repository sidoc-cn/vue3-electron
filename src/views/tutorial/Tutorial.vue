<template>
    <div class="tutorial">
        <div class="title-bar">使用教程</div>
        <div class="log-content">
            <div class="item">游戏联机</div>
            <div class="item">点对点直连</div>
            <div class="item">远程桌面</div>
            <div class="item">Web服务映射</div>
            <div class="item">SSH服务映射</div>
            <div class="item">Linux同使用</div>
            <div class="item">常见问题</div>
            <div class="item">官方文档</div>
            <div class="item">其它使用方法</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const test = ref("");

onMounted(() => {
    console.log("1");
});
</script>

<style lang="scss" scoped>
.tutorial {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 218, 218);
    width: 320px;
    .title-bar {
        display: flex;
        background-color: gray;
    }
    .log-content {
        display: flex;
        display: grid;
        // grid-template-columns: 33.33% 33.33% 33.33%;
        grid-template-columns: 50% 50%;
        background-color: rgb(226, 226, 226);
        .item {
            cursor: pointer;
            font-size: 15px;
            padding: 4px 20px;
            &:hover {
                color: blue;
            }
        }
    }
}
</style>
