import "highlight.js/styles/atom-one-dark-reasonable.min.css";

import { Accessor, For, onMount } from "solid-js";

import { MessageType } from "../../../types/geminiMessage";
import ParseMarkdown from "../../../lib/parseMarkdown";
import Title from "./title";

const Message = ({ from, message }: MessageType, index: Accessor<number>) => {

	let messages: HTMLDivElement;

	onMount(() => {
		if (from == "model") {
			if (index() != 0) {
				messages!.innerHTML = ParseMarkdown(message as string);
			} else {
				message.split(" ").forEach((word, wordIndex) => {
					const span = document.createElement("span");
					span.innerText = word + " ";
					span.style.animationDelay = `${ wordIndex * 200 }ms`;

					messages!.appendChild(span);
				});
			};
		};
	});

	return <div class="flex flex-col gap-y-2">
		<Title from={ from } />
		{ from == "user" ?
			<div class="font-mona whitespace-pre-wrap select-text font-medium [&>*]:animate-fadeIn [&>*]:opacity-0 break-words text-white/70">
				<For each={ from == "user" && message.split(" ") }>
					{ (char, spanIndex) =>
						<span style={{
							"animation-delay": `${ spanIndex() * (1 / message.split(" ").length) }s`
						}}>{ char } </span>
					}
				</For>
			</div> :
			<div ref={ messages! } class={ `font-mona select-text font-medium flex [&_code:not(.hljs)]:text-yellow-200/80 [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:bg-[#282c34] [&_code:not(.hljs)]:px-2 [&_code:not(.hljs)]:py-[0.3rem] [&_hr]:border-white/70 [&_li]:ml-8 [&_code]:rounded-md [&_code>*]:inline-block [&_code>*]:p-1 [&_code>*]:whitespace-pre-wrap [&_code>*]:break-all [&_code]:text-[#ffffff9c] [&_a]:font-bold [&_a]:transition-[font] [&_a]:duration-300 [&_a:hover]:leading-normal [&_a:hover]:text-[1.05rem] [&_:is(h1,h2,h3,h4,h5,h6)]:font-montserrat [&_:is(h1,h2,h3,h4,h5,h6)]:text-white/80 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_*]:whitespace-pre-wrap [&_*]:break-words [&_strong]:font-montserrat [&_strong]:text-white/80 [&_strong]:font-bold [&_ul]:-my-3 [&_ol]:-my-6 [&_:is(ol,ul)]:inline-block [&_a]:text-blue-500/80 flex-col gap-y-3 text-white/70 ${ index() == 0 ? "[&_*]:opacity-0 [&_*]:animate-fadeIn !inline-block break-words" : "" }` } />
		}
	</div>
};

export default Message;