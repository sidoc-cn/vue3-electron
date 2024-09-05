export interface StringInterface {
    /**
     * 获取字符串前n个字符组成的子字符串
     *
     * @param string 字符串
     * @param number 子字符串长度
     * @return 子字符串
     */
    first(str: string, number: number): string;
}
