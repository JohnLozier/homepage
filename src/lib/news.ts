import Axios from "axios";
import DayJS from "dayjs";
import { News } from "../types/news";

export const getNews = () => {
	if (!localStorage.getItem("news") || DayJS().diff(JSON.parse(localStorage.getItem("news") as string).timeStamp as number, "minutes") >= 3) {
		return Axios<{
			results: News[]
		}>("https://newsdata.io/api/1/latest", {
			params: {
				apikey: import.meta.env.PUBLIC_NEWS_DATA_API_KEY,
				country: "us",
				category: "top",
				size: 5,
				domain: [
					"nytimes",
					"cnn",
					"nbcnews",
					"washingtontimes"
				].join(",")
			}
		}).then(({ data }) => {
			localStorage.setItem("news", JSON.stringify({
				timeStamp: Date.now(),
				data: data.results
			}));

			return data.results;
		});
	};

	return JSON.parse(localStorage.getItem("news") as string)?.data as News[];
};