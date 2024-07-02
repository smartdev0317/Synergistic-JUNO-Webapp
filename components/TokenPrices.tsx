import {useQueryClient} from "react-query"
import Image from "next/image"

import syne from './images/png/syne.png';
import wynd from './images/png/wynd.png';
import loop from './images/png/loop.png';
import { TokenPrice } from "data/types";
import { LOOP, TOKEN_PRICES, WYND } from "constants/keyNames";

interface PropsType {
    isMobile: boolean
}

const TokenPrices = ({isMobile}: PropsType) => {
    const queryClient = useQueryClient()
    const token_prices: TokenPrice[] | undefined = queryClient.getQueryData(TOKEN_PRICES)
    const synePrice = "TBD"
    // const synePrice = Number(token_prices && token_prices.find(each => each.symbol === SYNE)?.unitPrice).toFixed(4)
    const wyndPrice = `$${Number(token_prices && token_prices.find(each => each.symbol === WYND)?.unitPrice).toFixed(4)}`
    const loopPrice = `$${Number(token_prices && token_prices.find(each => each.symbol === LOOP)?.unitPrice).toFixed(4)}`
    return (
        <div className={`${isMobile ? 'flex justify-center lg:hidden w-full' : 'absolute top:0 left:0 w-full h-full items-center justify-center hidden lg:flex'}`}>
            <div className="flex border-full balance-bg-color font-balance py-1 px-2 mx-2 rounded-full items-center">
                    <Image src={syne} alt="SYNE" width={20} />
                    <p  className='ml-2'>{`SYNE ${synePrice}`}</p>
            </div>
            <div className="flex balance-bg-color font-balance py-1 px-2 mx-2 rounded-full items-center">
                    <Image src={wynd} alt="WUMD" width={20} />
                    <p  className='ml-2'>{`WYND ${wyndPrice}`}</p>
            </div>
            <div className="flex border-full balance-bg-color font-balance py-1 px-2 mx-2 rounded-full items-center">
                    <Image src={loop} alt="LOOP" width={20} />
                    <p  className='ml-2'>{`LOOP ${loopPrice}`}</p>
            </div>
        </div>
    )
}

export default TokenPrices
