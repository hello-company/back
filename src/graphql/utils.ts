import { DBUser } from './fakedb';
import { fromPromise } from 'ts2graphql';
import { ReqWithUser } from '..';

export function withCurrentUser<Arg, T>(
	cb: (arg: Arg, user: DBUser | undefined) => Promise<T> | undefined,
) {
	return (args: Arg, ctx?: ReqWithUser) => {
		const user = ctx!.currentUser;
		return fromPromise(cb(args, user)!);
	};
}
