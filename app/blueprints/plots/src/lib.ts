type ArrayOf<Type> = {
    [Property in keyof Type]: Type[Property][];
};
export const unzip = <T, K extends keyof T>(arr: T[], ...keys: K[]): Partial<ArrayOf<T>> => {
    const ret: Partial<ArrayOf<T>> = {};

    keys.forEach((k) => (ret[k] = []));
    arr.forEach((a) => {
        keys.forEach((k) => ret[k]!.push(a[k]));
    });
    return ret;
};
