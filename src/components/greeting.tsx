import { BACKUP_GREETING, PROMPT } from "../../env";
import { For, createSignal, onMount } from "solid-js";
import { GoogleGenAI, ThinkingLevel } from "@google/genai/web";

import DayJS from "dayjs";
import { cn } from "~/lib/utils";
import { light } from "~/lib/background";
import { shown } from "~/lib/show";

const ai = new GoogleGenAI({
	apiKey: import.meta.env.PUBLIC_GEMINI_API_KEY
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
	const [ message, setMessage ] = createSignal("");
	const [ failed, setFailed ] = createSignal(false);

	onMount(async () => {
		try {
			const stream = await ai.models.generateContentStream({
				model: "gemini-3.5-flash-lite",
				config: {
					temperature: 2,
					systemInstruction: PROMPT,
					thinkingConfig: {
						thinkingLevel: ThinkingLevel.MINIMAL
					}
				},
				contents: [
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
				]
			});

			for await (const { text } of stream) {
				setMessage(prev => prev + (text ?? ""));
			};
		} catch (error) {
			console.error(error);

			setFailed(true);
		};
	});

	return <h1 style={ {
		display: shown() ? undefined : "none"
	} } class={ cn("absolute text-white top-[min(50%,calc(100%-38rem))] [text-shadow:#fff_0_0px_3px] left-1/2 -translate-x-1/2 duration-500 -translate-y-1/2 text-center font-montserrat [&>span]:animate-fadeIn [&>span]:opacity-0 text-4xl font-black", 	light() && "mix-blend-difference") }>
		{/* <For each={ (data() ?? greetings[Object.keys(greetings).find(hour => parseInt(hour) >= DayJS().hour()) as keyof typeof greetings ?? 24] + BACKUP_GREETING).split(" ") }>
			{ (char, index) =>
				<span style={ {
					"animation-delay": `${ index() * 0.05 }s`
				} }>{ char } </span>
			}
		</For> */}
		<For each={ failed() ? (greetings[Object.keys(greetings).find(hour => parseInt(hour) >= DayJS().hour()) as keyof typeof greetings ?? 24] + BACKUP_GREETING).split(" ") : message().split(" ") }>
			{ (word, index) =>
				<span style={ {
					"animation-delay": `${ index() * 0.05 }s`
				} }>{ word } </span>
			}
		</For>
	</h1>;
};

export default Greeting;