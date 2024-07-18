import { Accessor, For, Show, createResource } from "solid-js";

import Assist from "../../assets/soccer/assist.svg";
import Ball from "../../assets/soccer/ball.svg";
import ConvertToOpacity from "../../lib/convertToOpacity";
import { FiArrowUp } from "solid-icons/fi";
import RedCard from "../../assets/soccer/redCard.svg";
import Sub from "../../assets/soccer/sub.svg";
import YellowCard from "../../assets/soccer/yellowCard.svg";
import type { getMatches } from "../../lib/soccer";

type MatchResult = ReturnType<typeof getMatches>;

type MatchType<T extends ReturnType<typeof getMatches>> = T extends (infer V)[] ? V : never;

const Score = ({
	match,
	shown,
	index,
	length,
	INITIAL_SHOWN
}: {
	match: MatchType<MatchResult>,
	shown: Accessor<number>,
	index: Accessor<number>,
	length: number,
	INITIAL_SHOWN: number
}) => {
	const [ homeIcon ] = createResource(() => ConvertToOpacity(match.teams.home.icon));
	const [ awayIcon ] = createResource(() => ConvertToOpacity(match.teams.away.icon));

	return <div class="flex w-[32rem] flex-col">
		{ INITIAL_SHOWN - 1 == index() && length < INITIAL_SHOWN &&
			<div style={ {
				opacity: shown() != -1 ? 1 : 0,
				filter: shown() != -1 ? "blur(0)" : "blur(5px)",
				"transition-delay": shown() != -1 ? `${ (length - INITIAL_SHOWN) * 200 }ms` : "0s"
			} } class="self-center absolute transition-[opacity,blur] duration-500 -translate-y-5 cursor-pointer">
				<FiArrowUp class="w-5 text-white/70 h-5 hover:scale-110 opacity-0 animate-fadeIn [animation-delay:1.2s] hover:-translate-y-1 duration-300 transition-transform" />
			</div>
		}
		<div style={ {
			opacity: (index() < shown() || shown() == -1) && index() >= INITIAL_SHOWN ? 1 : 0,
			filter: index() < shown() || shown() == -1 ? "blur(0)" : "blur(5px)",
			"transition-delay": index() < shown() || shown() == -1 ? (index() - INITIAL_SHOWN + 1) * 200 + "ms" : (shown() - INITIAL_SHOWN + 1) * 200 - (index() - INITIAL_SHOWN + 1) * 200 + "ms",
			"animation": index() < INITIAL_SHOWN ? `fadeIn 1s ease-out ${ (index() + 1) * 500 }ms forwards` : undefined
		} } class="font-montserrat transition-[filter,opacity] duration-500 text-white/80 font-semibold grid grid-cols-[1fr_auto_1fr] w-full gap-x-2">
			<div class="flex items-center gap-x-2 flex-rown overflow-hidden">
				<img draggable="false" style={ {
					opacity: homeIcon() ? 1 : 0,
					filter:  homeIcon() ? "blur(0px)" : "blur(5px)"
				} } src={ homeIcon() } class="h-10 w-10 transition-[opacity,filter] select-none" />
				<span class="text-ellipsis overflow-hidden text-nowrap">{ match.teams.home.name }</span>
			</div>
			<span class="flex flex-row items-center gap-x-2 w-min col-auto">
				<span class="text-white font-bold text-lg">{ match.teams.home.goals }</span>
				-
				<span class="text-white/80 font-bold text-xl">{ match.time }'</span>
				-
				<span class="text-white font-bold text-lg">{ match.teams.away.goals }</span>
			</span>
			<div class="flex items-center gap-x-2 justify-end flex-rown overflow-hidden">
				<span class="text-ellipsis overflow-hidden text-nowrap">{ match.teams.away.name }</span>
				<img style={ {
					opacity: awayIcon() ? 1 : 0,
					filter:  awayIcon() ? "blur(0px)" : "blur(5px)"
				} } draggable="false" src={ awayIcon() } class="h-10 transition-[opacity,filter] w-10 select-none" />
			</div>
		</div>
		<div class="gap-y-2 grid-cols-2 mt-2 grid-flow-col grid">
			<For each={ match.events }>
				{
					(event, eventIndex) => <div style={ {
						"grid-column": event.team.id == match.teams.away.id ? 2 : 1,
						"justify-self": event.team.id == match.teams.away.id ? "start" : "end",
						"margin-left": event.team.id == match.teams.away.id ? "0.5rem" : undefined,
						"margin-right": event.team.id == match.teams.away.id ? undefined : "0.5rem",
						opacity: (index() < shown() || shown() == -1) && index() >= INITIAL_SHOWN ? 1 : 0,
						filter: index() < shown() || shown() == -1 ? "blur(0)" : "blur(5px)",
						"animation": index() < INITIAL_SHOWN ? `fadeIn 1s ease-out ${ index() * 500 + (500 / match.events.length) * eventIndex() }ms forwards` : undefined,
						// "transition-delay": index() < shown() || shown() == -1 ? index() * 200 - 100 + "ms" : shown() * 500 - (index() * 200 - 100) + "ms"
						"transition-delay": index() < shown() || shown() == -1 ? ((index() - INITIAL_SHOWN + 1) * 200 - (200 / match.events.length) * (eventIndex() + 1)) + "ms" : (shown() - INITIAL_SHOWN + 1) * 200 - ((index() - INITIAL_SHOWN + 1) * 200 - (200 / match.events.length) * (eventIndex() + 1)) + "ms"
					} } class="flex flex-col opacity-0 transition-[filter,opacity] duration-500">
						<div style={ {
							"flex-direction": event.team.id == match.teams.away.id ? "row-reverse" : undefined
						} } class="flex flex-row items-center justify-end gap-x-1">
							<h3 class="text-white/70 font-montserrat font-semibold text-lg">{ event.time }'</h3>
							<h2 class="text-white/60 font-mona font-medium">{ event.player ?? (event.team.id == match.teams.away.id ? match.teams.away.name : match.teams.home.name) }</h2>
							<img draggable="false" src={ event.type == "Goal" ? Ball : event.type == "subst" ? Sub : event.detail == "Red Card" ? RedCard : YellowCard } class="w-7 h-7 opacity-80 select-none" />
						</div>
						<Show when={ event.assist }>
							<div style={ {
								"flex-direction": event.team.id == match.teams.home.id ? "row-reverse" : undefined,
								"margin-left": event.team.id == match.teams.away.id ? "2rem" : undefined,
								"margin-right": event.team.id == match.teams.away.id ? undefined : "2rem"
							} } class="flex flex-row opacity-40 items-center gap-x-2">
								{ event.type == "Goal" &&
									<img draggable="false" src={ Assist } class="w-4 h-4 select-none" />
								}
								<h4 class="text-white font-mona font-medium text-sm">{ event.assist }</h4>
							</div>
						</Show>
					</div>
				}
			</For>
		</div>
	</div>
};

export default Score;