export interface Forecast {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	daily_units: {
		time: string;
		weathercode: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
	};
	daily: {
		weathercode: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
	};
};