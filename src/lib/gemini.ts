export const models = new Map(Object.entries({
	"gemini-2.0-pro-exp-02-05": {
		name: "Gemini 2.0 Pro",
		experimental: true
	},
	"gemini-2.0-flash": {
		name: "Gemini 2.0 Flash",
		experimental: false
	},
	"gemini-1.5-pro": {
		name: "Gemini 1.5 Pro",
		experimental: false
	},
	"gemini-exp-1206": {
		name: "Gemini 1206",
		experimental: true
	},
	"gemini-2.0-flash-thinking-exp-01-21": {
		name: "Gemini 2.0 Thinking",
		experimental: true
	}
}));

export let defaultModel = "gemini-2.0-pro-exp-02-05";

export const changeModel = (model: string) => {
	defaultModel = model;
};