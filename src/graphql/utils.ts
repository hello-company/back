import { DBUser } from './fakedb';
import { fromPromise } from 'ts2graphql';
import { ReqWithUser } from '..';

export function method<Arg, T>(cb: (arg: Arg, user: DBUser | undefined) => Promise<T> | undefined) {
	return (args: Arg, ctx?: ReqWithUser) => {
		const user = ctx!.currentUser;
		return fromPromise(cb(args, user)!);
	};
}

export function authZone<Arg, T>(cb: (arg: Arg, user: DBUser) => Promise<T> | undefined) {
	return (args: Arg, ctx?: ReqWithUser) => {
		const user = ctx!.currentUser;
		if (!user) throw new Error('Authorized users only');
		return fromPromise(cb(args, user)!);
	};
}

export function entity<K, T>(id: K, getEntity: (id: K) => Promise<T>): T {
	return (() => getEntity(id)) as any;
}
export function entityList<K, T>(ids: K[], getEntity: (id: K) => Promise<T>): T[] {
	return (() => ids.map(getEntity)) as any;
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super('NotFoundError ' + message);
	}
}
