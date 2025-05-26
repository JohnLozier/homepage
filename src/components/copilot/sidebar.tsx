import { For, createEffect, createMemo, createResource, createSignal, on, onMount, type Accessor, type Setter } from "solid-js";

import Message from "./message/message";
import Input from "./input";
import { MessageType } from "../../types/geminiMessage";
import Menu from "./menu/menu";
import { defaultModel, safetySettings, gemini } from '~/lib/models';
// import { useChat } from "@ai-sdk/solid";
import { light } from "~/lib/background";
import Expand from "./expand";
import Live from "./message/live";

const Sidebar = ({ open, setOpen, fullscreen }: {
	open?: Accessor<boolean>;
	setOpen?: Setter<boolean>;
	fullscreen?: true;
}) => {
	const abortChat = new AbortController();

	const isOpen = createMemo(() =>
		open?.() ?? true
	);
	const [ expanded, setExpanded ] = createSignal(fullscreen);
	const [ liveMessage, setLiveMessage ] = createSignal<{
		active: boolean;
	} & Omit<MessageType, "from">>({
		active: false,
		text: "",
		thinking: "",
		grounding: [],
		searches: [],
		toolCalls: []
	});
	const [ model, { mutate: setModel, refetch: refetchModel } ] = createResource(() => localStorage.getItem("model") ?? defaultModel, {
		initialValue: defaultModel,
		ssrLoadFrom: "initial"
	});
	const [ queued, setQueue ] = createSignal<(() => Promise<any>)[]>([]);
	const [ history, { mutate: setHistory, refetch: refetchHistory } ] = createResource<MessageType[]>(() => {
		const history = localStorage.getItem("history");

		if (!history) {
			return [];
		}

		const json = JSON.parse(history) as MessageType[] ?? [];

		if (json?.at(-1)?.from == "user") {
			return json.slice(0, -1);
		};

		return json;
	}, {
		initialValue: [],
		ssrLoadFrom: "initial"
	});

	// const { messages, stop, append, setData, handleSubmit } = useChat();
	
	const [ chat, { refetch: refetchChat } ] = createResource(model, model => gemini.chats.create({
		model,
		history: history()?.map(({ from, text }) => ({
			role: from,
			parts: [
				{
					text: text
				}
			]
		})) ?? [],
		config: {
			thinkingConfig: {
				includeThoughts: true
			},
			safetySettings: safetySettings,
			abortSignal: abortChat.signal
		}
	}), {
		initialValue: undefined,
		ssrLoadFrom: "initial"
	});

	let messageContainer: HTMLDivElement;

	let loopingQueue = false;

	const resetChat = () => {
		abortChat.abort();

		setHistory(() => []);
		setLiveMessage({
			active: false,
			text: "",
			thinking: "",
			grounding: [],
			searches: [],
			toolCalls: []
		});
		refetchChat();
	};

	const pushQueue = (fn: () => Promise<any>) => {
		setQueue(queued => [
			...queued,
			fn
		]);
	};

	const pushHistory = (message: MessageType) => setHistory(current => [
		...current,
		message
	]);

	createEffect(async () => {
		if (loopingQueue) {
			return;
		}

		loopingQueue = true;

		while (queued().length > 0) {
			const func = queued()[0];

			await func();

			setQueue(queued().slice(1));
		}

		loopingQueue = false;
	});

	createEffect((initialOpen: boolean) => {
		if (initialOpen && isOpen()) {
			messageContainer!.scroll({
				top: messageContainer!.scrollHeight,
				behavior: "smooth"
			});

			return false;
		};

		return true;
	}, true);

	let initialModel = true;

	createEffect(on(model, () => {
		if (!initialModel) {
			localStorage.setItem("model", model());

			pushQueue(async () => refetchChat());
		}

		initialModel = false;
	}, {
		defer: true
	}));

	createEffect(on(history, () =>
		localStorage.setItem("history", JSON.stringify(history()))
	, {
		defer: true
	}));

	onMount(() => {
		refetchHistory();
		refetchModel();
	});

	return <Expand expanded={ expanded } isOpen={ isOpen } setOpen={ setOpen } fullscreen={ fullscreen }>
		<div ref={ messageContainer! } class="flex-1 w-max-full [scrollbar-width:none] mt-3 pb-3 ml-3 overflow-scroll">
			<div class="mr-3 flex flex-col gap-y-4">
				<Message from="model" text="Hello! I'm Gemini, your personal AI assistant. How can I help you today?" />
				<For each={ history() }>
					{
						Message
					}
				</For>
				<Live liveMessage={ liveMessage } />
			</div>
		</div>
		<Menu fullscreen={ fullscreen } messageContainer={ messageContainer! } light={ light() } model={ model } setModel={ setModel } setExpanded={ setExpanded } resetChat={ resetChat } />
		<Input abort={ abortChat } messageContainer={ messageContainer! } setLiveMessage={ setLiveMessage } pushHistory={ pushHistory } isOpen={ isOpen } chat={ chat } />
	</Expand>;
};

export default Sidebar;