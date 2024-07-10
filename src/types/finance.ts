export interface FinanceNews {
	results: {
		id: string;
		publisher: {
			name: string;
			homepage_url: string;
			logo_url: string;
			favicon_url: string
		};
		title: string;
		author: string;
		published_utc: string;
		article_url: string;
		tickers: string[];
		image_url: string;
		description: string;
		keywords: string[];
		insights: [
			{
				ticker: string;
				sentiment: string;
				sentiment_reasoning: string
			}
		]
	}[];
};

export type Stocks = Record<string, {
	symbol: string;
	name: string;
	exchange: string;
	datetime: string;
	timestamp: number;
	open: string;
	high: string;
	low: string;
	close: string;
	previous_close: string;
	change: string;
	percent_change: string;
	rolling_1d_change: string;
	rolling_7d_change: string;
	rolling_change: string;
	is_market_open: boolean;
	fifty_two_week:	{
		low: string;
		high: string;
		low_change: string;
		high_change: string;
		low_change_percent: string;
		high_change_percent: string;
		range: string;
	};
}>;