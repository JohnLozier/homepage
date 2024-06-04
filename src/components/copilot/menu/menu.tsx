import Fullscreen from "./fullscreen";
import { MessageType } from "../../../types/geminiMessage";
import Refresh from "./refresh";
import ScrollToBottom from "./scrollToBottom";
import type { Setter } from "solid-js";

const Menu = (props: {
	setConversation: Setter<MessageType[]>;
	resetGemini: () => void;
	setWidth: Setter<string>;
	messageContainer: HTMLDivElement;
}) => {
	return <div class="flex flex-row gap-x-1 p-[10px] self-end absolute z-10 rounded-full">
		<div class="absolute top-0 backdrop-blur-sm left-0 w-full h-full [mask:radial-gradient(ellipse,#fff_0%,transparent_100%)]" />
		<ScrollToBottom messageContainer={ props.messageContainer } />
		<Refresh setConversation={ props.setConversation } resetGemini={ props.resetGemini } />
		<Fullscreen setWidth={ props.setWidth } />
	</div>;
};

export default Menu;