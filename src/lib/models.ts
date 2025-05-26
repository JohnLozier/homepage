import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

export const models = new Map(Object.entries({
	"gemini-2.5-pro-exp-03-25": {
		name: "Gemini 2.5 Pro",
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
	"gemini-2.5-flash-preview-05-20": {
		name: "Gemini 2.5 Flash",
		experimental: true
	},
	"gemini-2.0-flash-thinking-exp-01-21": {
		name: "Gemini 2.0 Thinking",
		experimental: true
	},
	"gemini-2.0-flash-preview-image-generation": {
		name: "Gemini 2.0 Flash Image Generation",
		experimental: true
	}
}));

export const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	}
]

export const gemini = new GoogleGenAI({
	apiKey: import.meta.env.PUBLIC_GEMINI_API_KEY
});

export const defaultModel = "gemini-2.0-flash-thinking-exp-01-21";