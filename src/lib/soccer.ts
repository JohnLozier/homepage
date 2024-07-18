import Axios from "axios"
import DayJS from "dayjs";
import { Match } from "../types/match";
import { SoccerNews } from "../types/soccerNews";

const teamIDs = [
	529,
	9568,
	530,
	541,
	33,
	34,
	40,
	42,
	47,
	49,
	50,
	66,
	2,
	85,
	16489,
	2384,
	10,
	9,
	25,
	157,
	165,
	168,
	492,
	489,
	496,
	505,
	194,
	1118,
	768,
	26,
	6,
	16,
	27,
	1,
	3,
	7,
	24,
	5529,
	12,
	4
];

export const getMatches = () => {

	const mapMatch = (data: Match[]) =>
		data.filter(({ league, teams }) =>
			((league.id == 2 || league.id == 3) && league.round.includes("Qualifying")) ? false : (league.id == 667 || league.id == 10) ? teamIDs.includes(teams.home.id) || teamIDs.includes(teams.away.id) : true
		).map(({ fixture, goals, league, teams, events }) => ({
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
			events: (events.length > 4 || (data.length > 2 && events.length < 7) ? events.filter(({ type }) => type != "subst") : events).map(({ type, team, player, assist, time, detail }) => ({
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
		})).sort(({ teams: { home, away } }) => teamIDs.includes(home.id) || teamIDs.includes(away.id) ? 1 : 0)

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
			const removedDuplicates = data.slice(0, 5).reduce((prev: SoccerNews[], current) => prev.findIndex(e => e.title == current.title) < 0 ? [ ...prev, current ] : prev, []);

			localStorage.setItem("soccerNews", JSON.stringify({
				timeStamp: Date.now(),
				data: removedDuplicates
			}));

			return removedDuplicates;
		});
	}

	return JSON.parse(localStorage.getItem("soccerNews") as string)?.data as SoccerNews[];
};