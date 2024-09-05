import { ElMessage } from "element-plus";

// 提示消息

const messageError = (msg: string) => {
    ElMessage.error(msg);
};

const messageSuccess = (msg: string) => {
    ElMessage.success(msg);
};

const messageWarning = (msg: string) => {
    ElMessage.warning(msg);
};

const messageInfo = (msg: string) => {
    ElMessage.info(msg);
};

//! 通过如下方式直接导出函数，这样在全局自动按需引入后，就可以直接进行调用
export { messageError, messageSuccess, messageWarning, messageInfo };
