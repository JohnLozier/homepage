export const get = async <T>(database: string, store: string, key: string) => {
	return new Promise<T | undefined>(resolve => {
		const DB = indexedDB.open(database);

		DB.onupgradeneeded = ({ target }) =>
			!(target as IDBOpenDBRequest).result.objectStoreNames.contains(store) && (target as IDBOpenDBRequest).result.createObjectStore(store, { keyPath: "id" });

		DB.onsuccess = async ({ target }) => {
			if ((target as IDBOpenDBRequest).result.objectStoreNames.contains(store)) {
				(target as IDBOpenDBRequest).result.transaction([ store ], "readonly")
					.objectStore(store)
					.get(key)
					.onsuccess = ({ target }) => resolve((target as IDBRequest).result ? (target as IDBRequest)?.result["data"] : undefined);
			} else {
				resolve(undefined);
			}
		}});
};

export const set = async (database: string, store: string, key: string, value: string) => {
	const DB = indexedDB.open(database);

	DB.onupgradeneeded = ({ target }) =>
		!(target as IDBOpenDBRequest).result.objectStoreNames.contains(store) && (target as IDBOpenDBRequest).result.createObjectStore(store, { keyPath: "id" });

	DB.onsuccess = async ({ target }) => {
		((target as IDBOpenDBRequest).result
			.transaction([ store ], "readwrite")
			.objectStore(store)
			.put({ id: key, "data": value }).transaction as IDBTransaction).oncomplete = () => DB.result.close()
	};
};