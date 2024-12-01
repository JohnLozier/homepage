import Axios from "axios";
import DayJS from "dayjs";
import { Highlight } from "../types/highlight";

const Countries = [
	"US",
	// "GB-EN",
	// "ES"
];

export const getHighlights = () => {
	const mapHighlight = (data: Highlight[]) =>
		data.map(({ title, imgUrl, url, embedUrl, channel, source, match: { homeTeam, awayTeam, country, league, round, date } }) => ({
			title,
			match: {
				homeTeam: homeTeam.name,
				awayTeam: awayTeam.name,
				country: country.name,
				league: league.name,
				round,
				date: DayJS(date).fromNow()
			},
			imgUrl,
			embedUrl,
			author: {
				source: source,
				channel: channel
			},
			url
		}));

	if (!localStorage.getItem("highlights") || DayJS().diff(JSON.parse(localStorage.getItem("highlights") as string).timeStamp as number, "minutes") >= 15) {
		return Axios<{
			data: Highlight[]
		}>("https://football-highlights-api.p.rapidapi.com/highlights", {
			"headers": {
				"x-rapidapi-key": import.meta.env.VITE_FOOTBALL_HIGHLIGHTS_API_KEY,
				"x-rapidapi-host": "football-highlights-api.p.rapidapi.com"
			},
			"params": {
				"limit": 5,
				"countryCode": Countries[Math.random() * Countries.length | 0]
			}
		}).then(({ data }) => {
			const Highlights = mapHighlight(data.data);

			localStorage.setItem("highlights", JSON.stringify({
				timeStamp: Date.now(),
				data: Highlights
			}));

			return Highlights;
		});
	};

	return JSON.parse(localStorage.getItem("highlights") as string)?.data as ReturnType<typeof mapHighlight>;
};