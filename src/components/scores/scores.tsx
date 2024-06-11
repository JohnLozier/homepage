import { For, createResource, createSignal } from "solid-js";

import Score from "./score";
import { getMatches } from "../../lib/soccer";

const INITIAL_SHOWN = 2;

const Scores = () => {

	const [ scores ] = createResource(getMatches);

	const [ amountShown, setAmountShown ] = createSignal(INITIAL_SHOWN);

	return <div onClick={ () => setAmountShown(amount => amount == -1 ? INITIAL_SHOWN : -1) } class="mt-autogap-y-2 flex-col-reverse w-max left-10 transition-all select-none cursor-pointer duration-500 absolute bottom-5 h-max overflow-hidden flex justify-stretch">
		<For each={ scores() }>
			{ (match, index) =>
				<Score match={ match } index={ index } shown={ amountShown } INITIAL_SHOWN={ INITIAL_SHOWN } />
			}
		</For>
	</div>
};

export default Scores;