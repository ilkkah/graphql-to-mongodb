export declare enum SetOverwrite {
    DefaultTrueRoot = 0,
    True = 1,
    False = 2
}
export interface UpdateArgs {
    setOnInsert?: object;
    set?: object;
    inc?: object;
}
export interface UpdateObj {
    $setOnInsert?: SetOnInsertObj;
    $set?: SetObj;
    $inc?: IncObj;
}
export interface SetOnInsertObj {
    [key: string]: SetOnInsertObj | any;
}
export interface SetObj {
    [key: string]: SetObj | any;
}
export interface IncObj {
    [key: string]: number;
}
export interface updateParams {
    update: UpdateObj;
    options?: {
        upsert?: boolean;
    };
}
export declare const getMongoDbUpdate: (update: UpdateArgs, overwrite?: boolean) => updateParams;
export declare function getMongoDbSet(set: object, setOverwrite: SetOverwrite): SetObj;
export declare function getOverwrite(current: SetOverwrite, input?: boolean): SetOverwrite;
export declare function getMongoDbInc(inc: object): IncObj;
