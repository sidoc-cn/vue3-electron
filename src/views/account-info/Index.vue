<template>
    <div class="account-info-index">
        <!-- Tab栏 ------------------------- -->
        <div class="tab-bar">
            <!-- tab按钮 -->
            <div class="tab" @click="globalStore.calculationMethod = CalculationMethod.FixedBandwidth">固定带宽</div>
            <div class="tab" @click="globalStore.calculationMethod = CalculationMethod.PayPerUse">按量付费</div>

            <!-- 账户功能 --------------------------- -->
            <div class="account-function">
                <div class="item">免费与付费</div>
                <div class="item">导出配置</div>
                <div class="item">下载客户端</div>
                <div class="item">访问官网</div>
                <el-dropdown>
                    <span class="item el-dropdown-link">
                        <img src="@/assets/logo.png" />
                        张三
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>社交账号</el-dropdown-item>
                            <el-dropdown-item>意见反馈</el-dropdown-item>
                            <el-dropdown-item divided @click="common.signOut(router)">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <!-- 套餐信息 ------------- -->
        <PackageInfo />

        <!-- 底部宣传信息和服务支持 ---------------- -->
        <div class="bottom-part">
            <!-- 宣传信息 -->
            <div class="advertisement">无限流量/无限并发/全平台支持/点对点组网/自定义域名/固定域名/固定IP/固定端口</div>

            <!-- 服务支持 -->
            <div class="service-support">
                <div @click="openWeChatSupport(CustomerServiceMethod.WeChatGroup)">
                    <img src="@/assets/logo.png" />
                    微信交流群
                </div>
                <div @click="openWeChatSupport(CustomerServiceMethod.CustomerService)">
                    <img src="@/assets/logo.png" />
                    客服/技术支持
                </div>
            </div>
        </div>
    </div>

    <!-- 微信讨论群/技术支持 -->
    <DialogHtml :options="dialogConfig">
        <WeChatSupport :type="weChatSupportMethod" />
    </DialogHtml>
</template>

<script lang="ts" setup>
import { CalculationMethod, CustomerServiceMethod } from "@/@types/global";
import PackageInfo from "./PackageInfo.vue";
import WeChatSupport from "./WeChatSupport.vue";
import { useGlobalStore } from "@/store/global";

const globalStore = useGlobalStore();
const router = useRouter();

// 微信讨论群/技术支持
const weChatSupportMethod = ref(CustomerServiceMethod.WeChatGroup); //
const dialogConfig: import("@/components/dialog-html/DialogHtml.vue").DialogProps = {
    title: ref("标题"),
    visible: ref(false),
    width: "30%",
    actionButton: [],
};
const openWeChatSupport = (type: CustomerServiceMethod) => {
    // type的值为：discussion_group(微信交流群)、customer_service(技术支持)
    weChatSupportMethod.value = type;
    dialogConfig.visible.value = true;
};

// 监听主进程消息
window.ipcRenderer.on("main-process-message", (_event, ...args) => {
    console.log("[收到主进程消息]:", ...args);
});
</script>

<style lang="scss" scoped>
.account-info-index {
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
            cursor: pointer;
        }
    }

    // 2.0> 账户功能 ------------------------------------------------------------
    .tab-bar > .account-function {
        margin-left: auto;
        display: flex;
        .item {
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
                cursor: pointer;
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
