import { BACKUP_GREETING, PROMPT } from "../../env";
import { For, createResource } from "solid-js";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, StartChatParams }from "@google/generative-ai";

import DayJS from "dayjs";

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
					text: `Here is a list of some live soccer scores: ${ JSON.parse(localStorage.getItem("news") as string)?.map?.(({ teams, time, league }: {
						teams: {
							home: {
								name: string,
								goals: number
							},
							away: {
								name: string,
								goals: number
							}
						},
						time: number,
						league: string
					} ) => `"${ teams.home.name }" ${ teams.home.goals } - ${ teams.away.goals } "${ teams.away.name }" in a ${ league } match at ${ time } minutes`).join(", ") || "Failed to fetch soccer games, some may still exist" }`
				},
				{
					text: `Here is a list of current news: ${ JSON.parse(localStorage.getItem("news") as string)?.data?.slice(0, 5).map(({ description }: {
						description: string,
						title: string,
						pubDate: string
					}) => `"${ description }"`).join(",") || "Failed to fetch news, some may still exist" }`
				},
				{
					text: `Here is a list of some current soccer news: ${ JSON.parse(localStorage.getItem("soccerNews") as string)?.data?.map(({ title }: {
						title: string
					}) => `"${ title.replace(/[^\x00-\x7F]/g, "") }"`).join(",") || "Failed to fetch soccer news, some may still exist" }`
				},
				{
					text: `Here is a list of some current finance news: ${ JSON.parse(localStorage.getItem("financeNews") as string)?.data?.map(({ title }: {
						title: string
					}) => `"${ title.replace(/[^\x00-\x7F]/g, "") }"`).join(",") || "Failed to fetch finance news, some may still exist" }`
				}
			])
			.then(res => res.response.text())
			.catch(() => undefined)
	, {
		initialValue: ""
	})[0];

	return <h1 class="absolute top-[min(50%,calc(100%-38rem))] [text-shadow:#fff_0_0px_3px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-montserrat [&>span]:animate-fadeIn [&>span]:opacity-0 text-white text-4xl font-black">
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