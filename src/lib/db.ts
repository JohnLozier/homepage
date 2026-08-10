import { IDBPDatabase, StoreKey, StoreNames, openDB } from "idb";

export const get = async <T>(db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>, store: StoreNames<T>, key?: StoreKey<T, StoreNames<T>>) => {
	const response = key ?
		(await db)?.get(store, key) :
		(await db)?.getAll(store);

	return response;
}

export const update = async <T>(
	db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>,
	store: StoreNames<T>,
	value: any
) =>
		(await db)?.put(store, value);

export const add = async <T>(db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>, store: StoreNames<T>, value: any) =>
	(await db)?.add(store, value);

export const remove = async <T>(db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>, store: StoreNames<T>, key: StoreKey<T, StoreNames<T>>) =>
	(await db)?.delete(store, key);

export const clear = async <T>(db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>, store: StoreNames<T>) =>
	(await db)?.clear(store);

export const pop = async <T>(db: Promise<IDBPDatabase<T>> | IDBPDatabase<T>, store: StoreNames<T>) => {
	const keys = await (await db).getAllKeys(store);

	if (keys.length > 0) {
		await (await db).delete(store, keys.at(-1)!);
	};
};

export const create = async <T, K extends string>({
	name,
	stores
}: {
	name: string;
	stores: {
		name: StoreNames<Record<K, T>>;
		keyPath?: string;
	}[];
}) => await openDB<Record<string, T>>(name, undefined, {
	upgrade(db) {
		for (const { name, keyPath } of stores) {
			db.createObjectStore(name, {
				autoIncrement: keyPath ? false : true,
				keyPath: keyPath
			});
		}
	}
});