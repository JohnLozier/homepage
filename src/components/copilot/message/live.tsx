import { Accessor, For, createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";

import { MessageType } from "~/types/geminiMessage";
import Searches from "./searches";
import Thinking from "./thinking";
import Title from "./title";
import { cn } from "~/lib/utils";
import { parse } from "~/lib/markdown";

const Live = ({ liveMessage }: {
	liveMessage: Accessor<{
		active: boolean;
	} & Omit<MessageType, "from">>;
}) => {
	const [ time, setTime ] = createSignal(0);

	let live: HTMLDivElement;
	let thinking: HTMLDivElement;

	let timeout: ReturnType<typeof setInterval>;

	createEffect(on(liveMessage, ({ text, thinking: thinkingText, active }) => {
		for (const { markdown, root } of [ {
			markdown: text ? parse(text) : undefined,
			root: live!
		}, {
			markdown: thinkingText ? parse(thinkingText) : undefined,
			root: thinking!
		}]) {
			if (markdown) {
				const template = document.createElement("template");
				template.innerHTML = markdown;

				const stack = [ {
					tree: root as Node,
					changed: template.content.childNodes
				} ];

				while (stack.length > 0) {
					const { tree, changed } = stack.pop()!;

					for (let i = 0; i < changed.length; i++) {
						const replacement = changed.item(i)!;
						const existing = tree.childNodes.item(i);

						if (!existing) {
							tree.appendChild(replacement.cloneNode(true));
						} else if (existing.nodeType != replacement.nodeType || existing.nodeName != replacement.nodeName) {
							existing.replaceWith(replacement.cloneNode(true));
						} else if (existing.nodeType == Node.TEXT_NODE) {
							if (existing.textContent != replacement.textContent) {
								existing.textContent = replacement.textContent;
							}
						} else if (existing.nodeType == Node.ELEMENT_NODE) {
							if ((existing as HTMLElement).children.length == 0 || (replacement as HTMLElement).children.length == 0) {
								if (((existing as HTMLElement).childNodes.length != (replacement as HTMLElement).childNodes.length) || Array.from((existing as HTMLElement).childNodes).some((child, index) =>
									!child.isEqualNode((replacement as HTMLElement).childNodes[index])
								)) {
									(existing as HTMLElement).replaceChildren(...replacement.childNodes);
								};
							} else {
								stack.push({
									tree: existing,
									changed: replacement.childNodes
								});
							};
						};
					};
				};
			} else {
				root.replaceChildren();
			};
		};

		if (active) {
			clearInterval(timeout);

			timeout = setInterval(() =>
				setTime(time => time + 1)
			, 100);
		} else {
			clearInterval(timeout);

			setTime(0);
		};
	}));

	const thoughts = createMemo(() => (liveMessage().thinking?.length ?? 0) > 0);

	onCleanup(() =>
		clearInterval(timeout)
	);

	return <div class={ cn("flex flex-col gap-y-2", {
		"hidden": !liveMessage().active
	}) }>
		<Title showAnimation from="model" time={ time } />
		<Thinking ref={ thinking! } show={ thoughts } />
		<div ref={ live! } class="font-mona select-text font-medium !inline-block break-words [&_*]:animate-fadeIn [&_*]:[animation-duration:300ms] [&_code:not(.hljs)]:text-yellow-200/80 [&_code:not(.hljs)]:font-semibold [&_code:not(.hljs)]:bg-[#282c34] [&_code:not(.hljs)]:px-2 [&_code:not(.hljs)]:py-[0.3rem] [&_hr]:border-white/70 [&_li]:ml-8 [&_code]:rounded-md [&_code>*]:inline-block [&_code>*]:p-1 [&_code>*]:whitespace-pre-wrap [&_code>*]:break-all [&_code]:text-[#ffffff9c] [&_a]:font-bold [&_a]:transition-[font] [&_a]:duration-300 [&_a:hover]:leading-normal [&_a:hover]:text-[1.05rem] [&_:is(h1,h2,h3,h4,h5,h6)]:font-montserrat [&_:is(h1,h2,h3,h4,h5,h6)]:text-white/80 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_*]:whitespace-pre-wrap [&_*]:break-words [&_strong]:font-montserrat [&_strong]:text-white/80 [&_strong]:font-bold [&_ul]:-my-3 [&_ol]:-my-6 [&_:is(ol,ul)]:inline-block [&_a]:text-blue-500/80 flex-col gap-y-3 text-white/70" />
		<Searches searches={ [ ...(liveMessage()?.grounding ?? []), ...(liveMessage()?.searches ?? []).map(search => ({
			title: search,
			url: `https://google.com/search?q=${ search }` }))
		] } />
		<div class="flex flex-row justify-between items-center px-2 mb-4">
			<div class="flex flex-row gap-x-2">
				<For each={ Array(3) }>
					{ (_, index) =>
						<div class="w-2 h-2 bg-white/50 animate-bounce rounded-full" style={{
							"animation-delay": `${ (index() ** 2 + index()) / 20 }s`
						}} />
					}
				</For>
			</div>
		</div>
	</div>
};

export default Live;