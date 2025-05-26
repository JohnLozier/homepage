import { Accessor, createSignal } from "solid-js";

import { FiChevronDown } from "solid-icons/fi";
import { cn } from "~/lib/utils";

const Thinking = ({ ref, children, show }: {
	ref?: HTMLDivElement;
	children?: string;
	show?: Accessor<boolean>;
}) => {
	const [ open, setOpen ] = createSignal(true);

	return <div class={ cn("flex ml-2 flex-col", {
		"hidden": !children && (!show || !show())
	}) }>
		<h2 class="flex font-mona font-medium text-sm items-center gap-x-2 text-white/70">
			Thinking...
			<FiChevronDown stroke-width={ 2 } onClick={ () => setOpen(current => !current) } class={ cn("size-5 cursor-pointer transition-[rotate] duration-200", {
				"rotate-180": !open()
			}) } />
		</h2>
		<div innerHTML={ children ?? "" } ref={ ref } class={ cn("max-h-0 pr-1 overflow-scroll transition-[max-height] duration-300 font-mona ml-2 select-text font-medium text-xs inline-block break-words [&_p:has(strong)+p]:ml-3 [&_p:not(:has(strong))]:my-1 [&_code:not(.hljs)]:text-yellow-200 [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:bg-[#282c3480] [&_code:not(.hljs)]:px-2 [&_code:not(.hljs)]:py-[0.3rem] [&_hr]:border-white/70 [&_li]:ml-8 [&_code]:rounded-md [&_code>*]:inline-block [&_code>*]:p-1 [&_code>*]:whitespace-pre-wrap [&_code>*]:break-all [&_code]:text-[#ffffff9c] [&_a]:font-bold [&_a]:transition-[scale] [&_a]:duration-300 [&_a:hover]:scale-105 [&_:is(h1,h2,h3,h4,h5,h6)]:font-montserrat [&_:is(h1,h2,h3,h4,h5,h6)]:text-white/80 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_*]:whitespace-pre-wrap [&_*]:break-words [&_strong]:font-montserrat [&_strong]:text-white/80 [&_strong]:font-bold [&_ul]:-my-3 [&_ol]:-my-6 [&_:is(ol,ul)]:inline-block [&_a]:text-blue-500/80 flex-col gap-y-3 text-white/70", {
			"[&_*]:animate-fadeIn [&_*]:[animation-duration:300ms]": !children,
			"max-h-96": open()
		}) } />
	</div>
};

export default Thinking;