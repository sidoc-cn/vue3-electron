// /** Select类型 */
// enum SelectCommonType {
//     /** Demo数据，用于演示SelectCommon组件的基本使用 */
//     Demo = "demo",

//     Demo1 = "demo1",
// }
// export { SelectCommonType };

// /** Select选项接口 */
// export interface SelectCommonOption {
//     id: string;
//     name: string;
// }

// // 请求接口数据
// const selectCommonLoadData = (type: SelectCommonType, params: Record<string, unknown> | undefined): Promise<SelectCommonOption[]> => {
//     switch (type) {
//         case SelectCommonType.Demo:
//             return loadDemo(params);
//         case SelectCommonType.Demo1:
//             return loadDemo1();
//         default:
//             return loadDemo(params);
//     }
// };
// export { selectCommonLoadData };

// // 请在下方编写业务数据接口 *******************************************************************************************

// // 0.0> 请求Demo数据 -----------------------------------------------------------------------------------------
// const loadDemo = (params: Record<string, unknown> | undefined): Promise<SelectCommonOption[]> => {
//     return httpGet<SelectCommonOption[]>(ServerType.Null, {
//         url: "/public/api-mock/select-data",
//         params: params,
//     }).then((res: SelectCommonOption[]) => {
//         return res;
//     });
// };

// // 1.0> 请求Demo数据 -----------------------------------------------------------------------------------------
// const loadDemo1 = (): Promise<SelectCommonOption[]> => {
//     const arr: Array<SelectCommonOption> = [
//         {
//             id: "1",
//             name: "通过",
//         },
//         {
//             id: "0",
//             name: "不通过",
//         },
//     ];
//     return Promise.resolve(arr);
// };
export {};
