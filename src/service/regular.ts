// 正则表达式

// 身份证验证
const idCard = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 密码(6-16英文+数字)
const passwordA = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

// 密码(6-16英文+数字+特殊字符)
const passwordB = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%.^&*])[\da-zA-Z~!@#$%.^&*]{6,16}$/;

// 手机号验证
const phone = /^1(3|4|5|6|7|8|9)\d{9}$/;

// 邮编
const postCode = /^[0-9]{6}$/;

// IP
const Ipv4 =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?$/;

// 纯汉字
const ChineseCharacter = /^[\u4E00-\u9FA5]+$/;

// 车牌号
const plateNum =
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;

// 小数验证，保留小数点后几位，如果调整保留位数，请调整正则最后{1,2}，改变2即可。
const decimal = /^((([^0][0-9]+|0)\.([0-9]{1,2}))$)|^(([1-9]+)\.([0-9]{1,2})$)/;

// 数字且小数点保留两位
const positiveNumberDecimal = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)[0,100]$/;

// 数字且小数点后最多2位
const numberAfterTwo = /^(\d+)(.\d{0,2})?$/;

// 6-20位首位为字母,字母,字母+数字组合
const userNameReg = /^[a-zA-Z]\w{5,19}$/;

// 数字0-100且小数点后最多2位
const numberRangeAfterTwo = /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$/;
/**
 * 正整数
 * positiveNumber0 包阔0
 * positiveNumber 不包阔0
 */
const positiveNumber0 = /[+]{0,1}(\d+)$/;
const positiveNumber = /^[1-9]\d*$/;

export default {
    idCard,
    passwordA,
    passwordB,
    phone,
    postCode,
    Ipv4,
    ChineseCharacter,
    // bankCardNum,
    plateNum,
    decimal,
    positiveNumber,
    positiveNumber0,
    positiveNumberDecimal,
    numberAfterTwo,
    numberRangeAfterTwo,
    userNameReg,
};
