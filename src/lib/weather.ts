import Axios from "axios";
import DayJS from "dayjs";
import { Forecast } from "../types/weather";

export const getWeather = () => {
	const parseForecast = ({ daily: { temperature_2m_max, temperature_2m_min, weathercode } }: Forecast) => ({
		icon: [
			[[0, 1], DayJS().hour() > 18 || DayJS().hour() < 6 ? "FiMoon" : "FiSun"],
			[[2, 3, 45, 48], "FiCloud"],
			[[51, 53, 56, 61, 66, 80 ], "FiCloudDrizzle"],
			[[53, 55, 57, 63, 65, 67, 81], "FiCloudRain"],
			[[71, 73, 75, 77, 85, 86], "FiCloudSnow"],
			[[95, 96, 99], "FiCloudLightning"]
		].find(([ codes ]) => (codes as number[]).includes(weathercode[0]))?.[1] as "FiCloud" | "FiSun" | "FiMoon" | "FiCloudDrizzle" | "FiCloudRain" | "FiCloudSnow" | "FiCloudLightning" ?? "FiSun",
		temperature_2m_max,
		temperature_2m_min
	});

	if (!localStorage.getItem("weather") || DayJS().diff(JSON.parse(localStorage.getItem("weather") as string).timeStamp as number, "minutes") >= 1) {
		return new Promise<ReturnType<typeof parseForecast>>(resolve => navigator.geolocation.getCurrentPosition(({ coords }) =>
			Axios<Forecast>("https://api.open-meteo.com/v1/forecast", {
				params: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					daily: "weathercode,temperature_2m_max,temperature_2m_min",
					temperature_unit: "fahrenheit",
					windspeed_unit: "mph",
					precipitation_unit: "inch",
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
				}
			}).then(({ data }) => {
				const formated = parseForecast(data);

				localStorage.setItem("weather", JSON.stringify({
					timeStamp: Date.now(),
					data: formated
				}));

				resolve(formated);
			})));
	};

	return JSON.parse(localStorage.getItem("weather") as string)?.data as ReturnType<typeof parseForecast>;
};