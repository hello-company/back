import { DBUser } from './fakedb';
import { fromPromise } from 'ts2graphql';
import { ReqWithUser } from '..';

export function method<Arg, T>(cb: (arg: Arg, user: DBUser | undefined) => Promise<T> | undefined) {
	return (args: Arg, ctx?: ReqWithUser) => {
		const user = ctx!.currentUser;
		return fromPromise(cb(args, user)!);
	};
}

export function entity<T>(id: string, getEntity: (id: string) => Promise<T>): T {
	return (() => getEntity(id)) as any;
}
export function entityList<T>(ids: string[], getEntity: (id: string) => Promise<T>): T[] {
	return (() => ids.map(getEntity)) as any;
}

export class NotFoundError extends Error {}
