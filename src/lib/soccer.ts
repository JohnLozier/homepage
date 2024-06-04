import Axios from "axios"
import DayJS from "dayjs";

export const getMatches = () => {
	if (!localStorage.getItem("matches") || DayJS().diff(JSON.parse(localStorage.getItem("matches") as string).timeStamp as number, "minutes") >= 7) {
		Axios(`https://v3.football.api-sports.io/fixtures?live=${ [1,2,3,4,9,10,15,16,39,45,61,78,135,140,143,253,257,556,667,772].join("-") }`, {
			"headers": {
				"x-apisports-key": import.meta.env.VITE_FOOTBALL_API_KEY
			}
		}).then(({ data }) =>
			localStorage.setItem("matches", JSON.stringify({
				timeStamp: Date.now(),
				data: data.response
			})));
	};

	return JSON.parse(localStorage.getItem("matches") as string)?.data;
}

export const getSoccerNews = () => {
	if (!localStorage.getItem("soccerNews") || DayJS().diff(JSON.parse(localStorage.getItem("soccerNews") as string).timeStamp as number, "hours") >= 1) {
		Axios("https://football-news-aggregator-live.p.rapidapi.com/news/onefootball", {
			"headers": {
				"x-rapidapi-key": import.meta.env.VITE_FOOTBALL_AGGREGATOR_API_KEY,
				"x-rapidapi-host": "football-news-aggregator-live.p.rapidapi.com"
			}
		}).then(({ data }) =>
			localStorage.setItem("soccerNews", JSON.stringify({
				timeStamp: Date.now(),
				data: [
					...new Set(data.map(({ title }: {
						title: string
					}) => `"${ title.replace(/[^\x00-\x7F]+ *(?:[^\x00-\x7F]| )*/g, "") }"`))
				].join(",")
			})));
	};

	return JSON.parse(localStorage.getItem("soccerNews") as string)?.data;
};