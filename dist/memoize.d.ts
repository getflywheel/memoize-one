export declare type EqualityFn = (newArgs: any[], lastArgs: any[]) => boolean;
declare type ResultFn = (...args: any[]) => any;
export declare function memoizeOneWith(isEqual: EqualityFn): any;
export declare function memoizeOne(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
export declare function memoizeOneFn(resultFn: ResultFn, isEqual?: EqualityFn): ResultFn;
export {};
