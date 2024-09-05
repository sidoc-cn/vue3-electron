export interface NumberInterface {
    /**
     * 将数字保留指定位数，如果数字的实际小数位小于指定位数，则直接返回原数字
     *
     * @param number 需处理的数字
     * @param digits 小数点后数字的个数
     * @return 字符串
     */
    toFixed(number: number, digits: number): string;
}
