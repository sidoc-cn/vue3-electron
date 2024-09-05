import { NumberInterface } from "./number.d";

const toFixed = (number: number, digits: number): string => {
    digits = parseInt(String(digits));
    const arr = String(number).split(".");

    // 判断原娄字小数位是否大于指定的小数位长度
    if (arr.length > 1 && arr[1].length > digits) {
        return number.toFixed(digits);
    }

    return String(number);
};

export default <NumberInterface>{
    toFixed,
};
