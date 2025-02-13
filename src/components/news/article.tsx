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
	} } onFocus={ ({ target }) => (target as HTMLAnchorElement).blur() } href={ props.link } class="flex w-full opacity-0 animate-[fadeIn_1s_ease-out_forwards,up_1s_ease-out] [&:hover>img]:scale-105 backdrop-blur-sm z-10 duration-300 cursor-pointer hover:-translate-y-2 transition-all bg-black/10 p-5 rounded-md h-full items-center flex-col gap-y-2">
		<Show when={ imageFailed() || props.img == undefined } fallback={
			<img onError={ () => setImageFailed(true) } draggable="false" class="aspect-video hover:scale-105 select-none object-cover rounded-md transition-transform duration-300 w-full" src={ props.img } />
		}>
			<div class="aspect-video hover:scale-105 rounded-md transition-transform animate-fadeIn [animation-duration:300ms] duration-300 w-full bg-white/5 flex items-center justify-center"/>
		</Show>
		<p class="text-white font-mona mb-4 font-semibold">{ props.content }</p>
		<div class="flex flex-row mt-auto justify-between items-center w-full gap-x-2 self-start">
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
	</a>;
};

export default Article;