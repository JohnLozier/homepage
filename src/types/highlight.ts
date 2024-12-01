export interface Highlight {
	id: number;
	type: "VERIFIED" | "UNVERIFIED";
	imgUrl: string;
	title: string;
	description: string | null;
	url: string;
	embedUrl: string;
	channel: string;
	source: string;
	match: {
		id: number;
		round: string;
		date: string;
		country: {
			code: string;
			name: string;
			logo: string;
		};
		awayTeam: {
			id: number;
			logo: string;
			name: string;
		};
		homeTeam: {
			id: number;
			logo: string;
			name: string;
		};
		league: {
			id: number;
			logo: string;
			name: string;
			season: number;
		};
	};
};