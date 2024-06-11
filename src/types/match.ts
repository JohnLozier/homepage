export interface Match {
	"fixture": {
		"id": number;
		"referee": string;
		"timezone": "UTC";
		"date": string;
		"timestamp": number;
		"periods": {
			"first": number;
			"second": number;
		};
		"venue": {
			"id": number;
			"name": string;
			"city": string;
		};
		"status": {
			"long": string;
			"short":"TBD"|
					"NS"|
					"1H"|
					"HT"|
					"2H"|
					"ET"|
					"BT"|
					"P"|
					"SUSP"|
					"INT"|
					"FT"|
					"AET"|
					"PEN"|
					"PST"|
					"CANC"|
					"ABD"|
					"AWD"|
					"WO"|
					"LIVE";
			"elapsed": number;
		};
	};
	"league": {
		"id": number;
		"name": string;
		"country": string;
		"logo": string;
		"flag": null;
		"season": number;
		"round": string;
	};
	"teams": {
		"home": {
			"id": number;
			"name": string;
			"logo": string;
			"winner": boolean;
		};
		"away": {
			"id": number;
			"name": string;
			"logo": string;
			"winner": boolean;
		}
	};
	"goals": {
		"home": number;
		"away": number;
	};
	"score": {
		"halftime": {
			"home": number | null;
			"away": number | null;
		};
		"fulltime": {
			"home": number | null;
			"away": number | null;
		};
		"extratime": {
			"home": number | null;
			"away": number | null;
		};
		"penalty": {
			"home": number | null;
			"away": number | null;
		}
	};
	"events": {
		"time": {
			"elapsed": number;
			"extra": number | null;
		};
		"team": {
			"id": number;
			"name": string;
			"logo": string;
		};
		"player": {
			"id": number;
			"name": string;
		};
		"assist": {
			"id": number | null;
			"name": string | null;
		};
		"type": string;
		"detail": string;
		"comments": string | null;
	}[];
};