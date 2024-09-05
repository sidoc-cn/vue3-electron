export type DialogOptions = {
    /** 标题 */
    title: string;

    /** 文本内容 */
    content?: string;

    /** HTML内容 */
    contentHtml?: string;

    /** 备注 */
    remark?: string;

    /** 确定按钮名称，默认为“确定” */
    confirmButtonText?: string;

    /** 取消按钮名称，默认为"取消" */
    cancelButtonText?: string;

    /** 弹框关闭前的回调 */
    beforeClose: (action: string, done: () => void) => void;
};

import { ElMessageBox } from "element-plus";
const confirm = (options: DialogOptions) => {
    const content = options.content || options.contentHtml;

    return ElMessageBox.confirm(content || "？？？？", {
        title: options.title,
        confirmButtonText: options.confirmButtonText || "确认",
        cancelButtonText: options.cancelButtonText || "取消",
        type: "warning",
        draggable: true,
        dangerouslyUseHTMLString: options.contentHtml ? true : false,

        // 弹窗关闭并回调
        beforeClose: (action, instance, done) => {
            options.beforeClose(action, done);
        },
    })
        .then(() => {
            // 确认回调
        })
        .catch(() => {
            // 取消回调
        });
};

export default confirm;
