import { db, DBMessage } from './fakedb';
import { authZone, entity, entityList, method } from './utils';
import {
	Account,
	Coffee,
	Query,
	Space,
	User,
	Mutation,
	Message,
	Chat,
	Image,
	MessageValue,
} from './schema';

export const query: Query & Mutation = {
	getSpace: method(args => getSpace(args.spaceId)),
	myAccount: authZone((_, user) => getAccount(user.id)),
	getDateDiff: method(async args => Date.now() - args.date.getTime()),
	createSpace: authZone(args => createSpace(args.name)),
	updateAccount: authZone((args, user) => user && updateAccount(user.id, args)),
	getChat: authZone(args => getChat(args.chatId)),
	// addMessage: authZone((msg, user) => addMessage(user.id, msg.msg)),
	addMessageText: authZone((msg, user) => addMessage(user.id, { type: 'text', text: msg.text })),
	addMessageCoord: authZone((msg, user) =>
		addMessage(user.id, { type: 'coord', lat: msg.lat, lon: msg.lon }),
	),
	addMessageImage: authZone((msg, user) => addMessage(user.id, { type: 'image', id: msg.imageId })),
	removeMessage: authZone((args, user) => removeMessage(user.id, args.msgId)),
};

async function addMessage(userId: string, msg: DBMessage['message']) {
	await db.messages.create({
		id: '1',
		message: msg,
		date: new Date(),
		authorId: userId,
	});
	return true;
}

async function removeMessage(userId: string, msgId: string) {
	const msg = await db.messages.findById(msgId);
	if (msg.authorId !== userId) throw new Error('You can remove only your messages');
	return await db.messages.remove(msgId);
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

async function getChat(chatId: string): Promise<Chat> {
	const chat = await db.chat.findById(chatId);
	return {
		id: chat.id,
		messages: entityList(chat.messagesIds, getMessage),
	};
}

async function getMessageValue(obj: DBMessage['message']): Promise<MessageValue> {
	if (obj.type === 'text') return { __typename: 'MessageText', text: obj.text };
	if (obj.type === 'coord') return { __typename: 'Coord', lat: obj.lat, lan: obj.lon };
	if (obj.type === 'image') return getImage(obj.id);
	throw new Error('Never');
}
async function getMessage(messageId: string): Promise<Message> {
	const message = await db.messages.findById(messageId);
	return {
		id: message.id,
		author: entity(message.authorId, getUser),
		date: message.date,
		message: entity(message.message, getMessageValue),
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

async function getImage(id: string): Promise<Image> {
	const image = await db.image.findById(id);
	return {
		id: image.id,
		__typename: 'Image',
		url: image.url,
		width: image.width,
		height: image.height,
	};
}
