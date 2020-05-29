export declare type SortDirection = 1 | -1;
export interface SortArg {
    [key: string]: SortArg | SortDirection;
}
export interface MongoDbSort {
    [key: string]: SortDirection;
}
declare function getMongoDbSort(sort: SortArg): MongoDbSort;
export default getMongoDbSort;
