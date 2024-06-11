import { For, createSignal } from "solid-js";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, StartChatParams } from "@google/generative-ai";

import { FiRefreshCcw } from "solid-icons/fi";
import { FiSearch } from "solid-icons/fi";
import Gemini from "../assets/gemini.svg?component-solid";

const model = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY).getGenerativeModel({
	model: "gemini-1.5-flash",
});

const chatConfig: StartChatParams = {
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

const Search = (props: {
	light?: boolean;
}) => {
	let input: HTMLInputElement;

	const [ hasText, setHasText ] = createSignal(false);
	const [ geminiResponse, setGeminiResponse ] = createSignal<string | undefined>();

	const onSubmit = () => {
		window.location.href= "https://www.google.com/search?q=" + input.value;
	};

	document.addEventListener("keydown", (event) =>
		["input", "textarea"].includes((event.target as HTMLElement).localName) ? input == document.activeElement && event.key == "Escape" && input.blur() :
			(event.key == " " || event.key == "s") && [input.focus(), event.preventDefault()]
	);

	const sendGeminiMessage = async () => {
		setGeminiResponse("")
		try {
			await model.startChat(chatConfig)
				.sendMessage(`Return a short and to the point response without markdown to answer the following question. ${input.value}`)
				.then(({ response }) => setGeminiResponse(response.text()));
		} catch {
			setGeminiResponse("I'm sorry, Something went wrong. Please try again later.");
		};
	};

	return <div style={ {
		"background-color": props.light ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.1)",
		"min-height": geminiResponse() != undefined ? "10rem" : "5rem",
	} } class="bg-black/10 backdrop-blur-sm focus-within:w-[45rem] rounded-[2.5rem] animate-grow transition-all duration-500 flex flex-col w-[40rem]">
		<div class="h-20 items-center flex flex-row">
			<FiSearch onClick={ onSubmit } class="w-8 animate-fadeIn [animation-delay:0.5s] [animation-duration:0.5s] opacity-0 hover:scale-110 cursor-pointer transition-transform h-8 text-white/70 ml-5" />
			<input ref={ input! } type="search" onInput={ ({ target }) => setHasText(target.value.length > 0) } onKeyUp={ ({ key, ctrlKey }) => key == "Enter" ? onSubmit() : (key == " " && ctrlKey && geminiResponse() == undefined) ? sendGeminiMessage() : undefined } onSubmit={ onSubmit } class="text-white/70 caret-white/70 font-mona flex-1 h-2/3 outline-none font-medium bg-transparent text-[1.1rem] m-5" />
			<button class="opacity-0 duration-500 hover:scale-110 cursor-pointer transition-[transform,opacity,filter,rotate] mr-5" style={
				hasText() ? {
					opacity: 1,
					rotate: "15deg",
					filter: "blur(0px)"
				} : {
					opacity: 0,
					rotate: "0deg",
					filter: "blur(5px)"
				}
			} onClick={ () =>
				geminiResponse() == undefined ? sendGeminiMessage() : setGeminiResponse(undefined)
			}>
				{ geminiResponse() == undefined ?
					<Gemini fill="#ffffffb2" viewBox="0 0 28 28" class="w-7 hover:rotate-[-30deg] duration-300 transition-transform h-7" /> :
					<FiRefreshCcw color="#ffffffb2" class="w-[1.4rem] h-[1.4rem] hover:rotate-180 duration-300 transition-transform" />
				}
			</button>
		</div>
		<button style={ {
			"margin-bottom": geminiResponse() != undefined ? "1rem" : "0rem",
		} } class="text-white/70 font-mona select-text text-left cursor-default text-base mb-4 mx-4 font-medium [animation-duration:0.5s]">
			<For each={ geminiResponse()?.split(" ") }>
				{
					(word, index) => <span style={ {
						"animation-delay": `${ index() * 100 }ms`,
					} } class="animate-fadeIn opacity-0 cursor-text">
						{ word + (index() == geminiResponse()?.split(" ").length! - 1 ? "" : " ") }
					</span>
				}
			</For>
		</button>
	</div>;
};

export default Search;