export interface News {
	"article_id": string,
	"title": string,
	"link": string,
	"keywords": [
		"us"
	],
	"creator": null | string,
	"video_url": null | string,
	"description": string,
	"content": "ONLY AVAILABLE IN PAID PLANS",
	"pubDate": string,
	"image_url": string,
	"source_id": string,
	"source_priority": number,
	"source_url": string,
	"source_icon": string,
	"language": "english",
	"country": [
		"united states of america"
	],
	"category": [
		"top"
	],
	"ai_tag": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
	"sentiment": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
	"sentiment_stats": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLANS",
	"ai_region": "ONLY AVAILABLE IN CORPORATE PLANS",
	"ai_org": "ONLY AVAILABLE IN CORPORATE PLANS"
};

export interface HackerNewsHit {
	title: string
	url: string | null
	author: string
	created_at: string
	points: number
	objectID: string
};

export interface HackerNews {
	title: string
	url: string
	author: string
	date: string
	points: number
	image?: string
};