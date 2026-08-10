import { HackerNews, HackerNewsHit, News } from "../types/news";

import Axios from "axios";
import DayJS from "dayjs";

const fetchNews = (domain: string[]) =>
	Axios<{ results: News[] }>("https://newsdata.io/api/1/latest", {
		params: {
			apikey: import.meta.env.PUBLIC_NEWS_DATA_API_KEY,
			country: "us",
			category: "top",
			size: 5,
			domain: domain.join(",")
		}
	}).then(({ data }) => data.results);

export const getNews = () => {
	if (!localStorage.getItem("news") || DayJS().diff(JSON.parse(localStorage.getItem("news") as string).timeStamp as number, "minutes") >= 3) {
		return Promise.all([
			fetchNews([
				"nytimes",
				"cnn",
				"nbcnews",
				"washingtontimes"
			]),
			fetchNews([
				"techcrunch",
				"theverge",
				"wired",
				"arstechnica"
			])
		]).then(([ general, tech ]) => {
			const results = [ ...general, ...tech ];

			localStorage.setItem("news", JSON.stringify({
				timeStamp: Date.now(),
				data: results
			}));

			return results;
		});
	};

	return JSON.parse(localStorage.getItem("news") as string)?.data as News[];
};

const fetchHackerNews = (query: string) =>
	Axios<{ hits: HackerNewsHit[] }>("https://hn.algolia.com/api/v1/search_by_date", {
		params: {
			tags: "story",
			hitsPerPage: 5,
			query
		}
	}).then(({ data }) => data.hits);

const fetchPreviewImage = async (url: string) => {
	const { data } = await Axios<{ data: { image?: { url?: string } } }>("https://api.microlink.io", {
		params: { url }
	});

	return data.data.image?.url;
};

export const getHackerNews = () => {
	if (!localStorage.getItem("hackerNews") || DayJS().diff(JSON.parse(localStorage.getItem("hackerNews") as string).timeStamp as number, "minutes") >= 5) {
		return Promise.all([
			"AI",
			"LLM",
			"OpenAI",
			"Anthropic",
			"Claude",
			"Gemini",
			"DeepSeek"
		].map(fetchHackerNews)).then(async hits => {
			const results = await Promise.all([ ...new Map(hits.flat().map(hit => [ hit.objectID, hit ])).values() ]
				.sort((a, b) => b.points - a.points || b.created_at.localeCompare(a.created_at))
				.slice(0, 5)
				.map(async ({ title, url, author, created_at: date, points, objectID }) => ({
					title,
					url: url || `https://news.ycombinator.com/item?id=${ objectID }`,
					author,
					date,
					points,
					image: url ? await fetchPreviewImage(url) : undefined
				})));

			localStorage.setItem("hackerNews", JSON.stringify({
				timeStamp: Date.now(),
				data: results
			}));

			return results;
		});
	};

	return JSON.parse(localStorage.getItem("hackerNews") as string)?.data as HackerNews[];
};
