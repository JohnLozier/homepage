import { For, Show, createEffect, createSignal } from "solid-js";

import { FiChevronRight } from "solid-icons/fi";
import { cn } from "~/lib/utils";

const Searches = ({ searches }: {
	searches: {
		title: string;
		url: string;
	}[];
}) => {
	const [ expanded, setExpanded ] = createSignal(false);

	let chevron: SVGSVGElement;

	createEffect(() => {
		if (expanded()) {
			// @ts-expect-error
			const animation = chevron!.getAnimations().find((animation) => animation.animationName == "fadeIn");

			animation!.cancel();
			animation!.play();
		}
	});

	return <div class="flex flex-wrap flex-row items-center gap-2">
		<For each={ searches.slice(0, expanded() ? undefined : 3) }>
			{
				({ url, title }, index) => {
					const Element = () => <a target="_blank" style={ {
						"animation-delay": `${ index() * 0.1 }s`
					} } class="text-blue-300/80 animate-fadeIn font-mona font-semibold opacity-0 hover:scale-105 transition-[scale] duration-300 text-sm p-1 px-2 cursor-pointer bg-white/10 h-fit rounded-md max-w-32 overflow-ellipsis whitespace-nowrap overflow-hidden" href={ url }>{ title }</a>;

					return <Show when={ searches.length > 3 && index() == (expanded() ? searches.length - 1 : 2) } fallback={ <Element /> }>
						<div class="flex flex-row items-center gap-x-2">
							<Element />
							<FiChevronRight ref={ chevron! } onClick={ () => setExpanded(!expanded()) } style={ {
								"animation-delay": `${ (expanded() ? searches.length : Math.min(searches.length, 3)) * 0.1 }s`
							} } class={ cn("text-white font-medium text-sm hover:pl-1 animate-fadeIn opacity-0 transition-[padding-left,rotate] duration-300 cursor-pointer", expanded() && "rotate-180") } size={ 20 } stroke-width={ 2 } />
						</div>
					</Show>
				}
			}
		</For>
	</div>;
};

export default Searches;