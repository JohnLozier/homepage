import "./styles/global.css";

import Background from "./components/background";
import Clock from "./components/clock";
import Copilot from "./components/copilot/copilot";
import DayJS from "dayjs";
import Greeting from "./components/greeting";
import News from "./components/news/news";
import Scores from "./components/scores/scores";
import Search from "./components/search";
import Settings from "./components/settings";
import Stocks from "./components/stocks/stocks";
import Weather from "./components/weather";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";

const App = () => {

	const backgroundOptions = [
		"live" as const,
		"image" as const,
		"gradient" as const,
		"animated" as const
	];
	const [ show, setShow ] = createSignal(true);
	const [ backgroundType, setBackgroudType ] = createSignal((DayJS().hour() <= 7 || DayJS().hour() >= 21 ? backgroundOptions[Math.random() * 2 | 0] : backgroundOptions[Math.random() * 3 | 0]), {
		equals: false
	});

	document.addEventListener("keydown", ({ shiftKey, key, target }) => (key == "Enter" && !["input", "textarea"].includes((target as HTMLElement).localName)) && setBackgroudType(current =>
		shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
	));

	return <div class="w-full h-full">
		<Background type={ backgroundType } />
		<div class="flex gap-10 w-min right-10 top-5 absolute bottom-5 items-end flex-col">
			<Clock />
			<div class="flex gap-y-10 items-end flex-col" style={ {
				display: show() ? undefined : "none"
			} }>
				<Stocks />
				<Weather />
			</div>
		</div>
		<div style={ {
			display: show() ? undefined : "none"
		} }>
			<Copilot light={ backgroundType() == "live" } />
			<Greeting />
			<div class="absolute flex-col flex items-center focus-within:h-[max(calc(33.3333%+8rem),35rem)] transition-[top,height] duration-500 justify-stretch gap-y-3 w-1/3 h-[max(33.3333%,27rem)] bottom-0 min-w-[50rem] ml-[50%] -translate-x-1/2">
				<Search light={ backgroundType() == "live" } />
				<News light={ backgroundType() == "live" } />
			</div>
			<Scores />
		</div>
		<Settings setShow={ setShow } show={ show } onClick={ ({ shiftKey }) => setBackgroudType(current =>
			shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
		)} />
	</div>;
};

render(() => <App />, document.querySelector("#root")!);