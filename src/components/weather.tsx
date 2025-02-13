import { FiCloud, FiCloudDrizzle, FiCloudLightning, FiCloudRain, FiCloudSnow, FiMoon, FiSun } from "solid-icons/fi";
import { Show, createResource, createSignal, onMount } from "solid-js";

import { getWeather } from "../lib/weather";
import { shown } from "~/lib/show";

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

	const [ data, { refetch } ] = createResource(getWeather, {
		initialValue: undefined,
		ssrLoadFrom: "initial"
	});

	const [ cached, setCached ] = createSignal(false);

	onMount(() => {
		setCached(!!localStorage.getItem("weather"));
		refetch();
	});

	return <Show when={ data() && shown() }>
		<div class="flex flex-row h-12 items-center gap-4">
			{
				(() => {
					const Icon = Feather[data()?.icon as WeatherIconType];

					return <Icon style={ {
						"animation-delay": !cached() ? "0.90s" : "0s"
					} } color="white" stroke-width={ 1.5 } class="w-12 h-12  opacity-0 animate-fadeIn" />
				})()
			}
			<div class="flex flex-col h-full">
				<h3 style={ {
					"animation-delay": !cached() ? "1.30s" : "0.4s"
				} } class="font-montserrat font-bold leading-5 text-[22px] opacity-0 animate-fadeIn text-white">{ data()?.temperature_2m_max[0] }°</h3>
				<h3 style={ {
					"animation-delay": !cached() ? "1.70s" : "0.8s"
				} } class="font-mona flex-1 mb-auto leading-5 font-bold text-base opacity-0 animate-fadeIn text-white/85">{ data()?.temperature_2m_min[0] }°</h3>
			</div>
		</div>
	</Show>;
};

export default Weather;