/** Select选项接口 */
export interface SelectCommonOption {
    /** 选中项的值 */
    id: string;

    /** 选中项的显示名称 */
    name: string;

    /** 完整的option数据对象 */
    data?: unknown;
}

/** Select类型 */
enum SelectCommonType {
    /** Demo数据 */
    Demo = "demo",

    /** Demo1数据 */
    Demo1 = "demo1",

    /** cascaderData */
    CascaderDemo = "cascaderDemo",

    /** 角色 */
    Roles = "roles",

    /** 岗位 */
    Post = "Position",

    /** 人员状态 */
    Status = "sys_normal_disable",

    /**学历学位 */
    Education = "education",
}
export { SelectCommonType };

// 请求接口数据
const selectCommonLoadData = (type: SelectCommonType, params: Record<string, unknown> | undefined): Promise<SelectCommonOption[]> => {
    switch (type) {
        case SelectCommonType.Demo:
            return loadDemo();
        case SelectCommonType.Demo1:
            return loadDemo1(type, params);
        case SelectCommonType.CascaderDemo:
            return loadCascaderDemo(params);
        case SelectCommonType.Roles:
            return getAllRoles();
        case SelectCommonType.Post:
            return loadPostType();
        case SelectCommonType.Education:
            return loadEducationType();
        default:
            throw new Error("SelectCommon组件参数异常");
    }
};
export { selectCommonLoadData };

// 请在下方编写业务数据接口 *******************************************************************************************

// 0.0> 请求Demo数据，返回固定数据 ---------------------------------------------------------
const loadDemo = (): Promise<SelectCommonOption[]> => {
    return Promise.resolve([
        {
            name: "下拉1",
            id: "1",
        },
        {
            name: "下拉2",
            id: "3",
        },
    ]);
};

// 1.0 请求Demo数据，从接口动态返回数据 -----------------------------------------------------
const loadDemo1 = (type: SelectCommonType, params: Record<string, unknown> | undefined): Promise<SelectCommonOption[]> => {
    interface ResType {
        id: number;
        name: string;
        des: string;
    }
    return httpGet<ResType[]>(ServerType.Base, {
        url: "/select-data",
        params: {
            ...params,
        },
    }).then((data: ResType[]) => {
        const arr = new Array<SelectCommonOption>();
        data.forEach((item: ResType) => {
            arr.push({
                id: String(item.id),
                name: item.name,
                data: item,
            });
        });
        return arr;
    });
};

// 10.0> 请求Demo数据，用于演示SelectCommon组件的基本使用 -----------------------------------------------------
const loadCascaderDemo = (params: Record<string, unknown> | undefined): Promise<SelectCommonOption[]> => {
    return httpGet<SelectCommonOption[]>(ServerType.Null, {
        url: "/public/api-mock/cascader-data",
        params: params,
    }).then((res: SelectCommonOption[]) => {
        return res;
    });
};

/** 获取角色 */
const getAllRoles = (): Promise<SelectCommonOption[]> => {
    interface ResType {
        rows: RoleType[];
    }
    interface RoleType {
        roleName: string;
        roleId: string;
    }
    return httpGet<ResType>(ServerType.Base, {
        url: "/system/role/list",
        params: {
            pageNum: 1,
            pageSize: 100,
            roleName: "",
        },
    }).then((res: ResType) => {
        const arr = new Array<SelectCommonOption>();
        res.rows.forEach((item: RoleType) => {
            arr.push({
                id: String(item.roleId),
                name: item.roleName,
            });
        });
        return arr;
    });
};

/** 岗位类型 */
const loadPostType = (): Promise<SelectCommonOption[]> => {
    interface IResType {
        rows: { postId: number; postName: string }[];
    }
    return httpGet<IResType>(ServerType.Base, {
        url: "/system/post/list",
        params: {
            pageNum: 1,
            pageSize: 100,
        },
    }).then((res: IResType) => {
        const arr = new Array<SelectCommonOption>();
        res.rows.forEach((item) => {
            arr.push({
                id: String(item.postId),
                name: item.postName,
            });
        });
        return arr;
    });
};

/** 学历学位 */
const loadEducationType = (): Promise<SelectCommonOption[]> => {
    interface IResType {
        dictCode: number;
        dictLabel: string;
    }
    return httpGet<IResType[]>(ServerType.Base, {
        url: `/system/dict/data/type/xlxw`,
    }).then((res: IResType[]) => {
        const arr = new Array<SelectCommonOption>();
        res.forEach((item) => {
            arr.push({
                id: String(item.dictCode),
                name: item.dictLabel,
            });
        });
        return arr;
    });
};
