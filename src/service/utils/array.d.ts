export interface ArrayInterface {
    /**
     * 分割数组：将数组元素分割成指定长度的多个数组
     *
     * @example
     *  示例：utils.array.chunk([1, 2, 3, 4, 5, 6, 7], 2)
     *  结果：[[1,2],[3,4],[5,6],[7]]
     *
     * @param array 需要分割的数组
     * @param size  每个数组的长度
     * @return 分割后的新数组
     */
    chunk(array: Array<T>, size: number): Array<Array<T>>;

    /**
     * 过滤假值：删除数组中的所有'假值'，如：NaN、false、null、0、""、undefined等
     *
     * @example
     *  示例：utils.array.compact([0, 1, 2, 3, 4])
     *  结果：[1,2,3,4]
     *
     * @param array 原数据
     * @return 过滤后的新数组
     */
    compact(array: Array<T>): Array<T>;

    /**
     * 删除数组中指定元素
     *
     * @example
     *  示例：utils.array.remove([1, 2, 3], 2, 3)
     *  结果：[1]
     *
     * @param array 原数组
     * @param values 需删除的元素(支持多个)
     * @return 返回删除后的新数组
     */
    remove(array: Array<T>, ...values: Array<T>): Array<T>;

    /**
     * 删除数组中前n个元素(n默认值为1)
     *
     * @param array 原数组
     * @param n 要删除的元素个数（默认1）
     * @return 返回删除后的新数组
     */
    removeFirst(array: Array<T>, n?: number): Array<T>;

    /**
     * 删除数组后n个元素(n默认值为1)
     *
     * @param array 原数据
     * @param n 要删除的元素个数（默认1）
     * @return 返回删除后的新数组
     */
    removeLast(array: Array<T>, n?: number): Array<T>;

    /**
     * 多维数组转一维数组
     *
     * @param array 原数据
     * @return 返回一个新的一维数组
     */
    flattenDeep(array: Array<T>): Array<T>;

    /**
     * 获取数组中第一个元素
     *
     * @param array 原数据
     * @return 数组中第一个元素
     */
    first(array: Array<T>);

    /**
     * 获取数组中最后一个元素
     *
     * @param array 原数据
     * @return 数组中最后一个元素
     */
    last(array: Array<T>);

    /**
     * 根据索引获取数组元素（兼容数组溢出等各种错误）
     *
     * @param array
     * @param index
     */
    findByIndex(array: Array<T>, index: number): T | undefined;
}
