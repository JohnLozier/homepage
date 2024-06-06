import { createEffect, createSignal } from "solid-js";

import Icon from "./icon";
import Sidebar from "./sidebar";

const Copilot = (props: {
	light?: boolean;
}) => {

	const [ showSidebar, setShowSidebar ] = createSignal(false);

	document.addEventListener("keydown", (event) =>
		!["input", "textarea"].includes((event.target as HTMLElement).localName) && event.key == "c" ?
			[setShowSidebar(current => !current), event.preventDefault()] :
			event.key == "Escape" && setShowSidebar(false)
	);

	createEffect(() =>
		!showSidebar() && document.documentElement.focus()
	);

	return <>
		<Icon setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
		<Sidebar light={ props.light } setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
	</>;
};

export default Copilot;