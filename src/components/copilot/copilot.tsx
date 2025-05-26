import { Show, createEffect, createSignal, onMount } from "solid-js";

import Icon from "./icon";
import Sidebar from "./sidebar";
import { shown } from "~/lib/show";

const Copilot = () => {

	const [ open, setOpen ] = createSignal(false);

	onMount(() =>
		document.addEventListener("keydown", (event) =>
			!["input", "textarea"].includes((event.target as HTMLElement).localName) && event.key == "c" && !event.ctrlKey ?
				[setOpen(current => !current), event.preventDefault()] :
				event.key == "Escape" && setOpen(false)
		)
	);

	createEffect(() =>
		!open() && document.documentElement.focus()
	);

	return <Show when={ shown() }>
		<Icon setOpen={ setOpen } open={ open } />
		<Sidebar setOpen={ setOpen } open={ open } />
	</Show>;
};

export default Copilot;