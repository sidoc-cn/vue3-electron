import lodash from "lodash";
import { ArrayInterface } from "./array.d";

// 分割数组
const chunk = <T>(array: Array<T>, size: number): Array<Array<T>> => {
    return lodash.chunk(array, size);
};

// 过滤数组中的'假值'
const compact = <T>(array: Array<T>): Array<T> => {
    return lodash.compact(array);
};

// 删除数组中指定元素
const remove = <T>(array: Array<T>, ...values: Array<T>): Array<T> => {
    return lodash.pull(array, ...values);
};

// 删除数组中前n个元素(n默认值为1)
const removeFirst = <T>(array: Array<T>, n?: number): Array<T> => {
    return lodash.drop(array, n);
};

// 删除数组后n个元素(n默认值为1)
const removeLast = <T>(array: Array<T>, n?: number): Array<T> => {
    return lodash.dropRight(array, n);
};

// 多维数组转一维数组
const flattenDeep = <T>(array: Array<T>): Array<T> => {
    return lodash.flattenDeep(array);
};

// 获取数组中第1个元素
const first = <T>(array: Array<T>): T | undefined => {
    return lodash.head(array);
};

// 获取数组中最后1个元素
const last = <T>(array: Array<T>): T | undefined => {
    return lodash.last(array);
};

// 根据索引获取数组元素
const findByIndex = <T>(array: Array<T>, index: number): T | undefined => {
    if (array && array instanceof Array && array.length > index) {
        return array[index];
    }
    return undefined;
};

export default <ArrayInterface>{
    chunk,
    compact,
    remove,
    removeFirst,
    removeLast,
    flattenDeep,
    first,
    last,
    findByIndex,
};
