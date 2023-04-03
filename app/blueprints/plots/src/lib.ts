type ArrayOf<Type> = {
    [Property in keyof Type]: Type[Property][];
};
// array of type T to an object of lists of attributes
// e.g. unzip([{a:1, b:2}, {a:3,b:4}], 'a', 'b') => {a:[1,3], b:[2,4]}
export const unzip = <T, K extends keyof T>(arr: T[], ...keys: K[]): Partial<ArrayOf<T>> => {
    const ret: Partial<ArrayOf<T>> = {};

    keys.forEach((k) => (ret[k] = []));
    arr.forEach((a) => {
        keys.forEach((k) => ret[k]!.push(a[k]));
    });
    return ret;
};
