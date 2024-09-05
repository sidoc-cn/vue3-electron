import { Router } from "vue-router";
import { CommonInterface, TreeNode } from "./common.d";
import { useGlobalStore } from "@/store/global";
import { v4 as uuidv4 } from "uuid";
import SparkMD5 from "spark-md5";
import html2canvas from "html2canvas";
import moment from "moment";

// 1.0> 判断设置类型，是否移动设备(如：手机、ipad等)
const isMobile = (): RegExpMatchArray | null => {
    const isMobile = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    );
    return isMobile;
};

// 3.0 判空：判断变量是否为空或
const isEmpty = function (value: unknown): boolean {
    if (value === undefined) {
        return true;
    } else if (value === null) {
        return true;
    } else if (typeof value === "string" && value.trim() === "") {
        return true;
    } else if (typeof value === "number" && isNaN(value) === true) {
        return true;
    } else if (typeof value === "number" && value === 0) {
        return true;
    } else if (value instanceof Array && value.length <= 0) {
        return true;
    }
    return false;
};

// 4.0 字节大小转换，将以字节(Byte)为单位的数字转为KB、KM、GB等
const byteSizeConversion = function (value: string | number): string {
    let pvalue = 0;
    if (typeof value === "string") {
        pvalue = parseFloat(value);
    }
    if (pvalue < 1024) {
        return pvalue + "B";
    } else if (pvalue >= 1024 * 1024 * 1024) {
        // GB
        return (pvalue / 1024 / 1024 / 1024).toFixed(2) + "GB";
    } else if (pvalue >= 1024 * 1024) {
        // MB
        return (pvalue / 1024 / 1024).toFixed(2) + "MB";
    } else if (pvalue >= 1024) {
        // KB
        return (pvalue / 1024).toFixed(2) + "KB";
    }
    console.error("_byteSizeConversion转换异常:" + value);
    return "";
};

// 5.0 时长转换，用于将毫秒转为ms、s、分钟、小时等
const durationConversion = function (value: string | number): string {
    let pvalue = 0;
    if (typeof value === "string") {
        pvalue = parseFloat(value);
    }

    if (pvalue < 1000) {
        return pvalue.toFixed(2) + " ms";
    } else if (pvalue >= 1000 * 60 * 60 * 24) {
        // 天
        return (pvalue / (1000 * 60 * 60 * 24)).toFixed(2) + " 天";
    } else if (pvalue >= 1000 * 60 * 60) {
        // 小时
        return (pvalue / (1000 * 60 * 60)).toFixed(2) + " 小时";
    } else if (pvalue >= 1000 * 60) {
        // 分钟
        return (pvalue / (1000 * 60)).toFixed(2) + " 分钟";
    } else if (pvalue >= 1000) {
        // s
        return (pvalue / 1000).toFixed(2) + " s";
    }
    console.error("_durationConversion转换异常:" + value);
    return "";
};

// 7.0> 在浏览器新标签中打开路由页面
// ! 不要直接使用window.open打开路由path对应的页面，因为只要任务的“publicPath”配置不为“/”，页面就会无法打开
const openPage = (router: Router, path: string, isNewWindow = true, params?: Record<string, string | number | null>) => {
    const routeUrl = router.resolve({
        path: path,
        query: params,
    });

    if (isNewWindow) {
        window.open(routeUrl.href, "_blank");
    } else {
        window.location.href = routeUrl.href;
    }
};

const getFullPath = (router: Router, path: string, params?: Record<string, string | number | null>) => {
    const routeUrl = router.resolve({
        path: path,
        query: params,
    });
    return routeUrl.href;
};

// 获取public下的静态文件路径（该路径在生产环境和开发环境下不同，因此需要工具方法以区别性获取）
const getStaticPath = (): string => {
    let path = "";
    if (import.meta.env.VITE_APP_ENV === "production") {
        path = "/static";
    } else {
        path = "/public/static";
    }
    return import.meta.env.VITE_APP_ENV_PATH + path;
};

// 保存页面状态
const savePageStatus = (data: object) => {
    // 存在页面数据至session中时，实测影响页面性能，因此保存数据要异步执行
    // 为了使每次保存或更新的数据尽量最小，因此每个页面要在session中保存一条数据
    const globalStore = useGlobalStore();
    globalStore.keepPageData.set(window.location.href, data);
};

// 获取页面状态
const getPageStatus = () => {
    const globalStore = useGlobalStore();
    return globalStore.keepPageData.get(window.location.href);
};

// 列表转tree
const listToTree = <T>(
    listData: Array<T & { id: string | number; parentId: string | number; children: Array<T> }>,
    parentId: string | number = -1,
): Array<T> => {
    const tree: Array<T> = [];
    listData.forEach((item) => {
        if (item.parentId === parentId) {
            const temp = listToTree(listData, item.id);
            if (temp.length > 0) {
                item.children = temp;
            }
            // 找到所有指定parentId的数据
            tree.push(item);
        }
    });
    return tree;
};

// tree转列表
const treeToList = <T>(treeData: Array<T & { children: Array<T> }>, listData: Array<T>) => {
    for (let i = 0; i < treeData.length; i++) {
        listData.push(treeData[i]);
        if (treeData[i].children && treeData[i].children.length > 0) {
            treeToList(treeData[i].children as Array<T & { children: T[] }>, listData);
        }
    }
};

// tree数据字段映射
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const treeMapping = (treeData: Array<any>, fields: Record<string, string>) => {
    for (let i = 0; i < treeData.length; i++) {
        treeData[i]["id"] = treeData[i][fields["id"] || "id"];
        treeData[i]["label"] = treeData[i][fields["label"] || "label"];
        treeData[i]["children"] = treeData[i][fields["children"] || "children"];

        if (treeData[i]["children"] && treeData[i]["children"].length > 0) {
            treeMapping(treeData[i]["children"], fields);
        }
    }
};

// 根据关键字搜索tree中数据，并获取搜索结果
const searchTree = (treeData: TreeNode[] | undefined, keyWord: string): TreeNode[] => {
    // 0.1> 判断节点是否匹配搜索关键字
    const isMatch = (node: TreeNode) => {
        if (node.label.match(keyWord)) return true;
        else return false;
    };
    if (!(treeData && treeData.length)) return [];

    // 0.2> 递归treeData
    const resultArr = [];
    for (const node of treeData) {
        if (isMatch(node)) {
            resultArr.push(node);
            node.children = searchTree(node.children, keyWord);
        } else {
            resultArr.push(...searchTree(node.children, keyWord));
        }
    }
    return resultArr.length ? resultArr : [];
};

//  图片转base64
const imageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const imageElement = new Image();
        imageElement.setAttribute("crossOrigin", "anonymous"); // 解决跨域问题
        imageElement.src = url;
        imageElement.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
            }
            const quality = 0.8; // base64图片质量，取值范围是0~1
            const base64 = "image://" + canvas.toDataURL("image/png", quality);
            resolve(base64);
        };
    });
};

/**
 * base64转图片
 * @param File 图片文件对象
 */
const base64ToImage = (base64: string, imageName: string): File => {
    // 移除 base64 数据中可能的前缀
    const base64WithoutPrefix = base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    // 解码 base64 数据
    const decodedData = atob(base64WithoutPrefix);

    // 创建 Uint8Array
    const byteArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
        byteArray[i] = decodedData.charCodeAt(i);
    }

    // 创建 Blob
    const blob = new Blob([byteArray], { type: "image/png" });

    // 创建 File
    const file = new File([blob], imageName + ".png", { type: blob.type });

    return file;
};

// 下载File对象
const downloadFile = (file: File) => {
    // 创建下载链接
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // 将链接添加到页面并触发点击
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

// 对象字段映射
const objectMapping = <T>(objArray: [], fields: Record<string, string>): T[] => {
    const resultArr: Array<T> = [];
    objArray.forEach((obj) => {
        const result: Record<string, unknown> = {};
        for (const key in obj as object) {
            const targetKey = fields[key];
            if (targetKey) {
                result[targetKey] = obj[key];
            }
        }
        resultArr.push(result as T);
    });
    return resultArr;
};

// 创建UUID
const uuid = () => {
    return uuidv4();
};

// 计算字符串的MD5
const md5 = (data: string) => {
    return SparkMD5.hash(data);
};

/**
 * 获取dom元素的高度
 * @param divElement
 * @returns number dom高度
 */
const getHeight = (divElement: HTMLElement) => {
    // 判断DIV元素是否有溢出内容
    if (divElement.scrollHeight > 0) {
        // 最后得到的高度为原始高度 + 滚动条的高度

        // return divElement.clientHeight + divElement.scrollHeight;
        return divElement.scrollHeight;
    } else {
        // 没有溢出内容时，直接返回原始高度

        return divElement.clientHeight;
    }
};

/**
 * 通过DOM元素生成图片
 * @param element 要截图的dom对象
 * @param options options.name 截图的名字 默认为"img" options.type 生成图片格式  默认png格式  支持 png jpeg webp
 */
const html2Image = (element: HTMLElement, options?: { name?: string; type?: string }) => {
    const height = getHeight(element);
    html2canvas(element, {
        allowTaint: true, // 图片跨域设置
        height: height,
        scale: 1,
        windowHeight: height + 60, // 渲染图片时 图片的高度和内容的高度不一致 导致生成图片的内容不完整 60为补充高度使生成图片完整
    }).then(function (canvas) {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/" + (options?.type || "png"));

        const name = "页面截图-" + moment().format("YYYYMMDDHHmmss");
        a.download = options?.name || name;

        a.click();
    });
};

// 四舍五入保留指定长度的小数，兼容所有异常
const toFixed = (value: unknown, decimalPlaces: number, defaultValue?: unknown) => {
    try {
        const v = Number(value); // Number将给定值转为数字，但给定值为null时，Number()的转为结果为0
        if (value === null || value === undefined) {
            throw new Error("无法转换");
        } else if (isNaN(v)) {
            throw new Error("无法转换");
        } else {
            return v.toFixed(decimalPlaces);
        }
    } catch (error) {
        console.error(error);
        if (defaultValue === undefined) return value;
        else return defaultValue;
    }
};

export default <CommonInterface>{
    isMobile,
    isEmpty,
    html2Image,
    byteSizeConversion,
    durationConversion,
    openPage,
    getFullPath,
    getStaticPath,
    savePageStatus,
    getPageStatus,

    listToTree,
    treeToList,
    treeMapping,
    searchTree,

    imageToBase64,
    base64ToImage,
    downloadFile,

    objectMapping,

    uuid,
    md5,
    toFixed,
};
