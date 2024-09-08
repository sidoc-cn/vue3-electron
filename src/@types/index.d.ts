// 全局声明

/** 1.0> 用户信息 ---------------------------------------------------------------------- */
declare interface UserInfo {
    /** 用户ID */
    userId: number;

    /** 用户名 */
    userName: string;

    /** 昵称 */
    nickName: string;

    /** 邮箱 */
    email: string;

    /** 手机号 */
    phoneNumber: string;

    /** 性别 */
    sex: string;

    /** 头像 */
    avatar: string;

    /** 登录IP */
    loginIp: string;
}

/** 2.0> 计费方式 -------------------------------------------------------------------- */
declare enum CalculationMethod {
    /** 固定带宽 */
    FixedBandwidth,

    /** 按量付费 */
    PayPerUse,
}

/** 3.0> 客户服务方式 -------------------------------------------------------------------- */
declare enum CustomerServiceMethod {
    /** 微信交流群 */
    WeChatGroup,

    /** 客服/技术支持 */
    CustomerService,
}
