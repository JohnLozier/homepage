import { createEffect, createSignal, type Accessor, type Setter } from "solid-js";

import type { ChatSession } from "@google/generative-ai";
import { FiSend } from "solid-icons/fi";
import { MessageType } from "../../types/geminiMessage";
import parseMarkdown from "../../lib/parseMarkdown";

const Input = (props: {
	setConversation: Setter<MessageType[]>;
	conversation: Accessor<MessageType[]>;
	showSidebar: Accessor<boolean>;
	messageContainer: HTMLDivElement;
	geminiContainer: HTMLDivElement;
	Gemini: () => ChatSession;
}) => {

	const [ locked, setLocked ] = createSignal(false);
	const [ isEmpty, setIsEmpty ] = createSignal(true);

	let input: HTMLTextAreaElement;

	const onInput = () => {
		input.style.height = "auto";
		input.style.height = Math.min(Math.ceil(input.scrollHeight / 24), 15) * 1.5 + "rem";
		setIsEmpty(input.value.length <= 0);
	};

	createEffect(() =>
		props.showSidebar() && input.focus()
	);

	const sendMessage = async () => {
		setLocked(true);
		const text = input.value;
		input.value = "";
		input.style.height = "3rem";

		const isAtBottom = Math.abs(props.messageContainer.scrollHeight - props.messageContainer.scrollTop - props.messageContainer.clientHeight) < 50;

		props.setConversation(current => [ ...current, {
			from: "user" as const,
			message: text
		}]);

		isAtBottom && props.messageContainer.scroll({
			top: props.messageContainer.scrollHeight,
			behavior: "smooth"
		});

		let geminiResponseText = "";

		try {
			const geminiResponse = await props.Gemini().sendMessageStream(text);


			for await (const message of geminiResponse.stream) {
				geminiResponseText += message.text();
				const isAtBottom = Math.abs(props.messageContainer.scrollHeight - props.messageContainer.scrollTop - props.messageContainer.clientHeight) < 50;

				props.geminiContainer.innerHTML = parseMarkdown(geminiResponseText);

				isAtBottom && props.messageContainer.scroll({
					top: props.messageContainer.scrollHeight,
					behavior: "smooth"
				});
			};
		} catch (error) {
			console.error(error);

			geminiResponseText = "I'm sorry, Something went wrong. Please try again later.";
		};

		props.setConversation(current => {
			localStorage.setItem("copilotHistory", JSON.stringify([ ...current, {
				from: "model" as const,
				message: geminiResponseText
			}]));

			props.geminiContainer.innerHTML = "";

			return [ ...current, {
				from: "model" as const,
				message: geminiResponseText
			}]
		});

		setLocked(false);
	};

	return <div class="m-3 items-center p-3 gap-x-2 flex flex-row bg-black/10 rounded-lg">
		<textarea ref={ input! } onKeyUp={ ({ key, shiftKey, target }) =>
			key == "Enter" && !shiftKey && !locked() && (target as HTMLTextAreaElement).value.match(/\S/)?.[0] ?
				sendMessage() :
				onInput()
		} onInput={ ({ inputType }) =>
			inputType != "insertText" && onInput()
		} class="flex-1 resize-none text-base outline-none bg-transparent h-12 text-white/70 caret-white/70 font-mona" />
		<FiSend style={ locked() || isEmpty() ? {
			opacity: 0.5,
			"pointer-events": "none"
		} : {} } onClick={ sendMessage } stroke-width={ 2 } class="w-6 h-6 transition-[transform] duration-200 hover:scale-110 cursor-pointer text-white/70" />
	</div>
};

export default Input;