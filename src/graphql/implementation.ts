import { fromPromise } from 'ts2graphql';
import { db } from './fakedb';
import { Account, Coffee, Query, Space, User, Mutation } from './schema';
import { withCurrentUser } from './utils';

export const query: Query & Mutation = {
	getSpace: args => fromPromise(getSpace(args.spaceId))!,
	myAccount: withCurrentUser((_args, user) => user && getAccount(user.id)),
	getDateDiff: args => Date.now() - args.date.getTime(),

	createSpace: args => fromPromise(createSpace(args.name)),
	updateAccount: withCurrentUser((args, user) => user && updateAccount(user.id, args)),
};

async function getSpace(id: string): Promise<Space | undefined> {
	const space = await db.space.findById(id);
	if (!space) return;
	return {
		id: space.id,
		name: space.name,
		users: fromPromise(() => space.userIds.map(getUser)),
	};
}

async function createSpace(name: string): Promise<Space> {
	const dbspace = await db.space.create({ id: '2', name, userIds: [] });
	return (await getSpace(dbspace.id))!;
}

async function getCoffee(id: string): Promise<Coffee> {
	const coffee = await db.coffee.findById(id);
	return {
		id: coffee.id,
		user1: fromPromise(() => getUser(coffee.user1Id)),
		user2: fromPromise(() => getUser(coffee.user2Id)),
		date: coffee.date,
		photos: fromPromise(() => coffee.photoIds.map(getImage)),
	};
}

async function getUser(id: string): Promise<User> {
	const user = await db.user.findById(id);
	return {
		id: user.id,
		name: user.name,
		info: user.info,
		photos: fromPromise(() => user.photoIds.map(getImage)),
	};
}

async function getAccount(id: string): Promise<Account> {
	const user = await db.user.findById(id);
	return {
		id: user.id,
		name: user.name,
		info: user.info,
		history: fromPromise(() => user.historyIds.map(getCoffee)),
		photos: fromPromise(() => user.photoIds.map(getImage)),
	};
}

async function updateAccount(
	userId: string,
	params: Parameters<Mutation['updateAccount']>[0],
): Promise<Account> {
	const user = await db.user.findById(userId);
	await db.user.update(userId, { photoIds: params.photos || user.photoIds });
	return getAccount(userId);
}

async function getImage(id: string) {
	return db.image.findById(id);
}
