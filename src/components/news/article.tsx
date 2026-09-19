import { For, Show, createSignal } from "solid-js";

import DayJS from "dayjs";
import { light } from "~/lib/background";
import relativeTime from "dayjs/plugin/relativeTime";

DayJS.extend(relativeTime);

const Article = (props: {
	img?: string,
	authorImg?: string,
	link: string,
	insights?: {
		ticker: string,
		positive: boolean
	}[],
	content?: string,
	author?: string,
	date?: string,
	index: number
}) => {
	const [ imageFailed, setImageFailed ] = createSignal(false);

	return <a draggable="false" style={ {
		"background-color": light() ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.1)",
		"animation-delay": `${ props.index * 200 }ms`
	} } onFocus={ ({ target }) => (target as HTMLAnchorElement).blur() } href={ props.link } class="group flex h-full w-full flex-col overflow-hidden rounded-xl opacity-0 animate-[fadeIn_1s_ease-out_forwards,up_1s_ease-out] backdrop-blur-sm z-10 cursor-pointer ring-1 ring-white/15 transition-transform duration-300 hover:-translate-y-1">
		<div class="overflow-hidden">
			<Show when={ imageFailed() || props.img == undefined } fallback={
				<img onError={ () => setImageFailed(true) } draggable="false" class="aspect-video w-full select-none object-cover transition-transform duration-500 group-hover:scale-105" src={ props.img } />
			}>
				<div class="aspect-video w-full bg-white/5"/>
			</Show>
		</div>
		<div class="flex flex-1 flex-col gap-y-2 px-4 py-3">
			<p class="text-white font-mona font-semibold">{ props.content }</p>
			<div class="flex flex-row justify-between items-center w-full gap-x-2">
				<Show when={ props.authorImg }>
					<img draggable="false" class="w-6 h-6 rounded-full select-none" src={ props.authorImg } />
				</Show>
				<span class="text-white font-montserrat overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{ props.author ?? "Unknown" }</span>
				<Show when={ props.insights && props.insights?.length > 0 } fallback={
					<Show when={ props.date }>
						<span class="text-white/70 flex-1 whitespace-nowrap font-mona text-sm ml-auto font-medium">{ DayJS(props.date).fromNow() }</span>
					</Show>
				}>
					<div class="flex overflow-scroll [scrollbar-width:none] flex-row gap-x-2">
						<For each={ props.insights }>
							{ insight =>
								<div style={ {
									"background-color": insight.positive ? "#266e14" : "#bd0000"
								} } class="flex flex-row opacity-50 px-2 py-1 rounded-md gap-x-1 items-center">
									<span class="text-white font-mona text-xs">{ insight.ticker }</span>
								</div>
							}
						</For>
					</div>
				</Show>
			</div>
		</div>
	</a>;
};

export default Article;
