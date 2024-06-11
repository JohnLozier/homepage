import Axios from "axios"
import DayJS from "dayjs";
import { Match } from "../types/match";
import { SoccerNews } from "../types/soccerNews";

export const getMatches = () => {

	const mapMatch = (data: Match[]) =>
		data.map(({ fixture, goals, league, teams, events }) => ({
			teams: {
				home: {
					name: teams.home.name,
					id: teams.home.id,
					icon: teams.home.logo,
					goals: goals.home
				},
				away: {
					name: teams.away.name,
					id: teams.away.id,
					icon: teams.away.logo,
					goals: goals.away
				}
			},
			time: fixture.status.elapsed,
			league: league.name,
			events: (events.length > 2 ? events.filter(({ type }) => type != "subst") : events).map(({ type, team, player, assist, time, detail }) => ({
				time: `${ time.elapsed }${ time.extra ? "+" + time.extra : "" }`,
				player: player.name,
				assist: assist.name,
				detail: detail,
				team: {
					name: team.name,
					id: team.id
				},
				type: type
			}))
		}))

	if (!localStorage.getItem("matches") || DayJS().diff(JSON.parse(localStorage.getItem("matches") as string).timeStamp as number, "minutes") >= 7) {
		return Axios<{
			response: Match[]
		}>(`https://v3.football.api-sports.io/fixtures?live=${ [1,2,3,4,9,10,15,16,39,45,61,78,135,140,143,253,257,556,667,772].join("-") }`, {
			"headers": {
				"x-apisports-key": import.meta.env.VITE_FOOTBALL_API_KEY
			}
		}).then(({ data }) => {
			const Matches = mapMatch(data.response);

			localStorage.setItem("matches", JSON.stringify({
				timeStamp: Date.now(),
				data: Matches
			}))

			return Matches;
		});
	};

	return JSON.parse(localStorage.getItem("matches") as string)?.data as ReturnType<typeof mapMatch>;
};

export const getSoccerNews = () => {
	if (!localStorage.getItem("soccerNews") || DayJS().diff(JSON.parse(localStorage.getItem("soccerNews") as string).timeStamp as number, "hours") >= 1) {
		return Axios<SoccerNews[]>("https://football-news-aggregator-live.p.rapidapi.com/news/espn", {
			"headers": {
				"x-rapidapi-key": import.meta.env.VITE_FOOTBALL_AGGREGATOR_API_KEY,
				"x-rapidapi-host": "football-news-aggregator-live.p.rapidapi.com"
			}
		}).then(({ data }) => {
			const removedDuplicates = data.reduce((prev: SoccerNews[], current) => prev.findIndex(e => e.title == current.title) < 0 ? [ ...prev, current ] : prev, []);

			localStorage.setItem("soccerNews", JSON.stringify({
				timeStamp: Date.now(),
				data: removedDuplicates
			}));

			return removedDuplicates;
		});
	} else {
		return JSON.parse(localStorage.getItem("soccerNews") as string)?.data as SoccerNews[];
	};
};