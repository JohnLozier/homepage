import { For, createEffect, createResource } from "solid-js";

import Axios from      "axios";
import BTC from "../assets/crypto/BTC.svg";
import DOGE from "../assets/crypto/DOG.svg";
import ETH from "../assets/crypto/ETH.svg";

const Crypto = () => {

	const coins = {
		"ethereum": ETH,
		"bitcoin": BTC,
		"dogecoin": DOGE
	};

	const [ data ] = createResource<{
		symbol: string;
		current_price: number;
		id: string;
		price_change_percentage_24h: number;
	}[]>(() =>
		Axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ Object.keys(coins).join(",") }&per_page=3&page=1&sparkline=false&price_change_percentage=24h`)
			.then(({ data }) =>
				data
			), {
		initialValue: localStorage.getItem("weather") ? JSON.parse(localStorage.getItem("crypto") as string) : undefined
	});

	createEffect(() =>
		localStorage.setItem("crypto", JSON.stringify(data()))
	);


	return <div class="flex flex-col gap-5">
		<For each={ data() }>
			{ ({ symbol, price_change_percentage_24h, current_price, id }, index) =>
				<div class="flex w-64 flex-row">
					<img style={ {
						"animation-delay": `${ index() * 0.3 }s`
					} } class="self-center animate-fadeIn opacity-0 w-12" src={ coins[id as keyof typeof coins] }/>
					<div class="flex ml-2 flex-col">
						<h1 style={ {
							"animation-delay": `${ index() * 0.3 + 0.5 }s`
						} } class="text-white text-xl leading-6 opacity-0 animate-fadeIn font-bold font-montserrat">{ symbol.toUpperCase() }</h1>
						<h2 style={ {
							"animation-delay": `${ index() * 0.3 + 0.7 }s`
						} } class="text-white/90 font-semibold opacity-0 animate-fadeIn leading-6 text-xl font-montserrat">${ current_price == 0 ? current_price : current_price >= 100 ? Math.round(current_price) : current_price >= 0.1 ? current_price.toFixed(2) : current_price.toPrecision(2) }</h2>
					</div>
					<h3 style={ {
						"animation-delay": `${ index() * 0.3 + 1 }s`
					} } class="text-white/65 text-xl opacity-0 font-[600] animate-fadeIn font-montserrat self-center ml-auto">{ price_change_percentage_24h.toFixed(2) }%</h3>
				</div>
			}
		</For>
	</div>
};

export default Crypto;