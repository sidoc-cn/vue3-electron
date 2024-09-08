<template>
    <div class="account-info">
        <!-- Tab栏 ------------------------- -->
        <div class="tab-bar">
            <div>固定带宽</div>
            <div>按量付费</div>

            <!-- 账户功能 --------------------------- -->
            <div class="account-function">
                <div>免费与付费</div>
                <div>导出配置</div>
                <div>下载客户端</div>
                <div>访问官网</div>
                <div>
                    <img src="@/assets/logo.png" />
                    张三
                </div>
            </div>
        </div>

        <!-- 套餐信息 ------------- -->
        <div class="package-info">
            <div>带宽：2Mbps</div>
            <div>隧道数：1/10</div>
        </div>

        <!-- 底部宣传信息和服务支持 ---------------- -->
        <div class="bottom-part">
            <!-- 宣传信息 -->
            <div class="advertisement">无限流量/无限并发/全平台支持/点对点组网/自定义域名/固定域名/固定IP/固定端口</div>

            <!-- 服务支持 -->
            <div class="service-support">
                <div>
                    <img src="@/assets/logo.png" />
                    微信交流群
                </div>
                <div>
                    <img src="@/assets/logo.png" />
                    客服/技术支持
                </div>
            </div>
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
.account-info {
    display: flex;
    flex-direction: column;
    background: rgb(254, 136, 136);
    height: 100px;

    // 1.0> Tab栏 ---------------------------------------------------------------
    .tab-bar {
        display: flex;
        background-color: rgb(206, 206, 206);
        > * {
            padding: 2px 10px;
        }
    }

    // 2.0> 账户功能 ------------------------------------------------------------
    .tab-bar > .account-function {
        margin-left: auto;
        display: flex;
        > * {
            display: flex;
            align-items: center;
            padding: 2px 8px;
            font-size: 15px;
            img {
                width: 20px;
                margin-right: 4px;
            }
        }
    }

    // 3.0> 套餐信息 ------------------------------------------------------------
    .package-info {
        display: flex;
    }

    // 4.0> 底部宣传信息和服务支持
    .bottom-part {
        display: flex;
        margin-top: auto;
        font-size: 14px;
        color: gray;

        // 优势或宣传信息
        .advertisement {
            padding: 10px;
        }

        // 服务支持
        .service-support {
            display: flex;
            margin-left: auto;
            > * {
                display: flex;
                align-items: center;
                padding: 0px 4px;
                img {
                    width: 20px;
                    margin-right: 2px;
                }
            }
        }
    }
}
</style>
