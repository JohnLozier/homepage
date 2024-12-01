export interface FinanceNews {
	items: string;
	sentiment_score_definition: string;
	relevance_score_definition: string;
	feed: {
		title: string;
		url: string;
		time_published: string;
		authors: string[];
		summary: string;
		banner_image: string | null;
		source: string;
		category_within_source: string;
		source_domain: string;
		topics: {
			topic: string;
			relevance_score: string;
		}[];
		overall_sentiment_score: number;
		overall_sentiment_label: string;
		ticker_sentiment: {
			ticker: string;
			relevance_score: string;
			ticker_sentiment_score: string;
			ticker_sentiment_label: string;
		}[];
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