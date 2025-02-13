import { For, createEffect, createSignal, onMount, type Accessor, type Setter } from "solid-js";

import Loading from "../../assets/loading.svg?url";
import { type ChatSession, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory }from "@google/generative-ai";
import Message from "./message/message";
import Input from "./input";
import { MessageType } from "../../types/geminiMessage";
import Title from "./message/title";
import Menu from "./menu/menu";
import { changeModel, defaultModel } from "~/lib/gemini";
import { light } from "~/lib/background";
import { cn } from "~/lib/utils";

const Sidebar = (props: {
	showSidebar?: Accessor<boolean>;
	setShowSidebar?: Setter<boolean>;
	fullscreen?: true;
}) => {

	const shown = () => props.showSidebar?.() ?? true;

	const [ width, setWidth ] = createSignal<string | undefined>(props.fullscreen ? "100%" : undefined);
	const [ conversation, setConversation ] = createSignal<MessageType[]>([{
		from: "model",
		message: "Hello! I'm Gemini, your personal AI assistant. How can I help you today?"
	}]);

	const abortChat = new AbortController();

	let container: HTMLDivElement;
	let messageContainer: HTMLDivElement;
	let liveResponse: HTMLDivElement;

	let mouseDown = false;
	let firstOpen = true;

	let model = new GoogleGenerativeAI(import.meta.env.PUBLIC_GEMINI_API_KEY).getGenerativeModel({
		model: defaultModel
	}, {
		apiVersion: "v1beta"
	});

	let Gemini: ChatSession;

	createEffect(() => {
		if (firstOpen && shown()) {
			messageContainer!.scroll({
				top: messageContainer!.scrollHeight,
				behavior: "smooth"
			});
			firstOpen = false;
		};
	});

	onMount(() => {
		changeModel(localStorage.getItem("model") ?? "gemini-exp-1206");

		Gemini = model.startChat({
			generationConfig: {
				responseMimeType: "text/plain"
			},
			safetySettings: [{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
			},
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
			}],
			history: (localStorage.getItem("copilotHistory") && JSON.parse(localStorage.getItem("copilotHistory") as string).length % 2 == 1) ? (JSON.parse(localStorage.getItem("copilotHistory") as string) as MessageType[]).slice(1).map(({ from, message }) => {
				return {
					role: from,
					parts: [{
						text: message
					}]
				};
			}) : undefined
		});

		setConversation(localStorage.getItem("copilotHistory") && JSON.parse(localStorage.getItem("copilotHistory") as string).length % 2 == 1 ? JSON.parse(localStorage.getItem("copilotHistory") as string) : [{
			from: "model",
			message: "Hello! I'm Gemini, your personal AI assistant. How can I help you today?"
		}]);
	});

	return <div ref={ container! } onMouseMove={ ({ x }) =>
		mouseDown && setWidth(Math.max(x - 8, 384) + "px")
	} onClick={ ({ target }) =>
		mouseDown ?
			[ mouseDown = false, messageContainer!.style.userSelect = "auto", (container!.children[0] as HTMLDivElement).style.transitionProperty = "margin,opacity,width" ] :
			target == container! && props.setShowSidebar?.(false)
	} class="absolute cursor-pointer select-none transition-[backdrop-filter] duration-1000 w-full h-full z-10" style={ {
		"pointer-events": !shown() ? "none" : undefined,
		"backdrop-filter": !shown() ? "blur(0)" : "blur(4px)"
	} }>
		<div onDrop={ (e) => {
			e.preventDefault();
			console.log(e);
		} } onDragOver={ console.log } style={ {
			"margin-left": !shown() ? "-24rem" : "0.75rem",
			"box-shadow": (light() ? "#ffffff17" : "#00000017") + (shown() ? " 0 0 20px 5px" : " 0 0 0 0"),
			"opacity": shown() ? 100 : 0,
			"width": width(),
			"background-color": light() ? "rgb(255 255 255 / 0.05)" : "rgb(0 0 0 / 0.1)"
		} } class={ cn("bg-black/10 w-96 max-w-[calc(100%-1.5rem)] backdrop-blur-md transition-[margin,opacity,width] duration-300 flex mt-3 flex-col cursor-auto rounded-xl h-[calc(100%-1.5rem)]", props.fullscreen && "max-w-full h-full rounded-none ml-0! mt-0") }>
			<div ref={ messageContainer! } class="flex-1 w-max-full [scrollbar-width:none] mt-3 ml-3 overflow-scroll">
				<div class="mr-3 flex flex-col gap-y-4">
					<For each={ conversation() }>
						{
							Message
						}
					</For>
					<div style={{
						display: conversation().slice(-1)[0].from == "user" ? undefined : "none"
					}} class="flex flex-col gap-y-2">
						<Title showAnimation from="model" />
						<div ref={ liveResponse! } class="font-mona select-text font-medium flex [&_code:not(.hljs)]:text-yellow-200/80 [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:bg-[#282c34] [&_code:not(.hljs)]:px-2 [&_code:not(.hljs)]:py-[0.3rem] [&_hr]:border-white/70 [&_li]:ml-8 [&_code]:rounded-md [&_code>*]:inline-block [&_code>*]:p-1 [&_code>*]:whitespace-pre-wrap [&_code>*]:break-all [&_code]:text-[#ffffff9c] [&_a]:font-bold [&_a]:transition-[font] [&_a]:duration-300 [&_a:hover]:leading-normal [&_a:hover]:text-[1.05rem] [&_:is(h1,h2,h3,h4,h5,h6)]:font-montserrat [&_:is(h1,h2,h3,h4,h5,h6)]:text-white/80 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_*]:whitespace-pre-wrap [&_*]:break-words [&_strong]:font-montserrat [&_strong]:text-white/80 [&_strong]:font-bold [&_ul]:-my-3 [&_ol]:-my-6 [&_:is(ol,ul)]:inline-block [&_a]:text-blue-500/80 flex-col gap-y-3 text-white/70" />
						<img draggable="false" src={ Loading } class="self-center select-none opacity-70 mb-4 w-10" />
					</div>
				</div>
			</div>
			<Menu fullscreen={ props.fullscreen } messageContainer={ messageContainer! } light={ light() } defaultModel={ defaultModel } setWidth={ setWidth as Setter<string> } setConversation={ setConversation } changeModel={ newModel => {
				model = new GoogleGenerativeAI(import.meta.env.PUBLIC_GEMINI_API_KEY).getGenerativeModel({
					model: newModel,
				});

				Gemini = model.startChat({
					generationConfig: {
						responseMimeType: "text/plain"
					},
					safetySettings: [{
						category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_HARASSMENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					}],
					history: conversation().slice(1).length % 2 == 1 ? conversation().slice(1).map(({ from, message }) => ({
						role: from,
						parts: [{
							text: message
						}]
					})) : conversation().length == 1 ? [] : conversation().slice(1,-1).map(({ from, message }) => ({
						role: from,
						parts: [{
							text: message
						}]
					}))
				});

				if (conversation().slice(1).length % 2 == 1 && conversation().length != 1) {
					setConversation(current =>
						current.slice(0, -1)
					);
				};
			} } resetGemini={ () => {
				abortChat.abort();

				Gemini = model.startChat({
					generationConfig: {
						responseMimeType: "text/plain"
					},
					safetySettings: [{
						category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_HARASSMENT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					},
					{
						category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
						threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
					}],
					history: []
				});
			} } />
			<Input abortSignal={ abortChat.signal } showSidebar={ props.showSidebar } geminiContainer={ liveResponse! } setConversation={ setConversation } conversation={ conversation } messageContainer={ messageContainer! } Gemini={ () => Gemini } />
			<line onMouseDown={ () => {
				mouseDown = true;
				(container!.children[0] as HTMLDivElement).style.transitionProperty = "margin,opacity";
				messageContainer!.style.userSelect = "none";
			} } class={ cn("h-[calc(100%-1.5rem)] z-20 self-end w-2 cursor-ew-resize absolute", props.fullscreen && "hidden") } />
		</div>
	</div>;
};

export default Sidebar;