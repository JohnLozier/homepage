import { Accessor, JSX, Setter, createEffect, createSignal } from "solid-js";

import { cn } from "~/lib/utils";
import { light } from "~/lib/background";

const Expand = ({ children, expanded, isOpen, setOpen, fullscreen }: {
	children: JSX.Element;
	expanded: Accessor<true | undefined>;
	isOpen: Accessor<boolean>;
	setOpen?: Setter<boolean>;
	fullscreen?: true;
}) => {
	const [ width, setWidth ] = createSignal<string | undefined>(expanded() ? "100%" : undefined);

	createEffect(() =>
		setWidth(expanded() ? "100%" : undefined)
	);

	let container: HTMLDivElement;

	let mouseDown = false;

	return <div onMouseMove={ ({ x }) =>
		mouseDown && setWidth(Math.max(x - 8, 384) + "px")
	} onClick={ ({ target, currentTarget }) => {
		if (mouseDown) {
			container!.style.transitionProperty = "margin,opacity,width";
			container!.style.userSelect = "auto";

			mouseDown = false;
		} else if (target == currentTarget) {
			setOpen?.(false);
		};
	} } class={ cn("absolute cursor-pointer select-none transition-[backdrop-filter,margin,opacity] duration-1000 w-full h-full z-10", {
		"pointer-events-none": !isOpen(),
		"blur-[4px]": !isOpen()
	}) }>
		<div ref={ container! } onDrop={ (e) => {
			e.preventDefault();
			console.log(e);
		} } onDragOver={ console.log } style={ {
			"box-shadow": (light() ? "#ffffff17" : "#00000017") + (isOpen() ? " 0 0 20px 5px" : " 0 0 0 0"),
			"width": width()
		} } class={ cn("bg-black/30 w-96 ml-3 max-w-[calc(100%-1.5rem)] opacity-0 backdrop-blur-md transition-[margin,opacity] duration-300 flex mt-3 flex-col cursor-auto rounded-xl h-[calc(100%-1.5rem)]", {
			"max-w-full h-full rounded-none ml-0! mt-0": fullscreen,
			"opacity-100": isOpen(),
			"bg-white/10": light(),
			"-ml-96": !isOpen()
		}) }>
			{ children }
			<line onMouseDown={ () => {
				mouseDown = true;
				container!.style.transitionProperty = "margin,opacity";
				container!.style.userSelect = "none";
			} } onMouseUp={ () => {
				mouseDown = false;
				container!.style.transitionProperty = "margin,opacity,width";
				container!.style.userSelect = "auto";
			} } class={ cn("h-[calc(100%-1.5rem)] z-20 self-end w-2 cursor-ew-resize absolute", fullscreen && "hidden") } />
		</div>
	</div>
};

export default Expand;