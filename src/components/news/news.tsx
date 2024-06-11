import { For, createEffect, createResource, createSignal, onMount } from "solid-js";

import Article from "./article";
import ESPN from "../../assets/espn.svg";
import { getNews } from "../../lib/news";
import { getSoccerNews } from "../../lib/soccer";

const News = (props: {
	light: boolean;
}) => {

	let container: HTMLDivElement

	const [ newsList, setNewsList ] = createSignal<{
		img: string,
		author?: string,
		content?: string,
		authorImg: string,
		link: string,
		date?: string
	}[]>([]);

	const [ News ] = createResource(async () => (await getNews())?.map(news => ({
		img: news.image_url,
		content: news.title,
		link: news.link,
		author: news.creator ?? undefined,
		authorImg: news.source_icon,
		date: news.pubDate
	})).sort( () => 0.5 - Math.random()));

	const [ SoccerNews ] = createResource(async () => (await getSoccerNews())?.map(news => ({
		content: news.title,
		img: news.img,
		link: news.url,
		author: "ESPN",
		authorImg: ESPN,
	})).sort( () => 0.5 - Math.random()));

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(SoccerNews() ?? [])])
	);

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(News() ?? [])])
	);

	onMount(() =>
		container.scrollTop = 0
	);

	return <div ref={ container! } class="[scrollbar-width:none] h-[25vh] w-full pb-5 flex-1 overflow-y-scroll">
		<div class="mt-2 grid-cols-3 grid items-center overflow-hidden gap-5 ">
			<For each={ newsList() }>
				{ (news, index) =>
					<Article
						light={ props.light }
						img={ news.img }
						author={ news.author }
						content={ news.content }
						authorImg={ news.authorImg }
						link={ news.link }
						date={ news.date }
						index={ index() }
					/>
				}
			</For>
		</div>
	</div>
};

export default News;