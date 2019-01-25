import { Float, ID, Int } from 'ts2graphql';
export interface Query {
	getSpace(args: { spaceId: ID }): Space | undefined;
	myAccount(args: {}): Account | undefined;
	getDateDiff(args: { date: Date }): Int;

	getChat(args: { chatId: ID }): Chat | undefined;
}

interface Mutation {
	createSpace(args: { name: string }): Space;
	updateAccount(args: { photos?: ID[] }): Account;
	removeMessage(args: { msgId: ID }): boolean;
	// addMessage(msg: {msg: MessageInput}): boolean;
	addMessageText(msg: { text: string }): boolean;
	addMessageCoord(msg: { lat: Float; lon: Float }): boolean;
	addMessageImage(msg: { imageId: ID }): boolean;
}
interface User {
	id: ID;
	photos: Image[];
	name: string;
	info: string;
}
interface Account extends User {
	history: Coffee[];
}
interface Space {
	id: ID;
	name: string;
	users: User[];
}
interface Coffee {
	id: ID;
	user1: User;
	user2: User;
	date: Date;
	photos: Image[];
}

interface Chat {
	id: ID;
	messages: Message[];
}
interface Coord {
	__typename: 'Coord';
	lat: Float;
	lan: Float;
}
interface MessageText {
	__typename: 'MessageText';
	text: string;
}
type MessageValue = MessageText | Coord | Image;
interface Message {
	id: ID;
	author: User;
	date: Date;
	message: MessageValue;
}
interface Image {
	__typename: 'Image';
	id: ID;
	url: string;
	width: Int;
	height: Int;
}
