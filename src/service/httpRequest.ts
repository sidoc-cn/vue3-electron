import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import qs from "qs";
import { ElMessage } from "element-plus";
import router from "@/router";

// 创建axios实例
const service = axios.create({
    timeout: 30000, // 默认请求超时时间,单位：毫秒
    withCredentials: true,

    // URL参数提交前的序列化配置，序列化的格式有多种，例如：'indices'、'brackets'、'repeat'、'comma'，请根据需要选择
    paramsSerializer: {
        serialize: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    },
});

// 请求拦截
service.interceptors.request.use(
    (config) => {
        // 0.1> 请求头自定义
        config.headers.Authorization = "Bearer " + common.getToken();
        return config;
    },
    (error: AxiosError) => {
        Promise.reject(error);
    },
);

// 响应拦截
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data, headers } = response;

        if (data.code === 401) {
            common.signOut();
            router.replace("/login");
            return Promise.reject(data);
        }

        // 如果请求头中有"Full-Response"标志,表明该请求的发起者希望获取该请求的完整响应数据,因此直接返回
        const requestHeaders = response.config.headers["Full-Response"];
        if (requestHeaders) return data;

        // 全局错误处理
        if (data.code && data.code !== 200) {
            messageError(data.msg);
            return Promise.reject(data);
        }

        // 兼容没有code的接口返回
        if (data.code === undefined) {
            return {
                code: 200,
                data: data,
                msg: "",
                headers,
            };
        }
        return data;
    },
    (error: AxiosError) => {
        const { response } = error;
        if (response) {
            ElMessage.error("请求失败:" + response.status);
        }
        if (!window.navigator.onLine) {
            ElMessage.error("网络连接失败");
        }
        return Promise.reject(error);
    },
);

enum ServerType {
    /** 基础服务 */
    Base,

    /** 主业务服务 */
    Main,

    /** 不使用基地址，外部调用者自行拼接基地址 */
    Null,
}
export { ServerType };

// 拼接基地址
const getUrl = (server: ServerType, api: string): string => {
    let url = "";
    switch (server) {
        case ServerType.Base:
            url = import.meta.env.VITE_APP_BASE_URL + api;
            break;
        case ServerType.Main:
            url = import.meta.env.VITE_APP_BUSINESS_URL + api;
            break;
        default:
            url = api;
    }

    if (import.meta.env.VITE_APP_API_TYPE === "json") {
        // 接口为JSON时，则为url拼上.json后缀，并加时间戳，以阻止缓存
        url = url + ".json?t=" + Date.now();
    } else if (import.meta.env.VITE_APP_API_TYPE === "current") {
        // 接口为Current时，则从浏览器地址栏中取接口基地址
        url = window.location.protocol + "//" + window.location.hostname + ":" + url;
    }
    return url;
};

/**
 * 请求参数接口
 */
interface RequestParams {
    /**
     * 接口地址
     */
    url: string;

    /**
     * URL参数
     */
    params?: object;

    /**
     * Body参数
     */
    data?: object;

    /**
     * 更多请求配置
     */
    config?: AxiosRequestConfig;
}

/**
 * HTTP请求（如果要在请求中捕获异常，请实现catch）
 * @param server
 * @param param
 * @returns
 */
const http = <T>(server: ServerType, { method, url, params, data, config }: RequestParams & { method: string }) => {
    return service.request({ url: getUrl(server, url), method, params: { ...params }, data, ...config }).then((res) => {
        const data: T = res.data ? res.data : res;
        return data;
    });
};
export { http };

/**
 * Get请求（如果要在请求中捕获异常，请实现catch）
 * @param server
 * @param param
 * @returns
 */
const httpGet = <T>(server: ServerType, { url, params, config }: RequestParams) => {
    return service
        .get(getUrl(server, url), {
            params,
            ...config,
        })
        .then((res) => {
            const data: T = res.data ? res.data : res;
            return data;
        });
};
export { httpGet };

/**
 * Post请求
 * @param server
 * @param param
 * @returns
 */
const httpPost = <T>(server: ServerType, { url, params, data, config }: RequestParams) => {
    // 如果后端接口为JSON服务，则所有POST请求全部转为GET请求
    if (import.meta.env.VITE_APP_API_TYPE === "json") {
        return service.get(getUrl(server, url), { params: { ...params }, ...config }).then((res) => {
            const data: T = res.data ? res.data : res;
            return data;
        });
    } else {
        return service.post(getUrl(server, url), data, { params: params, ...config }).then((res) => {
            const data: T = res.data ? res.data : res;
            return data;
        });
    }
};
export { httpPost };

/**
 * Put请求
 * @param server
 * @param param
 * @returns
 */
const httpPut = (server: ServerType, { url, params, data, config }: RequestParams) => {
    return service.put(getUrl(server, url), data, { params: params, ...config }).then((res) => {
        const data = res.data ? res.data : res;
        return data;
    });
};
export { httpPut };

/**
 * Delete请求
 * @param server
 * @param param1
 * @returns
 */
const httpDelete = (server: ServerType, { url, params, data, config }: RequestParams) => {
    return service.delete(getUrl(server, url), { params: params, data: data, ...config }).then((res) => {
        const data = res.data ? res.data : res;
        return data;
    });
};
export { httpDelete };

/**
 * 文件下载、导出请求
 */
interface httpDownloadFileType {
    /** 请求方式 */
    method: string;
    /** 文件名称 */
    fileName?: string | null;
}
const httpDownloadFile = (server: ServerType, { method, url, params, data, fileName, config }: RequestParams & httpDownloadFileType) => {
    return service
        .request({ url: getUrl(server, url), method, params: { ...params }, data, responseType: "blob", ...config })
        .then((res) => {
            const link = document.createElement("a");
            if ("download" in link) {
                // 0.1> 获取文件名称
                if (fileName) {
                    link.download = fileName;
                } else if (res.headers["content-disposition"]) {
                    link.download = decodeURI(res.headers["content-disposition"].replace("attachment; filename=", ""));
                }
                if (link.download === "" || !link.download) {
                    const msg =
                        '无法获取到文件名称，请在服务端接口响应头中添加 "Access-Control-Expose-Headers":"Content-Disposition"，或在前端写死文件名称!';
                    messageError(msg);
                    return res;
                }

                // 0.2> 构建a标签
                const blob = new Blob([res.data], { type: res.headers["content-type"] }); // 将二进制流转为Blob
                link.href = URL.createObjectURL(blob);
                link.style.display = "none";

                // 0.3> 挂载a标签
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 0.4> 释放blob URL地址
                URL.revokeObjectURL(link.href);
            } else {
                messageError("下载时创建link元素失败");
            }
            return res;
        });
};
export { httpDownloadFile };
