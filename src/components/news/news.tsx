import { For, createEffect, createResource, createSignal, onMount } from "solid-js";

import Article from "./article";
import ESPN from "../../assets/espn.svg";
import { getFinanceNews } from "../../lib/finance";
import { getHighlights } from "../../lib/highlights";
import { getNews } from "../../lib/news";
import { getSoccerNews } from "../../lib/soccer";

const News = (props: {
	light: boolean;
}) => {

	let container: HTMLDivElement

	const [ newsList, setNewsList ] = createSignal<{
		img?: string,
		author?: string,
		content?: string,
		authorImg?: string,
		link: string,
		insights?: {
			ticker: string,
			positive: boolean
		}[],
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

	const [ FinanceNews ] = createResource(async () => (await getFinanceNews())?.map(news => ({
		content: news.title,
		img: news.image_url || undefined,
		link: news.article_url,
		author: news.publisher,
		authorImg: news.icon,
		insights: news.insights
	})).sort( () => 0.5 - Math.random()));

	const [ Highlights ] = createResource(async () => (await getHighlights())?.map(highlights => ({
		content: highlights.title || `${ highlights.match.homeTeam } VS ${ highlights.match.awayTeam } in the ${ highlights.match.country } ${ highlights.match.league }`,
		img: highlights.imgUrl,
		link: highlights.url,
		date: highlights.match.date,
		author: (highlights.author.channel || highlights.author.source).slice(0,1).toUpperCase() + (highlights.author.channel || highlights.author.source).slice(1),
		authorImg: undefined
	})).sort( () => 0.5 - Math.random()));

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(SoccerNews() ?? [])])
	);

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(News() ?? [])])
	);

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(FinanceNews() ?? [])])
	);

	newsList().length == 0 && createEffect(() =>
		setNewsList(current => [...current, ...(Highlights() ?? [])])
	);

	onMount(() =>
		container.scrollTop = 0
	);

	return <div ref={ container! } class="[scrollbar-width:none] w-full pb-5 flex-1 overflow-y-scroll">
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
						insights={ news.insights }
						index={ index() }
					/>
				}
			</For>
		</div>
	</div>
};

export default News;