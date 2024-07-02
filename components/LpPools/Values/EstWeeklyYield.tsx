import { useQueryClient } from "react-query"
import { useWallet } from "@noahsaso/cosmodal"

import { getReadableValue } from "data/utils"
import { APR, VAULT_USER_DEPOSIT } from "constants/keyNames"

interface PropsType {
    type: string
    base: string
    pair: string
    lpDecimals: number
}

const EstWeeklyYield = ({type, base, pair, lpDecimals}: PropsType) => {
    const queryClient = useQueryClient()
    const {
        address: walletAddress
    } = useWallet()
    const apr: string = queryClient.getQueryData([type, base, pair, APR]) || "0"
    const userDeposit: string = queryClient.getQueryData([type, base, pair, walletAddress, VAULT_USER_DEPOSIT]) || "0"
    const estWeeklyYield = ((Number(userDeposit) / Math.pow(10, lpDecimals)) * (Number(apr) / 100) / (365 / 7)).toString()
    return (
        <>
            <p className="primary-color font-td-3">${getReadableValue(estWeeklyYield)}</p>
        </>
    )
}

export default EstWeeklyYield
