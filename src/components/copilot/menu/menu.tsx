import Fullscreen from "./fullscreen";
import { MessageType } from "../../../types/geminiMessage";
import Refresh from "./refresh";
import ScrollToBottom from "./scrollToBottom";
import type { Setter } from "solid-js";
import SwitchModel from "../switchModel";

const Menu = (props: {
	setConversation: Setter<MessageType[]>;
	resetGemini: () => void;
	changeModel: (model: string) => void;
	setWidth: Setter<string>;
	defaultModel: string;
	light?: boolean;
	messageContainer: HTMLDivElement;
}) => {
	return <div class="flex flex-row gap-x-1 p-[10px] self-end items-center absolute z-10 rounded-full">
		<div class="absolute top-0 backdrop-blur-sm left-0 w-full h-full [mask:radial-gradient(ellipse,#fff_0%,transparent_100%)]" />
		<SwitchModel defaultModel={ props.defaultModel } changeModel={ props.changeModel } light={ props.light } />
		<ScrollToBottom messageContainer={ props.messageContainer } />
		<Refresh setConversation={ props.setConversation } resetGemini={ props.resetGemini } />
		<Fullscreen setWidth={ props.setWidth } />
	</div>;
};

export default Menu;