
export function isArray(array: any): array is any[] {
	return Array.isArray(array);
}

export function isString(str: unknown): str is string {
	return (typeof str === 'string');
}

export function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && (<unknown[]>value).every(elem => isString(elem));
}

export function isObject(obj: unknown): obj is Object {

	return typeof obj === 'object'
		&& obj !== null
		&& !Array.isArray(obj)
		&& !(obj instanceof RegExp)
		&& !(obj instanceof Date);
}

export function isNumber(obj: unknown): obj is number {
	return (typeof obj === 'number' && !isNaN(obj));
}

export function isIterable<T>(obj: unknown): obj is Iterable<T> {
	return !!obj && typeof (obj as any)[Symbol.iterator] === 'function';
}

export function isBoolean(obj: unknown): obj is boolean {
	return (obj === true || obj === false);
}


export function isUndefined(obj: unknown): obj is undefined {
	return (typeof obj === 'undefined');
}


export function isDefined<T>(arg: T | null | undefined): arg is T {
	return !isUndefinedOrNull(arg);
}

export function isUndefinedOrNull(obj: unknown): obj is undefined | null {
	return (isUndefined(obj) || obj === null);
}




const hasOwnProperty = Object.prototype.hasOwnProperty;


export function isEmptyObject(obj: unknown): obj is object {
	if (!isObject(obj)) {
		return false;
	}

	for (let key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			return false;
		}
	}

	return true;
}


export function isFunction(obj: unknown): obj is Function {
	return (typeof obj === 'function');
}

export function areFunctions(...objects: unknown[]): boolean {
	return objects.length > 0 && objects.every(isFunction);
}

export type TypeConstraint = string | Function;

export function validateConstraints(args: unknown[], constraints: Array<TypeConstraint | undefined>): void {
	const len = Math.min(args.length, constraints.length);
	for (let i = 0; i < len; i++) {
		validateConstraint(args[i], constraints[i]);
	}
}

export function validateConstraint(arg: unknown, constraint: TypeConstraint | undefined): void {

	if (isString(constraint)) {
		if (typeof arg !== constraint) {
			throw new Error(`argument does not match constraint: typeof ${constraint}`);
		}
	} else if (isFunction(constraint)) {
		try {
			if (arg instanceof constraint) {
				return;
			}
		} catch {
			// ignore
		}
		if (!isUndefinedOrNull(arg) && (arg as any).constructor === constraint) {
			return;
		}
		if (constraint.length === 1 && constraint.call(undefined, arg) === true) {
			return;
		}
		throw new Error(`argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true`);
	}
}

export function getAllPropertyNames(obj: object): string[] {
	let res: string[] = [];
	let proto = Object.getPrototypeOf(obj);
	while (Object.prototype !== proto) {
		res = res.concat(Object.getOwnPropertyNames(proto));
		proto = Object.getPrototypeOf(proto);
	}
	return res;
}

export function getAllMethodNames(obj: object): string[] {
	const methods: string[] = [];
	for (const prop of getAllPropertyNames(obj)) {
		if (typeof (obj as any)[prop] === 'function') {
			methods.push(prop);
		}
	}
	return methods;
}


export function withNullAsUndefined<T>(x: T | null): T | undefined {
	return x === null ? undefined : x;
}


export function withUndefinedAsNull<T>(x: T | undefined): T | null {
	return typeof x === 'undefined' ? null : x;
}


export function Objectequals(one: any, other: any): boolean {
	if (one === other) {
		return true;
	}
	if (one === null || one === undefined || other === null || other === undefined) {
		return false;
	}
	if (typeof one !== typeof other) {
		return false;
	}
	if (typeof one !== 'object') {
		return false;
	}
	if ((Array.isArray(one)) !== (Array.isArray(other))) {
		return false;
	}

	let i: number;
	let key: string;

	if (Array.isArray(one)) {
		if (one.length !== other.length) {
			return false;
		}
		for (i = 0; i < one.length; i++) {
			if (!Objectequals(one[i], other[i])) {
				return false;
			}
		}
	} else {
		const oneKeys: string[] = [];

		for (key in one) {
			oneKeys.push(key);
		}
		oneKeys.sort();
		const otherKeys: string[] = [];
		for (key in other) {
			otherKeys.push(key);
		}
		otherKeys.sort();
		if (!Objectequals(oneKeys, otherKeys)) {
			return false;
		}
		for (i = 0; i < oneKeys.length; i++) {
			if (!Objectequals(one[oneKeys[i]], other[oneKeys[i]])) {
				return false;
			}
		}
	}
	return true;
}

export function assertIsDefined<T>(arg: T | null | undefined): T {
	if (isUndefinedOrNull(arg)) {
		throw new Error('Assertion Failed: argument is undefined or null');
	}

	return arg;
}