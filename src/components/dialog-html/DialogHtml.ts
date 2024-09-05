// 按钮样式 -----------------------------------------------------------------------------------
enum DialogActionButtonType {
    /** 默认样式 */
    Default = "default",

    /** 基本样式 */
    Primary = "primary",

    /** 警告样式 */
    Warning = "warning",

    /** 危险样式 */
    Danger = "danger",
}
export { DialogActionButtonType };

// 按钮状态 -----------------------------------------------------------------------------------
enum DialogActionButtonStatus {
    /** 默认状态 */
    Default = "default",

    /** 加载状态 */
    Loading = "loading",

    /** 禁用状态 */
    Disabled = "disabled ",
}
export { DialogActionButtonStatus };

// 按钮定义 -----------------------------------------------------------------------------------
export interface DialogActionButton {
    /** 按钮key,用于唯一区分一个按钮 */
    key: string;

    /** 按钮类型 */
    type: DialogActionButtonType;

    /** 按钮状态 */
    status: DialogActionButtonStatus;

    /** 按钮显示的文本 */
    text?: string;

    /** 按钮图标 */
    icon?: string;
}
