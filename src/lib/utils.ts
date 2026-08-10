import { type ClassValue, clsx } from "clsx"
import { Accessor, createResource, createSignal, onCleanup, onMount } from "solid-js";
import { createStore, Store } from "solid-js/store";
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) =>
	twMerge(clsx(inputs));

export const awaitMount = <T>(func: () => T | Promise<T>) => {
	return new Promise<T>(resolve => {
		onMount(() =>
			resolve(func())
		);
	});
};

export const createDefer = <T>(updated: (() => T | Promise<T> | T[] | Promise<T[]>) | T | T[], {
	initial,
	delay = 1000
}: {
	initial?: T;
	delay?: number | number[];
}) => {
	const [ data, setData ] = createSignal<T | undefined>(initial);

	if (delay instanceof Array) {
		for (const [ index, time ] of delay.entries()) {
			const timeout = setTimeout(async () => {
				const value = updated instanceof Function ? await updated() : updated;

				setData(() => (value as T[])[index]);
			}, time);

			onCleanup(() => clearTimeout(timeout));
		}
	} else {
		const timeout = setTimeout(async () => {
			const value = updated instanceof Function ? await updated() : updated;

			setData(() => value as T);
		}, delay);

		onCleanup(() => clearTimeout(timeout));
	}

	return data;
};

export const createMount = <T>(func: () => T | Promise<T>, initial?: T) => {
	const [ data, { refetch } ] = createResource(func, {
		initialValue: initial,
		ssrLoadFrom: "initial"
	});

	onMount(refetch);

	return data;
};

export const createBoolean = (initial?: boolean) => {
	const [ value, setValue ] = createSignal<boolean>(initial ?? false);

	const toggle = () =>
		setValue(current => !current);

	return [ value, toggle ] as [ Accessor<boolean>, () => Boolean ];
};

export const createStoreResource = <T extends object = {}>(initial: T | Store<T>, func: (args?: T) => Promise<T>) => {
	const [ value, set ] = createStore<T>(initial);

	onMount(async () => set(await func()));

	return [ value, {
		set,
		reset: (value) => set(value)
	} ] as [ typeof value, {
		set: typeof set;
		reset: (value: T) => void;
	} ];
};