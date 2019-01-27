import { db, DBUser } from './fakedb';
import { Account, Coffee, Mutation, Query, Space, User } from './schema';
import { entity, entityList, method } from './utils';

export const query: Query & Mutation = {
	getMySpaces: method((args, user) => getMySpaces(user!)),
	getSpace: method(args => getSpace(args.spaceId)),
	myAccount: method((_, user) => user && getAccount(user.id)),
	getDateDiff: method(async args => Date.now() - args.date.getTime()),
	createSpace: method(args => createSpace(args.name)),
	updateAccount: method((args, user) => user && updateAccount(user.id, args)),
};

function getMySpaces(user: DBUser) {
	return Promise.all(user.spaceIds.map(getSpace));
}

async function getSpace(id: string): Promise<Space> {
	const space = await db.space.findById(id);
	return {
		id: space.id,
		name: space.name,
		users: entityList(space.userIds, getUser),
	};
}

async function createSpace(name: string): Promise<Space> {
	const dbspace = await db.space.create({ id: '2', name, userIds: [] });
	return await getSpace(dbspace.id);
}

async function getCoffee(id: string): Promise<Coffee> {
	const coffee = await db.coffee.findById(id);
	return {
		id: coffee.id,
		user1: entity(coffee.user1Id, getUser),
		user2: entity(coffee.user2Id, getUser),
		date: coffee.date,
		photos: entityList(coffee.photoIds, getImage),
	};
}

async function getUser(id: string): Promise<User> {
	const user = await db.user.findById(id);
	return {
		id: user.id,
		name: user.name,
		info: user.info,
		photos: entityList(user.photoIds, getImage),
	};
}

async function getAccount(id: string): Promise<Account> {
	const user = await db.user.findById(id);
	return {
		id: user.id,
		name: user.name,
		info: user.info,
		history: entityList(user.historyIds, getCoffee),
		photos: entityList(user.photoIds, getImage),
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
