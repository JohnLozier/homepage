import { Accessor, For, Show, createResource } from "solid-js";

import Assist from "../../assets/soccer/assist.svg";
import Ball from "../../assets/soccer/ball.svg";
import ConvertToOpacity from "../../lib/convertToOpacity";
import RedCard from "../../assets/soccer/redCard.svg";
import Sub from "../../assets/soccer/sub.svg";
import YellowCard from "../../assets/soccer/yellowCard.svg";
import type { getMatches } from "../../lib/soccer";

type MatchResult = ReturnType<typeof getMatches>;

type MatchType<T extends ReturnType<typeof getMatches>> =
  T extends Promise<infer U>
    ? U extends (infer V)[] ? V : never
    : T extends (infer W)[] ? W : never;

const Score = ({
	match,
	shown,
	index,
	INITIAL_SHOWN
}: {
	match: MatchType<MatchResult>,
	shown: Accessor<number>,
	index: Accessor<number>,
	INITIAL_SHOWN: number
}) => {
	const [ homeIcon ] = createResource(() => ConvertToOpacity(match.teams.home.icon));
	const [ awayIcon ] = createResource(() => ConvertToOpacity(match.teams.away.icon));

	return <div class="flex flex-col">
		<div style={ {
			opacity: index() < shown() || shown() == -1 ? 1 : 0,
			filter: index() < shown() || shown() == -1 ? "blur(0)" : "blur(5px)",
			"transition-delay": index() < shown() || shown() == -1 ? (index() - INITIAL_SHOWN + 1) * 200 + "ms" : (shown() - INITIAL_SHOWN + 1) * 200 - (index() - INITIAL_SHOWN + 1) * 200 + "ms"
		} } class="font-montserrat transition-[filter,opacity] duration-500 text-white/80 font-semibold grid grid-cols-[1fr_auto_1fr] w-full gap-x-2">
			<div class="flex items-center gap-x-2 flex-row">
				<img draggable="false" src={ homeIcon() } class="h-10 select-none" />
				<span>{ match.teams.home.name }</span>
			</div>
			<span class="flex flex-row items-center gap-x-2 w-min col-auto">
				<span class="text-white font-bold text-lg">{ match.teams.home.goals }</span>
				-
				<span class="text-white/80 font-bold text-xl">{ match.time }'</span>
				-
				<span class="text-white font-bold text-lg">{ match.teams.away.goals }</span>
			</span>
			<div class="flex items-center gap-x-2 justify-end flex-row">
				<span>{ match.teams.away.name }</span>
				<img draggable="false" src={ awayIcon() } class="h-10 select-none" />
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
						opacity: index() < shown() || shown() == -1 ? 1 : 0,
						filter: index() < shown() || shown() == -1 ? "blur(0)" : "blur(5px)",
						// "transition-delay": index() < shown() || shown() == -1 ? index() * 200 - 100 + "ms" : shown() * 500 - (index() * 200 - 100) + "ms"
						"transition-delay": index() < shown() || shown() == -1 ? ((index() - INITIAL_SHOWN + 1) * 200 - (200 / match.events.length) * (eventIndex() + 1)) + "ms" : (shown() - INITIAL_SHOWN + 1) * 200 - ((index() - INITIAL_SHOWN + 1) * 200 - (200 / match.events.length) * (eventIndex() + 1)) + "ms"
					} } class="flex flex-col transition-[filter,opacity] duration-500">
						<div style={ {
							"flex-direction": event.team.id == match.teams.away.id ? "row-reverse" : undefined
						} } class="flex flex-row items-center gap-x-1">
							<h3 class="text-white/70 font-montserrat font-semibold text-lg">{ event.time }'</h3>
							<h2 class="text-white/60 font-mona font-medium">{ event.player ?? (event.team.id == match.teams.away.id ? match.teams.away.name : match.teams.home.name) }</h2>
							<img draggable="false" src={ event.type == "Goal" ? Ball : event.type == "subst" ? Sub : event.detail == "Red Card" ? RedCard : YellowCard } class="w-7 h-7 opacity-80 select-none" />
						</div>
						<Show when={ event.assist }>
							<div style={ {
								"flex-direction": event.team.id == match.teams.away.id ? "row-reverse" : undefined,
								"margin-right": event.team.id == match.teams.away.id ? "2rem" : undefined,
								"margin-left": event.team.id == match.teams.away.id ? undefined : "2rem"
							} } class="flex flex-row opacity-75 items-center gap-x-2">
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