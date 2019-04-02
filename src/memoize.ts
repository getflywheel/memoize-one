export type EqualityFn = (newArgs: any[], lastArgs: any[]) => boolean;
type ResultFn = (...args: any[]) => any;

const shallowEqual = (newValue: any, oldValue: any): boolean =>
	newValue === oldValue
;

const simpleIsEqual: EqualityFn = (
	newArgs: any[],
	lastArgs: any[],
): boolean =>
	newArgs.length === lastArgs.length &&
	newArgs.every(
		(newArg: any, index: number): boolean =>
			shallowEqual(newArg, lastArgs[index]),
	)
;

// decorator overload with params
export function memoizeOneWith (isEqual: EqualityFn): any {
	return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
		// wrap in memoize function
		descriptor.value = memoizeOneFn(descriptor.value, isEqual);
		return descriptor;
	}
}

export function memoizeOne (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
	// wrap in memoize function
	descriptor!.value = memoizeOneFn(descriptor!.value);

	// decorator without parenthesis (e.g. @memoizeOne)
	return descriptor;
}

// <ResultFn: (...Array<any>) => mixed>
// The purpose of this typing is to ensure that the returned memoized
// function has the same type as the provided function (`resultFn`).
// ResultFn:        Generic type (which is the same as the resultFn).
// (...Array<any>): Accepts any length of arguments - and they are not checked
// mixed:           The result can be anything but needs to be checked before usage
export function memoizeOneFn (
	resultFn: ResultFn,
	isEqual?: EqualityFn,
): ResultFn {
	isEqual = isEqual || simpleIsEqual;

	let lastThis: any;
	let lastArgs: any[] = [];
	let lastResult: any;
	let calledOnce: boolean = false;

	// breaking cache when context (this) or arguments change
	const result = function(...newArgs: any[]) {
		if (calledOnce && lastThis === this && isEqual!(newArgs, lastArgs)) {
			return lastResult;
		}

		// Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
		// Doing the lastResult assignment first so that if it throws
		// nothing will be overwritten
		lastResult = resultFn.apply(this, newArgs);
		calledOnce = true;
		lastThis = this;
		lastArgs = newArgs;
		return lastResult;
	};

	return result;
}
