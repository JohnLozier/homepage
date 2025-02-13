import { BACKUP_GREETING, PROMPT } from "../../env";
import { For, createResource, onMount } from "solid-js";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory }from "@google/generative-ai";
import { backgroundPattern, light } from "~/lib/background";

import DayJS from "dayjs";
import { cn } from "~/lib/utils";
import { shown } from "~/lib/show";

const model = new GoogleGenerativeAI(import.meta.env.PUBLIC_GEMINI_API_KEY).getGenerativeModel({
	model: "gemini-2.0-flash-lite-preview-02-05",
	systemInstruction: {
		text: PROMPT
	},
	generationConfig: {
		temperature: 0.1, // 0.4
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
	}]
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

const Greeting = () => {
	const [ data, { refetch } ] = createResource(async () => {
		return await model.generateContent([
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
	}, {
		initialValue: "",
		ssrLoadFrom: "initial"
	});

	onMount(refetch);

	return <h1 style={ {
		display: shown() ? undefined : "none"
	} } class={ cn("absolute text-white top-[min(50%,calc(100%-38rem))] [text-shadow:#fff_0_0px_3px] left-1/2 -translate-x-1/2 duration-500 -translate-y-1/2 text-center font-montserrat [&>span]:animate-fadeIn [&>span]:opacity-0 text-4xl font-black", 	light() && "mix-blend-difference") }>
		<For each={ (data() ?? greetings[Object.keys(greetings).find(hour => parseInt(hour) >= DayJS().hour()) as keyof typeof greetings ?? 24] + BACKUP_GREETING).split(" ") }>
			{ (char, index) =>
				<span style={ {
					"animation-delay": `${ index() * 0.05 }s`
				} }>{ char } </span>
			}
		</For>
	</h1>;
};

export default Greeting;