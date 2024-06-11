import { Accessor, Match, Switch, createEffect, createResource, createSignal, on, onCleanup } from "solid-js";
import { get, set } from "../lib/indexDB";

import Axios from "axios";
import type { Random } from "unsplash-js/dist/methods/photos/types";
import { YOUTUBE_URLS } from "../../env";
import { YouTubePlayer } from "youtube-player/dist/types";
import Youtube from "youtube-player";
import { createApi } from "unsplash-js";

const Unsplash = createApi({
	accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY
});

const Background = (props: {
	type: Accessor<"gradient" | "animated" | "live" | "image">;
}) => {

	let YoutubePlayer: YouTubePlayer;

	const youtubeUrls = YOUTUBE_URLS;

	const rand = Math.floor(Math.random() * 360);

	const [ rgb, setRGB ] = createSignal([
		rand,
		(rand + 75) % 360
	]);

	const [ image, { refetch } ] = createResource(props.type, async (type) => {

		if (type != "image") {
			return undefined;
		};

		const blob = await get<Blob>("unsplash", "images", "image");

		return blob ? URL.createObjectURL(blob) : ((await Unsplash.photos.getRandom({
			collectionIds: [ "U4hZz7KKhQU" ]
		}))?.response as Random)?.urls?.full + "&w=1440";
	}, {
		deferStream: true
	});

	createEffect(async () => {
		const newRand = Math.floor(Math.random() * 360);

		switch (props.type()) {
		case "gradient":
			setRGB([
				newRand,
				(newRand + 75) % 360
			]);

			break;
		case "animated":
			setRGB([
				newRand,
				(newRand + 75) % 360
			]);

			const interval = setInterval(() => {
				setRGB(current => [
					(current[0] + 1) % 360,
					(current[1] + 1) % 360
				]);
			}, 100);

			onCleanup(() =>
				clearInterval(interval)
			);

			break;
		case "live":
			(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style["transitionProperty"] = "none";
			(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style.opacity = "0";
			(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style.filter = "blur(5px)";

			if (!(document.querySelector("#youtubeIframe") as HTMLIFrameElement).src) {
				YoutubePlayer = Youtube("youtubeIframe", {
					playerVars: {
						autoplay: 1
					}
				});
				await YoutubePlayer.mute();

				YoutubePlayer.on("stateChange", async ({ data }) => {
					if (data == 0) {
						YoutubePlayer.playVideo();
					} else if (data == 1) {
						(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style["transitionProperty"] = "opacity,filter";
						(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style.opacity = "1";
						(document.querySelector("#youtubeIframe") as HTMLIFrameElement).style.filter = "blur(0px)";
					};
				});
			};

			const url = await YoutubePlayer.getVideoUrl();

			const indexOfPrevious = youtubeUrls.findIndex(id => id.replace(/\?.*/, "") == url.replace(/^(.*v=|.*(?!v=))/, ""));

			const videoID = youtubeUrls[((indexOfPrevious >= 0 ? indexOfPrevious : (Math.random() * youtubeUrls.length) | 0) + 1) % youtubeUrls.length].split("?");

			await YoutubePlayer.loadVideoById(videoID[0], parseInt(videoID[1] || "0"));
			await YoutubePlayer.playVideo();

			break;
		}
	});

	createEffect(on(props.type, async () =>
		props.type() == "image" && refetch()
	, {
		defer: true
	}));

	return <Switch fallback={
		<div style={ {
			"background": `hsl(${ rgb()[0] } 100% 50%)`
		} } class="w-full absolute h-full -z-10">
			<div style={ {
				"background": `linear-gradient(45deg, hsl(${ rgb()[0] } 100% 50%), hsl(${ rgb()[1] } 100% 50%))`
			} } class="w-full h-full animate-fadeIn duration-500" />
		</div>
	}>
		<Match when={ props.type() == "live" }>
			<div class="bg-black w-full h-full absolute -z-10">
				<div id="youtubeIframe" class="w-full h-full transition-[opacity,filter] opacity-0 duration-1000" />
			</div>
		</Match>
		<Match when={ props.type() == "image" }>
			<div class="w-full h-full absolute bg-black -z-10">
				<img draggable="false" onLoad={ async ({ target }) => {
					(target as HTMLImageElement).style.opacity = "1";
					(target as HTMLImageElement).style.filter = "blur(0px)";

					const unsplash = await Unsplash.photos.getRandom({
						collectionIds: [ "U4hZz7KKhQU" ]
					});

					const { data } = await Axios((unsplash.response as Random).urls.full + "&w=1440", {
						responseType: "blob"
					});
					set("unsplash", "images", "image", await data);

				} } class="w-full h-full select-none object-cover transition-[opacity,filter] opacity-0 blur-sm duration-1000" src={ image?.() } />
			</div>
		</Match>
	</Switch>
};

export default Background;