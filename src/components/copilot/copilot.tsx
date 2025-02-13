import { Show, createEffect, createSignal, onMount } from "solid-js";

import Icon from "./icon";
import Sidebar from "./sidebar";
import { shown } from "~/lib/show";

const Copilot = () => {

	const [ showSidebar, setShowSidebar ] = createSignal(false);

	onMount(() =>
		document.addEventListener("keydown", (event) =>
			!["input", "textarea"].includes((event.target as HTMLElement).localName) && event.key == "c" && !event.ctrlKey ?
				[setShowSidebar(current => !current), event.preventDefault()] :
				event.key == "Escape" && setShowSidebar(false)
		)
	);

	createEffect(() =>
		!showSidebar() && document.documentElement.focus()
	);

	return <Show when={ shown() }>
		<Icon setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
		<Sidebar setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
	</Show>;
};

export default Copilot;