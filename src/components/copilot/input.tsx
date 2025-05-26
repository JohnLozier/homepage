import { createEffect, createSignal, Resource, Setter, Show, type Accessor } from "solid-js";

import { FiSend } from "solid-icons/fi";
import { Chat, Type } from "@google/genai";
import { MessageError, MessageType } from "~/types/geminiMessage";

const Input = ({ abort, setLiveMessage, isOpen, pushHistory, chat, messageContainer }: {
	abort: AbortController;
	messageContainer: HTMLDivElement;
	isOpen: Accessor<boolean>;
	setLiveMessage: Setter<{
		active: boolean;
	} & Omit<MessageType, "from">>;
	pushHistory: (message: MessageType) => void;
	chat: Resource<Chat>;
}) => {
	const [ streaming, setStreaming ] = createSignal(false);
	const [ isEmpty, setIsEmpty ] = createSignal(true);

	let input: HTMLTextAreaElement;

	const onInput = () => {
		input!.style.height = "auto";
		input!.style.height = Math.min(Math.ceil(input!.scrollHeight / 24), 15) * 1.5 + "rem";
		setIsEmpty(input!.value.length <= 0);
	};

	createEffect(() =>
		isOpen?.() && input!.focus()
	);

	const sendMessage = async () => {
		setStreaming(true);

		const text = input!.value;

		input!.value = "";
		input!.style.height = "3rem";

		const isAtBottom = Math.abs(messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight) < 50;

		pushHistory({
			from: "user",
			text: text
		});

		isAtBottom && messageContainer.scroll({
			top: messageContainer.scrollHeight,
			behavior: "smooth"
		});

		try {
			const stream = await chat()!.sendMessageStream({
				message: text,
				config: {
					abortSignal: abort.signal,
					thinkingConfig: {
						includeThoughts: true
					},
					toolConfig: {
						// functionCallingConfig: {
						// 	allowedFunctionNames: [
						// 		"openSources",
						// 		"copy",
						// 		"createDraftEmail"
						// 	]
						// },
						// retrievalConfig: {
						// 	latLng: {

						// 	}
						// }
					},
					tools: [
						{
							// codeExecution: {},
							googleSearch: {},
							// functionDeclarations: [
							// 	{
							// 		name: "openSources",
							// 		description: "Opens new tabs to documentation, searches or other relevant information to help answer the users questions and give them more details",
							// 		parameters: {
							// 			type: Type.OBJECT,
							// 			properties: {
							// 				urls: {
							// 					type: Type.ARRAY,
							// 					items: {
							// 						type: Type.STRING,
							// 						pattern: "^https?:\\/\\/.+$"
							// 					},
							// 					maxItems: "5"
							// 				}
							// 			}
							// 		}
							// 	}, {
							// 		name: "copy",
							// 		description: "If code then copies each code block to the clipboard in the order of most to least useful. Don't combine different areas of code or files. If not code then copies a single answer or most useful peice of content",
							// 		parameters: {
							// 			type: Type.OBJECT,
							// 			properties: {
							// 				content: {
							// 					type: Type.ARRAY,
							// 					items: {
							// 						type: Type.STRING,
							// 						description: "Single code block with just the code or the answer or most useful peice of content"
							// 					},
							// 					maxItems: "7"
							// 				}
							// 			}
							// 		}
							// 	}, {
							// 		name: "createDraftEmail",
							// 		description: "Creates a new draft email with a body and subject",
							// 		parameters: {
							// 			type: Type.OBJECT,
							// 			properties: {
							// 				body: {
							// 					type: Type.STRING,
							// 					description: "The body for the email"
							// 				},
							// 				subject: {
							// 					type: Type.STRING,
							// 					description: "The subject of the email"
							// 				}
							// 			}
							// 		}
							// 	}
							// ]
						}
					]
				}
			});

			let message = {
				text: "",
				thinking: "",
				toolCalls: [],
				grounding: [] as {
					title: string;
					url: string;
				}[],
				searches: [] as string[]
			};

			setLiveMessage({
				...message,
				active: true
			});

			for await (const response of stream) {
				const candidate = response.candidates?.[0];

				if (!candidate) {
					continue;
				};

				const isAtBottom = Math.abs(messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight) < 50;

				message = setLiveMessage(live => ({
					active: live.active,
					text: live.text + (response.text ?? ""),
					grounding: [ ...message.grounding, ...(candidate?.groundingMetadata?.groundingChunks?.flatMap(({ web }) => web?.title && web?.uri ? ({
						title: web.title,
						url: web.uri
					}) : []) ?? []) ],
					searches: [ ...message.searches, ...(candidate?.groundingMetadata?.webSearchQueries ?? []) ],
					thinking: live.thinking + (candidate.content?.parts?.reduce((prev, { thought, text }) =>
						prev + (thought ? (text ?? "") : ""),
					"") ?? ""),
					toolCalls: []
				}));

				isAtBottom && messageContainer.scroll({
					top: messageContainer.scrollHeight,
					behavior: "smooth"
				});
			};

			pushHistory({
				from: "model",
				...message
			});

			message = setLiveMessage({
				active: false,
				text: "",
				thinking: "",
				grounding: [],
				searches: [],
				toolCalls: []
			});
		} catch (error: any) {
			console.error(error);

			setLiveMessage({
				active: false,
				text: "",
				thinking: "",
				grounding: [],
				searches: [],
				toolCalls: []
			});

			try {
				const parsedError = JSON.parse(error.message.replace(/^got status: \d\d\d \. /, "")) as MessageError;

				const { error: { message: errorMessage } } = JSON.parse(parsedError.error.message) as MessageError;

				pushHistory({
					from: "model",
					text: errorMessage
				});
			} catch {
				pushHistory({
					from: "model",
					text: "Sorry, something went wrong while generating your response. Please try again."
				});
			}
		};

		setStreaming(false);
	};

	return <div class="m-3 mt-0 items-center p-3 gap-x-2 flex flex-row bg-black/10 rounded-lg">
		<textarea ref={ input! } onKeyUp={ ({ key, shiftKey, target }) =>
			key == "Enter" && !shiftKey && !streaming() && (target as HTMLTextAreaElement).value.match(/\S/)?.[0] && sendMessage()
		} onKeyDown={ (e) =>
			e.key == "Enter" && !e.shiftKey && !streaming() && (e.target as HTMLTextAreaElement).value.match(/\S/)?.[0] ?
				e.preventDefault()
				: onInput()
		} onInput={ ({ inputType }) =>
			inputType != "insertText" && onInput()
		} class="flex-1 resize-none text-base outline-none bg-transparent h-12 text-white/70 caret-white/70 font-mona" />
		<Show when={ !streaming() } fallback={
			<div onClick={ () => {
				abort.abort();

				const message = setLiveMessage({
					active: false,
					text: "",
					grounding: [],
					searches: [],
					toolCalls: []
				});

				setStreaming(false);

				pushHistory({
					from: "model",
					...message
				});
			} } class="size-3.5 transition-[scale] duration-200 hover:scale-110 animate-fadeIn cursor-pointer bg-white/50 rounded-xs" />
		}>
			<FiSend style={ isEmpty() ? {
				opacity: 0.5,
				"pointer-events": "none"
			} : {} } onClick={ sendMessage } stroke-width={ 2 } class="size-6 transition-[scale] duration-200 hover:scale-110 animate-fadeIn cursor-pointer text-white/70" />
		</Show>
	</div>
};

export default Input;