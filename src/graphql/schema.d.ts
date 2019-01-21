import { ID, Int } from 'ts2graphql';
export interface Query {
	getSpace(args: { spaceId: ID }): Space | undefined;
	myAccount(args: {}): Account | undefined;
	getDateDiff(args: { date: Date }): Int;
}
interface Mutation {
	createSpace(args: { name: string }): Space;
	updateAccount(args: { photos?: ID[] }): Account;
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
interface Image {
	id: ID;
	url: string;
	width: Int;
	height: Int;
}
