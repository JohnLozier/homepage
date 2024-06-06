import { BACKUP_GREETING, PROMPT } from "../../env";
import { For, createResource } from "solid-js";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, StartChatParams }from "@google/generative-ai";
import { getMatches, getSoccerNews } from "../lib/soccer";

import DayJS from "dayjs";
import { getNews } from "../lib/news";

const model = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY).getGenerativeModel({
	model: "gemini-1.5-flash",
});

const greetings: Record<string, string> = {
	0: "Good night",
	2: "Sleep well",
	5: "Rise and shine",
	9: "Good morning",
	13: "Good afternoon",
	21: "Good evening",
	23: "Good night",
	24: "Hello"
};

const chatConfig: StartChatParams = {
	generationConfig: {
		temperature: 0.4,
		topP: 0.9,
		responseMimeType: "text/plain"
	},
	safetySettings: [{
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
	}],
	history: []
};

const Greeting = () => {
	const generateInitialGreeting = createResource(async () =>
		await model.startChat(chatConfig)
			.sendMessage([
				{
					text: PROMPT
				},
				{
					text: `Here is a list of current news: ${ JSON.parse(localStorage.getItem("news") as string)?.data?.map(({ description }: {
						description: string,
						title: string,
						pubDate: string
					}) => `"${ description }"`).join(",") || "Could not fetch news" }`
				},
				{
					text: `Here is a list of some live soccer scores: ${ getMatches()?.map(({ teams, time, league } ) => `"${ teams.home.name }" ${ teams.home.goals } - ${ teams.away.goals } "${ teams.away.name }" in a ${ league } match at ${ time } minutes`).join(", ") || "Could not fetch soccer games" }`
				},
				{
					text: `Here is a list of some current soccer news: ${ JSON.parse(localStorage.getItem("soccerNews") as string)?.data?.map(({ title }: {
						title: string
					}) => `"${ title.replace(/[^\x00-\x7F]/g, "") }"`).join(",") || "Could not fetch soccer news" }`
				}
			])
			.then(res => res.response.text())
			.catch(() => undefined)
	, {
		initialValue: ""
	})[0];

	return <h1 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-montserrat [&>span]:animate-fadeIn [&>span]:opacity-0 text-white text-4xl font-black">
		<For each={ (generateInitialGreeting() ?? greetings[Object.keys(greetings).find(hour => parseInt(hour) >= DayJS().hour()) as keyof typeof greetings ?? 24] + BACKUP_GREETING).split(" ") }>
			{ (char, index) =>
				<span style={ {
					"animation-delay": `${ index() * 0.1 }s`
				} }>{ char } </span>
			}
		</For>
	</h1>
};

export default Greeting;