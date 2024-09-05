// 通用工具函数

interface TreeNode {
    /** 树节点ID */
    id: number;

    /** 树节点名称 */
    label: string;

    /** 子节点 */
    children?: TreeNode[];
}

export interface CommonInterface {
    /**
     * 判断设置类型，是否移动设备(如：手机、ipad等)
     * @return 如果是移动设备，则返回移动设备的的型号数组；如果不是移动设备，则返回null
     */
    isMobile(): RegExpMatchArray | null;

    /**
     * 通过DOM元素生成图片
     * @param element DOM对象
     * @param options options.name 截图的名字 默认为"img" options.type 生成图片格式  默认png格式  支持 png jpeg webp
     */
    html2Image(element: HTMLElement, options?: { name?: string; type?: string }): void;

    /**
     * 判空：判断变量或对象是否为空
     * @param value
     * @return 为空时返回true, 不为空返回false
     */
    isEmpty(value: unknown): boolean;

    /**
     * 字节大小转换，将以字节(Byte)为单位的数字转为KB、KM、GB等
     * @param value
     * @return 返回以KB或KM或GB为单位的转换结果
     */
    byteSizeConversion(value: string | number): string;

    /**
     * 时长转换，用于将毫秒转为ms、s、分钟、小时等
     * @param value
     */
    durationConversion(value: string | number): string;

    /**
     * 在浏览器新标签中打开页面
     *
     * ! 不要直接使用window.open打开路由path对应的页面，因为只要任务的“publicPath”配置不为“/”，页面就会无法打开
     * @param router
     * @param path
     * @param isNewWindow 是否在新窗口打开，默认为true
     * @param params
     */
    openPage(router: Router, path: string, isNewWindow?: boolean, params?: Record<string, string | number | null>);

    /**
     * 获取路由path对应的完整path，即：publicPath + 路由path
     *
     * ! 不要直接使用路由path对应的页面，因为只要任务的“publicPath”配置不为“/”，获取到的页面path就是不完整的
     * @param router
     * @param path
     * @param params
     */
    getFullPath(router: Router, path: string, params?: Record<string, string | number | null>);

    /**
     * 获取public下的静态文件路径（该路径在生产环境和开发环境下不同，因此需要工具方法以区别性获取）
     */
    getStaticPath(): string;

    /**
     * 保存页面状态
     * @param data 页面状态数据
     * @param routerPath 页面路由path
     */
    savePageStatus(data: object);

    /**
     * 获取页面状态
     * @param routerPath 页面路由path
     * @return 页面状态数据
     */
    getPageStatus(): unknown;

    /**
     * 列表转tree
     *
     * ! 必须确保数据对象中存在属性id、parentId、children
     *
     * @param listData 列表数据(一维数组)
     * @param parentId 根节点的父ID
     */
    listToTree(listData: Array<T>, parentId?: string | number): Array<T>;

    /**
     * tree转列表
     * ! tree节点的子节点属性名称必须为“children”
     *
     * @使用示例 const list = [];  // 转换后的结果
     *          utils.common.treeToList(treeData, list);
     *
     * @param treeData 具有层级关系的tree数据
     * @param pidFieldName 数据中表示父节点ID的字段名称
     */
    treeToList(treeData: Array<T & { children: Array<T> }>, listData: Array<T>);

    /**
     * tree数据字段映射
     *
     * @使用示例 utils.common.treeMapping(treeData, { id: "path", label: "name" })
     *
     * @param objArray 原数组对象
     * @param fields 字段映射对应表：<对象现有的字段名称, 转换后的字段名称>
     */
    treeMapping(treeData: Array<T>, fields: Record<string, string>);

    /**
     * 搜索tree树数据（根据关键字搜索tree数据，并返回搜索结果）
     * @param treeData tree数组对象
     * @param keyWord 搜索关键字
     */
    searchTree(treeData: TreeNode[] | undefined, keyWord: string): TreeNode[];

    /**
     * 根据子节点ID搜索tree父节点数据
     * @param treeData tree数组对象
     * @param keyWord 搜索关键字
     */
    searchTree(treeData: TreeNode[] | undefined, keyWord: string): TreeNode[];

    /**
     * 图片转base64
     * @param url 图片路径
     */
    imageToBase64(url: string): Promise<string>;

    /**
     * base64转图片
     * @param File 图片文件对象
     */
    base64ToImage(base64: string, imageName: string): File;

    /**
     * 下载File对象
     * @param file 要下载的File对象
     */
    downloadFile(file: File): void;

    /**
     * 对象字段转换映射
     *
     * @使用示例 将treeData数据中的属性orgId映射成id、orgName映射成label、list映射成children；
     * utils.common.treeMapping(treeData, {
     *      id: "orgId",
     *      label: "orgName",
     *      children: "list",
     * });
     *
     * @param objArray  原数组对象
     * @param fields   字段映射对应表：<对象现有的字段名称, 转换后的字段名称>
     */
    objectMapping(objArray: T[], fields: Record<string, string>);

    /**
     * 生成UUID
     */
    uuid();

    /**
     * 获取指定字符串的MD5
     * @param data
     */
    md5(data: string);

    /**
     * 四舍五入保留指定长度的小数，兼容所有异常
     * @param value 要四舍五入的值
     * @param decimalPlaces 要保留的小数位数
     * @param defaultValue 默认值
     */
    toFixed(value: unknown, decimalPlaces: number, defaultValue?: unknown): number;
}
