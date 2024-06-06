import "./styles/global.css";

import Background from "./components/background";
import Clock from "./components/clock";
import Copilot from "./components/copilot/copilot";
import Crypto from "./components/crypto";
import DayJS from "dayjs";
import Greeting from "./components/greeting";
import Lozier from "./components/lozier";
import News from "./components/news/news";
import Search from "./components/search";
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

	const [ backgroundType, setBackgroudType ] = createSignal((DayJS().hour() <= 7 || DayJS().hour() >= 21 ? backgroundOptions[Math.random() * 2 | 0] : backgroundOptions[Math.random() * 3 | 0]), {
		equals: false
	});

	document.addEventListener("keydown", ({ shiftKey, key, target }) => (key == "Enter" && !["input", "textarea"].includes((target as HTMLElement).localName)) && setBackgroudType(current =>
		shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
	));

	return <div class="w-full h-full">
		<Background type={ backgroundType } />
		<Copilot light={ backgroundType() == "live" } />
		<div class="flex w-full gap-10 pr-10 pt-5 items-end flex-col">
			<Clock />
			<Crypto />
			<Weather />
		</div>
		<Greeting />
		<div class="absolute flex-col flex items-center focus-within:top-[calc(66.6666%-8rem)] focus-within:h-[calc(33.3333%+8rem)] transition-[top,height] duration-500 justify-stretch gap-y-3 w-1/3 min-w-[50rem] h-1/3 top-2/3 ml-[50%] -translate-x-1/2">
			<Search light={ backgroundType() == "live" } />
			<News light={ backgroundType() == "live" } />
		</div>
		<Lozier onClick={ ({ shiftKey }) => setBackgroudType(current =>
			shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
		)} />
	</div>;
};

render(() => <App />, document.querySelector("#root")!);