import Fullscreen from "./fullscreen";
import Refresh from "./refresh";
import ScrollToBottom from "./scrollToBottom";
import { type Accessor, Show, type Setter } from "solid-js";
import SwitchModel from "../switchModel";

const Menu = ({ resetChat, setExpanded, model, setModel, fullscreen, light, messageContainer }: {
	resetChat: Function;
	setExpanded: Setter<true | undefined>;
	model: Accessor<string>;
	setModel: Setter<string>;
	fullscreen?: true;
	light?: boolean;
	messageContainer: HTMLDivElement;
}) => {
	return <div class="flex flex-row gap-x-1 p-[10px] self-end items-center absolute z-10 rounded-full">
		<div class="absolute top-0 backdrop-blur-sm left-0 w-full h-full [mask:radial-gradient(ellipse,#fff_0%,transparent_100%)]" />
		<SwitchModel model={ model } setModel={ setModel } light={ light } />
		<ScrollToBottom messageContainer={ messageContainer } />
		<Refresh resetChat={ resetChat } />
		<Show when={ !fullscreen }>
			<Fullscreen setExpanded={ setExpanded } />
		</Show>
	</div>;
};

export default Menu;