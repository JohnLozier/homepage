import { For, onCleanup } from "solid-js";

import DayJS from "dayjs";

function Clock() {

	let interval: ReturnType<typeof setInterval>;

	const timeout = setTimeout(() => {
		document.querySelector("#clock")!.textContent = DayJS().format("h:m").replace(/:(\d)$/, ":0$1");

		interval = setInterval(() => {
			document.querySelector("#clock")!.textContent = DayJS().format("h:m").replace(/:(\d)$/, ":0$1");
		}, 60 * 1000);
	}, (60 - DayJS().second()) * 1000);

	onCleanup(() => {
		clearInterval(interval);
		clearTimeout(timeout);
	});

	return <div class="flex flex-col text-white">
		<h1 id="clock" class="font-montserrat font-bold text-9xl">
			<For each={ DayJS().format("h:m").replace(/:(\d)$/, ":0$1").split("") }>
				{ (char, index) =>
					<span style={ {
						"animation-delay": `${ index() * 0.1 }s`
					} } class="animate-fadeIn opacity-0">{ char }</span>
				}
			</For>
		</h1>
		<h2 class="font-mona self-center font-bold text-4xl">
			<For each={ DayJS().format("MMM D, YYYY").split("") }>
				{ (char, index) =>
					<span style={ {
						"animation-delay": `${ index() * 0.05 }s`
					} } class="animate-fadeIn opacity-0">{ char }</span> 
				}
			</For>
		</h2>
	</div>;
}

export default Clock;