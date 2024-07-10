import { FinanceNews, Stocks } from "../types/finance";

import Axios from "axios";
import DayJS from "dayjs";

export const getFinanceNews = () => {
	const mapFinanceNews = (data: FinanceNews) => data.results.map(({ publisher, title, image_url, article_url, insights }) => ({
		title: title.match(/.{0,70}((?=\s))+/)?.[0],
		publisher: publisher.name,
		icon: publisher.logo_url,
		image_url,
		article_url,
		insights: insights.slice(0,3).map(({ ticker, sentiment }) => ({
			ticker,
			positive: sentiment != "Negative",
		}))
	}));

	if (!localStorage.getItem("financeNews") || DayJS().diff(JSON.parse(localStorage.getItem("financeNews") as string).timeStamp as number, "minutes") >= 7) {
		return Axios<FinanceNews>("https://api.polygon.io/v2/reference/news", {
			params: {
				apiKey: import.meta.env.VITE_FINANCE_NEWS_API_KEY,
				limit: 5,
			}
		}).then(({ data }) => {
			const formated = mapFinanceNews(data);

			localStorage.setItem("financeNews", JSON.stringify({
				timeStamp: Date.now(),
				data: formated
			}));

			return formated;
		});
	};

	return JSON.parse(localStorage.getItem("financeNews") as string)?.data as ReturnType<typeof mapFinanceNews>;
};

export const getStocks = () => {
	const mapStocks = (data: Stocks) => Object.values(data).map(({ symbol, name, close, percent_change }) => ({
		name: name.replace(/\s.*/, "").toUpperCase(),
		price: parseFloat(close),
		symbol: symbol.replace("/USD", ""),
		percent_change: parseFloat(percent_change)
	}));

	if (!localStorage.getItem("stocks") || DayJS().diff(JSON.parse(localStorage.getItem("stocks") as string).timeStamp as number, "minutes") >= 1) {
		return Axios<Stocks>("https://api.twelvedata.com/quote", {
			params: {
				apikey: import.meta.env.VITE_FINANCE_STOCKS_API_KEY,
				symbol: [
					[
						"ETH/USD",
						"BTC/USD",
						"GOOG",
						"AAPL",
						"MSFT",
						"NVDA",
						"AMZN",
						"META",
						"TSLA",
						"GME",
						"DOGE/USD"
					].sort(() => Math.random() - 0.5).slice(0, 5).sort(stock => stock.includes("/USD") ? 0 : 1).join(","),
					[
						"SPX",
						"IXIC",
						"DJI"
					][Math.floor(Math.random() * 3)]
				].join(",")
			}
		}).then(({ data }) => {
			const formated = mapStocks(data);

			localStorage.setItem("stocks", JSON.stringify({
				timeStamp: Date.now(),
				data: formated
			}));

			return formated;
		});
	};

	return JSON.parse(localStorage.getItem("stocks") as string)?.data as ReturnType<typeof mapStocks>;
};