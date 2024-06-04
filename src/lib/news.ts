import Axios from "axios";
import DayJS from "dayjs";

export const getNews = () => {
	if (!localStorage.getItem("news") || DayJS().diff(JSON.parse(localStorage.getItem("news") as string).timeStamp as number, "minutes") >= 3) {
		Axios("https://newsdata.io/api/1/latest", {
			params: {
				apiKey: import.meta.env.VITE_NEWS_DATA_API_KEY,
				country: "us",
				category: "top",
				size: 3,
				domain: [
					"nytimes",
					"cnn",
					"abcnews",
					"nbcnews",
					"washingtontimes"
				].join(",")
			}
		}).then(({ data }) =>
			localStorage.setItem("news", JSON.stringify({
				timeStamp: Date.now(),
				data:
					// ...new Set(data.results.map(({ title, description, pubDate }: {
					// 	title: string,
					// 	description: string,
					// 	pubDate: string
					// }) => ({
					// 	title: title,
					// 	description: description,
					// 	publishDate: DayJS(pubDate).format("dddd, MMM D, YYYY [at] h:mm a")
					// })))
					data.results.map(({ description }: {
						description: string,
						title: string,
						pubDate: string
					}) => `"${ description }"`).join(",")
			})));
	};

	return JSON.parse(localStorage.getItem("news") as string)?.data;
};