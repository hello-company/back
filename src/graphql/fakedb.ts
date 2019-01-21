import DataLoader from 'dataloader';
import { NotFoundError } from './utils';
export interface DBUser {
	id: string;
	name: string;
	info: string;
	photoIds: string[];
	historyIds: string[];
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

async function fetchAllFrom<T>(ids: string[], map: Map<string, T>): Promise<(T)[]> {
	return ids.map(id => {
		const row = map.get(id);
		if (!row) throw new NotFoundError();
		return row;
	});
}

function createTable<T>() {
	const map = new Map<string, T>();
	const loader = new DataLoader<string, T>(ids => fetchAllFrom(ids, map), { cache: false });
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
	};
}

export const db = {
	user: createTable<DBUser>(),
	space: createTable<DBSpace>(),
	image: createTable<DBImage>(),
	coffee: createTable<DBCoffee>(),
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
});
db.user.create({
	id: '2',
	name: 'Julia',
	info: "I'm Julia, and I'm graphic designer",
	photoIds: ['2'],
	historyIds: ['1'],
});
db.coffee.create({
	id: '1',
	date: new Date(),
	photoIds: ['1', '2'],
	user1Id: '1',
	user2Id: '2',
});
db.space.create({ id: '1', name: 'Yandex', userIds: ['1', '2'] });
