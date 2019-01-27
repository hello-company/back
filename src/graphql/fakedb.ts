import DataLoader from 'dataloader';
import { NotFoundError } from './utils';
export interface DBUser {
	id: string;
	name: string;
	info: string;
	photoIds: string[];
	historyIds: string[];
	spaceIds: string[];
}
export interface DBSpace {
	id: string;
	name: string;
	userIds: string[];
}
export interface DBImage {
	id: string;
	url: string;
	width: number;
	height: number;
}
export interface DBCoffee {
	id: string;
	user1Id: string;
	user2Id: string;
	date: Date;
	photoIds: string[];
}

export interface DBChat {
	id: string;
	messagesIds: string[];
}

export interface DBMessage {
	id: string;
	authorId: string;
	date: Date;
	message:
		| { type: 'coord'; lat: number; lon: number }
		| { type: 'text'; text: string }
		| { type: 'image'; id: string };
}

async function fetchAllFrom<T>(name: string, ids: string[], map: Map<string, T>): Promise<(T)[]> {
	return ids.map(id => {
		const row = map.get(id);
		if (!row) throw new NotFoundError(`${name}:${id} is not found`);
		return row;
	});
}

function createTable<T>(name: string) {
	const map = new Map<string, T>();
	const loader = new DataLoader<string, T>(ids => fetchAllFrom(name, ids, map), { cache: false });
	return {
		findById(id: string) {
			return loader.load(id);
		},
		async create(data: T) {
			map.set((data as any).id, data);
			return data;
		},
		async update(id: string, data: Partial<T>) {
			const newUser = { ...map.get(id)!, ...data };
			map.set(id, newUser);
			return newUser;
		},
        async remove(id: string) {
			return map.delete(id);
		},
	};
}

export const db = {
	user: createTable<DBUser>('user'),
	space: createTable<DBSpace>('space'),
	image: createTable<DBImage>('image'),
	coffee: createTable<DBCoffee>('coffee'),
	chat: createTable<DBChat>('chat'),
	messages: createTable<DBMessage>('messages'),
};

db.image.create({
	id: '1',
	url: '/img/1',
	width: 123,
	height: 456,
});
db.image.create({
	id: '2',
	url: '/img/2',
	width: 456,
	height: 789,
});
db.user.create({
	id: '1',
	name: 'Ivan',
	info: 'Hello, my name is Ivan',
	photoIds: ['1'],
	historyIds: ['1'],
	spaceIds: ['1'],
});
db.user.create({
	id: '2',
	name: 'Julia',
	info: "I'm Julia, and I'm graphic designer",
	photoIds: ['2'],
	historyIds: ['1'],
	spaceIds: ['1', '2'],
});
db.user.create({
	id: '3',
	name: 'Vova',
	info: "I'm vova",
	photoIds: ['2'],
	historyIds: ['1'],
	spaceIds: ['2'],
});
db.coffee.create({
	id: '1',
	date: new Date(),
	photoIds: ['1', '2'],
	user1Id: '1',
	user2Id: '2',
});
db.space.create({ id: '1', name: 'Yandex', userIds: ['1', '2'] });
db.space.create({ id: '2', name: 'Google', userIds: ['2', '3'] });

db.chat.create({ id: '1', messagesIds: ['1', '2', '3'] });
db.messages.create({
	id: '1',
	authorId: '1',
	date: new Date(),
	message: { type: 'text', text: 'Hey' },
});
db.messages.create({
	id: '2',
	authorId: '1',
	date: new Date(),
	message: { type: 'coord', lat: 13, lon: 34 },
});
db.messages.create({
	id: '3',
	authorId: '1',
	date: new Date(),
	message: { type: 'image', id: '1' },
});
