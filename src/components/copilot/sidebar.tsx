import { For, createEffect, createSignal, type Accessor, type Setter } from "solid-js";

import Loading from "../../assets/loading.svg";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory }from "@google/generative-ai";
import Message from "./message/message";
import Input from "./input";
import { MessageType } from "../../types/geminiMessage";
import Title from "./message/title";
import Menu from "./menu/menu";

const Sidebar = (props: {
	showSidebar: Accessor<boolean>;
	setShowSidebar: Setter<boolean>;
	light?: boolean;
}) => {

	const [ width, setWidth ] = createSignal<string>();
	const [ conversation, setConversation ] = createSignal<MessageType[]>(localStorage.getItem("copilotHistory") && JSON.parse(localStorage.getItem("copilotHistory") as string).length % 2 == 1 ? JSON.parse(localStorage.getItem("copilotHistory") as string) : [{
		from: "model",
		message: "Hello! I'm Gemini, your personal AI assistant. How can I help you today?"
	}]);

	let container: HTMLDivElement;
	let messageContainer: HTMLDivElement;
	let liveResponse: HTMLDivElement;

	let mouseDown = false;
	let firstOpen = true;

	const defaultModel = localStorage.getItem("model") ?? "gemini-exp-1121";

	let model = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY).getGenerativeModel({
		model: defaultModel,
	}, {
		apiVersion: "v1beta"
	});

	let Gemini = model.startChat({
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

	createEffect(() => {
		if (firstOpen && props.showSidebar()) {
			messageContainer.scroll({
				top: messageContainer.scrollHeight,
				behavior: "smooth"
			});
			firstOpen = false;
		};
	});

	return <div onDrop={ (e) => {
		console.log(e);
	} } onDragStart={ console.log } onDragEnd={ console.log } ref={ container! } onMouseMove={ ({ x }) =>
		mouseDown && setWidth(Math.max(x - 8, 384) + "px")
	} onClick={ ({ target }) =>
		mouseDown ?
			[ mouseDown = false, messageContainer.style.userSelect = "auto", (container.children[0] as HTMLDivElement).style.transitionProperty = "margin,opacity,width" ] :
			target == container && props.setShowSidebar(false)
	} class="absolute cursor-pointer select-none transition-[backdrop-filter] duration-1000 w-full h-full z-10" style={ {
		"pointer-events": !props.showSidebar() ? "none" : undefined,
		"backdrop-filter": !props.showSidebar() ? "blur(0)" : "blur(4px)"
	} }>
		<div style={ {
			"margin-left": !props.showSidebar() ? "-24rem" : "0.75rem",
			"box-shadow": (props.light ? "#ffffff17" : "#00000017") + (props.showSidebar() ? " 0 0 20px 5px" : " 0 0 0 0"),
			"opacity": props.showSidebar() ? 100 : 0,
			"width": width(),
			"background-color": props.light ? "rgb(255 255 255 / 0.05)" : "rgb(0 0 0 / 0.1)"
		} } class="bg-black/10 w-96 max-w-[calc(100%-1.5rem)] backdrop-blur-md transition-[margin,opacity,width] duration-300 flex mt-3 flex-col cursor-auto rounded-xl h-[calc(100%-1.5rem)]">
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
						<div ref={ liveResponse! } class="font-mona font-medium flex [&_code:not(.hljs)]:text-yellow-200/80 [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:bg-[#282c34] [&_code:not(.hljs)]:px-2 [&_code:not(.hljs)]:py-[0.3rem] [&_hr]:border-white/70 [&_li]:ml-8 [&_code]:rounded-md [&_code>*]:inline-block [&_code>*]:p-1 [&_code>*]:whitespace-pre-wrap [&_code>*]:break-all [&_code]:text-[#ffffff9c] [&_a]:font-bold [&_a]:transition-[font] [&_a]:duration-300 [&_a:hover]:leading-normal [&_a:hover]:text-[1.05rem] [&_:is(h1,h2,h3,h4,h5,h6)]:font-montserrat [&_:is(h1,h2,h3,h4,h5,h6)]:text-white/80 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_*]:whitespace-pre-wrap [&_*]:break-words [&_strong]:font-montserrat [&_strong]:text-white/80 [&_strong]:font-bold [&_ul]:-my-3 [&_ol]:-my-6 [&_:is(ol,ul)]:inline-block [&_a]:text-blue-500/80 flex-col gap-y-3 text-white/70" />
						<img draggable="false" src={ Loading } class="self-center select-none opacity-70 mb-4 w-10" />
					</div>
				</div>
			</div>
			<Menu messageContainer={ messageContainer! } light={ props.light } defaultModel={ defaultModel } setWidth={ setWidth as Setter<string> } setConversation={ setConversation } changeModel={ newModel => {
				model = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY).getGenerativeModel({
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
			<Input showSidebar={ props.showSidebar } geminiContainer={ liveResponse! } setConversation={ setConversation } conversation={ conversation } messageContainer={ messageContainer! } Gemini={ () => Gemini } />
			<line onMouseDown={ () => {
				mouseDown = true;
				(container.children[0] as HTMLDivElement).style.transitionProperty = "margin,opacity";
				messageContainer.style.userSelect = "none";
			} } class="h-[calc(100%-1.5rem)] z-20 self-end w-2 cursor-ew-resize absolute" />
		</div>
	</div>;
};

export default Sidebar;