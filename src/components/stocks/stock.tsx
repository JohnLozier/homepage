import { AiFillApple, AiOutlineAmazon, AiOutlineGoogle } from "solid-icons/ai";
import { BsMicrosoft, BsNvidia } from "solid-icons/bs";
import { SiTesla } from "solid-icons/si";

import { Match, Switch, type Accessor } from "solid-js";
import BTC from "../../assets/stocks/BTC.svg";
import DOGE from "../../assets/stocks/DOG.svg";
import ETH from "../../assets/stocks/ETH.svg";
import NASDAQ from "../../assets/stocks/NASDAQ.svg";
import DOW from "../../assets/stocks/DOW.svg";
import { IconTypes } from "solid-icons";
import { getStocks } from "../../lib/finance";
import { TbBrandMeta } from "solid-icons/tb";
import { IoGameController } from "solid-icons/io";
const icons = {
	ETH,
	BTC,
	DOGE,
	AAPL: AiFillApple,
	GOOG: AiOutlineGoogle,
	MSFT: BsMicrosoft,
	AMZN: AiOutlineAmazon,
	NVDA: BsNvidia,
	META: TbBrandMeta,
	TSLA: SiTesla,
	GME: IoGameController,
	IXIC: NASDAQ,
	DJI: DOW
};

type StockType<T extends ReturnType<typeof getStocks>> = T extends (infer V)[] ? V : never

const Stock = ({
	symbol,
	price,
	percent_change,
	name
}: StockType<ReturnType<typeof getStocks>>, index: Accessor<number>) => {
	return <div class="flex min-w-64 flex-row">
		<Switch fallback={ <h4 style={ {
			"animation-delay": `${ index() * 0.15 }s`
		} } class="text-white w-12 h-12 font-montserrat font-bold text-center content-center animate-fadeIn select-none opacity-0 ">{
				name.replace(/\s.*/, "").toUpperCase()
			}</h4> }>
			<Match when={ typeof icons[symbol as keyof typeof icons] == "string" }>
				<img draggable="false" style={ {
					"animation-delay": `${ index() * 0.15 }s`
				} } class="self-center animate-fadeIn select-none opacity-0 w-12 h-12" src={ icons[symbol as keyof typeof icons] as string }/>
			</Match>
			<Match when={ icons[symbol as keyof typeof icons] }>
				{
					(() => {
						const Icon = icons[symbol as keyof typeof icons] as IconTypes;

						return <Icon style={ {
							"animation-delay": `${ index() * 0.15 }s`
						} } class="self-center text-white animate-fadeIn select-none opacity-0 w-10 m-1 h-10" />
					})()
				}
			</Match>
		</Switch>
		<div class="flex ml-2 flex-col mr-4">
			<h1 style={ {
				"animation-delay": `${ index() * 0.15 + 0.25 }s`
			} } class="text-white text-xl leading-6 opacity-0 animate-fadeIn font-bold font-montserrat whitespace-nowrap">{ [ "SPX", "IXIC", "DJI" ].includes(symbol) ? name : symbol }</h1>
			<h2 style={ {
				"animation-delay": `${ index() * 0.15 + 0.35 }s`
			} } class="text-white/90 font-semibold opacity-0 animate-fadeIn leading-6 text-xl font-montserrat">${ price == 0 ? price : price >= 100 ? Math.round(price) : price >= 0.1 ? price.toFixed(2) : price.toPrecision(2) }</h2>
		</div>
		<h3 style={ {
			"animation-delay": `${ index() * 0.15 + 0.5 }s`
		} } class="text-white/65 text-xl opacity-0 font-[600] animate-fadeIn font-montserrat self-center ml-auto">{ percent_change.toFixed(2) }%</h3>
	</div>
};

export default Stock;