import { For, createEffect, createResource, createSignal } from "solid-js";

import Article from "./article";
import OneFootball from "../../assets/onefootball.svg";
import { getNews } from "../../lib/news";
import { getSoccerNews } from "../../lib/soccer";

const News = (props: {
	light: boolean;
}) => {

	const [ newsList, setNewsList ] = createSignal<{
		img: string,
		author?: string,
		content?: string,
		authorImg: string,
		link: string,
		date?: string
	}[]>([]);

	const [ News ] = createResource(getNews);

	const [ SoccerNews ] = createResource(getSoccerNews);

	createEffect(() =>
		setNewsList(current => [...current, ...(News()?.map(news => ({
			img: news.image_url,
			content: news.title,
			link: news.link,
			author: news.creator ?? undefined,
			authorImg: news.source_icon,
			date: news.pubDate
		})) ?? [])])
	);

	createEffect(() =>
		setNewsList(current => [...current, ...(SoccerNews()?.map(news => ({
			content: news.title,
			img: news.img,
			link: news.url,
			author: "OneFootball",
			authorImg: OneFootball,
		})) ?? [])])
	);

	return <div class="h-full overflow-hidden">
		<div class="[scrollbar-width:none] w-full pb-5 h-full overflow-y-scroll">
			<div class="mt-2 grid-cols-3 grid rounded-t-md items-center gap-5 ">
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
	</div>
};

export default News;