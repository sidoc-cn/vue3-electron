// 全局声明

// 1.0> 路由类型 -----------------------------------------------------------------------------------
declare interface RouterType {
    name: string;
    path: string;
    hidden: boolean;
    redirect: string;
    component: string;
    alwaysShow: boolean;
    meta: RouterMetaType;
    children: RouterType[];
}

// 1.1> 路由Meta
declare interface RouterMetaType {
    title: string;
    icon: string;
    noCache: boolean;
    link?: string;
}

// 2.0> 用户信息 -----------------------------------------------------------------------------------
declare interface UserInfoType {
    /** 权限列表 */
    permissions: string[];

    /** 角色 */
    roles: string[];

    /** 用户 */
    user: UserType;
}

// 2.1> 用户基本信息
declare interface UserType {
    createBy: string;
    createTime: string;
    updateBy?: string;
    updateTime?: string;

    /** 用户ID */
    userId: number;

    deptId: number;

    /** 用户名 */
    userName: string;

    /** 昵称 */
    nickName: string;

    userType: string;
    email: string;

    /** 手机号 */
    phonenumber: string;

    /** 性别 */
    sex: string;

    /** 头像 */
    avatar: string;

    password: string;
    status: string;
    delFlag: string;

    /** 登录IP */
    loginIp: string;

    /** 登录日期 */
    loginDate: string;

    remark: string;
    attr1?: string;
    attr2?: string;
    attr3?: string;
    attr4?: string;
    attr5?: string;
    attr6?: string;
    attr7?: string;
    attr8?: string;
    attr9?: string;
    dept: DeptType;
    roles: RoleType[];
    roleIds?: string;
    postIds?: string;
    roleId?: string;
    admin: boolean;
}

// 2.2> 用户角色信息
declare interface RoleType {
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    roleId: number;
    roleName: string;
    roleKey: string;
    roleSort: number;
    dataScope: string;
    menuCheckStrictly?: string;
    deptCheckStrictly?: string;
    status: string;
    delFlag?: string;
    remark?: string;
    flag: boolean;
    menuIds?: string;
    deptIds?: string;
    permissions?: string;
    admin: boolean;
}

// 2.3> 用户其它信息
declare interface DeptType {
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    parentName?: string;
    parentId: number;
    children: string[];
    deptId: number;
    deptName: string;
    orderNum: number;
    leader: string;
    phone?: string;
    email?: string;
    status: string;
    delFlag?: string;
    ancestors: string;
}
