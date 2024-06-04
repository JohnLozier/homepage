import { FiCloud, FiCloudDrizzle, FiCloudLightning, FiCloudRain, FiCloudSnow, FiMoon, FiSun } from "solid-icons/fi";
import { Show, createEffect, createResource, createSignal } from "solid-js";

import Axios from "axios";
import DayJS from "dayjs";

type WeatherIconType = "FiCloud" | "FiSun" | "FiMoon" | "FiCloudDrizzle" | "FiCloudRain" | "FiCloudSnow" | "FiCloudLightning";

const Feather = {
	FiCloud,
	FiSun,
	FiMoon,
	FiCloudDrizzle,
	FiCloudRain,
	FiCloudSnow,
	FiCloudLightning
};

const Weather = () => {

	const [ icon, setIcon ] = createSignal<WeatherIconType>();
	const WeatherIcon = () => {
		const Component = Feather[icon() ?? "FiSun"];
		return <Component color="white" stroke-width={ 1.5 } class="w-12 h-12 animate-fadeIn" />;
	};

	const [ data ] = createResource<{
		daily: {
			weathercode: number[];
			temperature_2m_max: number[];
			temperature_2m_min: number[];
		};
	}>(() =>
		new Promise(resolve =>
			navigator.geolocation.getCurrentPosition(({ coords }) =>
				resolve(Axios(`https://api.open-meteo.com/v1/forecast?latitude=${ coords.latitude }&longitude=${ coords.longitude }&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=${ Intl.DateTimeFormat().resolvedOptions().timeZone }`)
					.then(({ data }) =>
						data
					))
			)
		), {
		initialValue: localStorage.getItem("weather") ? JSON.parse(localStorage.getItem("weather") as string) : undefined,
	});

	createEffect(() => {
		[
			[[0, 1], DayJS().hour() > 18 || DayJS().hour() < 6 ? "FiMoon" : "FiSun"],
			[[2, 3, 45, 48], "FiCloud"],
			[[51, 53, 56, 61, 66, 80 ], "FiCloudDrizzle"],
			[[53, 55, 57, 63, 65, 67, 81], "FiCloudRain"],
			[[71, 73, 75, 77, 85, 86], "FiCloudSnow"],
			[[95, 96, 99], "FiCloudLightning"]
		].forEach(([ codes, icon ]) => {
			if (data()?.daily.weathercode[0] && (codes as number[]).includes(data()?.daily.weathercode[0] ?? 0)) {
				setIcon(icon as WeatherIconType);
			};
		});

		data() && localStorage.setItem("weather", JSON.stringify(data()));
	});

	return <Show when={ data() }>
		<div class="flex flex-row h-12 items-center gap-4">
			{
				WeatherIcon()
			}
			<div class="flex flex-col h-full">
				<h3 class="font-montserrat font-bold leading-5 text-[22px] opacity-0 animate-fadeIn [animation-delay:0.5s] text-white">{ data()?.daily.temperature_2m_max[0] }°</h3>
				<h3 class="font-mona flex-1 mb-auto leading-5 font-bold text-base opacity-0 animate-fadeIn [animation-delay:0.7s] text-white/85">{ data()?.daily.temperature_2m_min[0] }°</h3>
			</div>
		</div>
	</Show>;
};

export default Weather;