import "./styles/global.css";

import Background from "./components/background";
import Clock from "./components/clock";
import Copilot from "./components/copilot/copilot";
import Crypto from "./components/crypto";
import DayJS from "dayjs";
import Greeting from "./components/greeting";
import Lozier from "./components/lozier";
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

	return <div class="w-full h-full">
		<Background type={ backgroundType } />
		<Copilot light={ backgroundType() == "live" } />
		<div class="flex w-full gap-10 pr-10 pt-5 items-end flex-col">
			<Clock />
			<Crypto />
			<Weather />
		</div>
		<Greeting />
		<Search light={ backgroundType() == "live" } />
		<Lozier onClick={ ({ shiftKey }) => setBackgroudType(current =>
			shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
		)} />
	</div>;
};

render(() => <App />, document.querySelector("#root")!);