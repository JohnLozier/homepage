import { Index, createMemo, createResource, onCleanup, onMount } from "solid-js";

import DayJS from "dayjs";

function Clock() {
	const [ time, { refetch } ]  = createResource<number | undefined>(() => DayJS().valueOf(), {
		initialValue: undefined,
		ssrLoadFrom: "initial"
	});

	const hour = createMemo(() =>
		DayJS(time()).format("h:mm").replace(/:(\d)$/, ":0$1")
	);
	const date = createMemo(() =>
		DayJS(time()).format("MMM D, YYYY")
	);

	onMount(() => {
		let interval: ReturnType<typeof setInterval>;

		refetch();

		const timeout = setTimeout(() => {
			refetch();

			interval = setInterval(() => {
				refetch();
			}, 60 * 1000);
		}, (60 - DayJS().second()) * 1000);

		onCleanup(() => {
			clearInterval(interval);
			clearTimeout(timeout);
		});
	});

	return <div class="flex flex-col text-white">
		<h1 class="font-montserrat font-bold text-9xl">
			<Index each={ hour().split("") }>
				{ (char, index) =>
					<span style={ {
						"animation-delay": `${ index * 0.1 }s`
					} } class="animate-fadeIn opacity-0">{ char() }</span>
				}
			</Index>
		</h1>
		<h2 class="font-mona self-center font-bold text-4xl">
			<Index each={ date().split("") }>
				{ (char, index) =>
					<span style={ {
						"animation-delay": `${ index * 0.05 }s`
					} } class="animate-fadeIn opacity-0">{ char() }</span>
				}
			</Index>
		</h2>
	</div>;
}

export default Clock;