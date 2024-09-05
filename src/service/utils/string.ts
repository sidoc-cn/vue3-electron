import { StringInterface } from "./string.d";

const first = (str: string, number: number): string => {
    if (str.length <= number) {
        return str;
    } else {
        return str.substring(0, number) + "...";
    }
};

export default <StringInterface>{
    first,
};
