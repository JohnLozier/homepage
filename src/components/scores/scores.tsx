import { For, createResource, createSignal } from "solid-js";

import Score from "./score";
import { getMatches } from "../../lib/soccer";

const INITIAL_SHOWN = 2;

const Scores = () => {

	const [ scores ] = createResource(getMatches);

	const [ amountShown, setAmountShown ] = createSignal(INITIAL_SHOWN);

	let container: HTMLDivElement;

	return <div class="absolute left-10 bottom-5 inset-y-5 flex justify-end items-center flex-col gap-y-1">
		<div ref={ container! } onClick={ () => setAmountShown(amount => amount == -1 ? INITIAL_SHOWN : -1) } style={ {
			"pointer-events": scores()?.length! > INITIAL_SHOWN ? undefined : "none",
			"overflow": amountShown() == -1 ? "scroll" : "hidden"
		} } class="flex-col-reverse w-max select-none cursor-pointer max-h-full [scrollbar-width:none] flex justify-stretch">
			<For each={ scores() }>
				{ (match, index) =>
					<Score match={ match } index={ index } shown={ amountShown } INITIAL_SHOWN={ INITIAL_SHOWN } length={ scores()?.length! } />
				}
			</For>
		</div>
	</div>
};

export default Scores;